import test from "node:test";
import assert from "node:assert/strict";
import collection from "../collection.config.js";
import { entryFormValues, saveEntryEdit } from "../lib/entry-editing.js";
import { validateEntry } from "../lib/entry-validation.js";

const OWNER = "11111111-1111-4111-8111-111111111111";
const OTHER = "22222222-2222-4222-8222-222222222222";
const ID = "33333333-3333-4333-8333-333333333333";
const entry = {
  id: ID, owner: OWNER, title_en: collection.name, title_kh: "ចម្រៀង",
  description_en: collection.description, description_kh: "រឿងរ៉ាវ",
  contributor_en: collection.curator, contributor_kh: "អ្នករួមចំណែក",
  place_en: "Phnom Penh", place_kh: "ភ្នំពេញ", type: "song", youtube_url: "",
  image: "https://example.test/current.jpg",
};
const photo = { type: "image/png", size: 1024 };

function mockClient(options = {}) {
  const calls = { updates: [], filters: [], uploads: [], removals: [], auth: 0, rpc: [] };
  const client = {
    // Defaults to an ordinary owner (not a reviewer), like most real edits.
    async rpc(name) {
      calls.rpc.push(name);
      return { data: options.rpcError ? null : options.isReviewer ?? false, error: options.rpcError ?? null };
    },
    auth: { async getUser() {
      calls.auth++;
      if (options.authThrows) throw new Error("PRIVATE AUTH ERROR");
      return { data: { user: options.user === undefined ? { id: OWNER } : options.user }, error: options.authError };
    } },
    storage: { from(bucket) {
      assert.equal(bucket, "photos");
      return {
        async upload(path, file, settings) { calls.uploads.push({ path, file, settings }); return { error: options.uploadError }; },
        getPublicUrl() { return { data: { publicUrl: options.publicUrl ?? "https://example.test/replacement.png" } }; },
        async remove(paths) { calls.removals.push(...paths); if (options.cleanupThrows) throw new Error("PRIVATE CLEANUP ERROR"); return { error: null }; },
      };
    } },
    from(table) {
      assert.equal(table, "entries");
      return { update(values) {
        calls.updates.push(values);
        const request = {
          eq(column, value) { calls.filters.push([column, value]); return request; },
          select(columns) { assert.equal(columns, "id"); return request; },
          async maybeSingle() {
            if (options.updateThrows) throw new Error("PRIVATE DATABASE ERROR");
            return { data: options.zeroRows ? null : { id: options.updatedId || ID }, error: options.updateError };
          },
        };
        return request;
      } };
    },
  };
  return { client, calls };
}

test("save filters by UUID and owner, ignores protected fields, and keeps the current photo", async () => {
  const { client, calls } = mockClient();
  const form = { ...entryFormValues(entry), title_en: `  ${entry.title_en}  `, owner: OTHER, id: OTHER, status: "published" };
  const result = await saveEntryEdit(client, entry, form, null);
  assert.equal(result.error, undefined);
  assert.equal(calls.auth, 1);
  assert.deepEqual(calls.filters, [["id", ID], ["owner", OWNER]]);
  for (const column of ["owner", "id", "image"]) assert.equal(Object.hasOwn(calls.updates[0], column), false);
  assert.equal(calls.updates[0].status, "pending");
  assert.equal(calls.updates[0].title_en, entry.title_en);
  assert.equal(result.entry.owner, OWNER);
  assert.equal(result.entry.image, entry.image);
  assert.equal(calls.uploads.length, 0);
});

test("a reviewer's edit sends no status, even if the form carries one", async () => {
  const { client, calls } = mockClient({ isReviewer: true });
  const form = { ...entryFormValues(entry), status: "returned" };
  const result = await saveEntryEdit(client, entry, form, null);
  assert.ok(result.entry);
  assert.deepEqual(calls.rpc, ["is_reviewer"]);
  assert.equal(Object.hasOwn(calls.updates[0], "status"), false);
});

test("a non-reviewer's edit goes back to pending, including when is_reviewer fails or is not exactly true", async () => {
  for (const options of [{ isReviewer: false }, { isReviewer: null }, { isReviewer: "true" }, { rpcError: { message: "PRIVATE RPC ERROR" } }]) {
    const { client, calls } = mockClient(options);
    const result = await saveEntryEdit(client, entry, entryFormValues(entry), null);
    assert.ok(result.entry);
    assert.deepEqual(calls.rpc, ["is_reviewer"]);
    assert.equal(calls.updates[0].status, "pending");
  }
});

test("a non-reviewer's edit still fails when no row comes back", async () => {
  const { client, calls } = mockClient({ zeroRows: true });
  const result = await saveEntryEdit(client, entry, entryFormValues(entry), null);
  assert.equal(calls.updates[0].status, "pending");
  assert.equal(result.entry, undefined);
  assert.match(result.error, /^Your changes were not saved\./);
});

test("duplicate titles update separate UUIDs", async () => {
  for (const id of [ID, OTHER]) {
    const { client, calls } = mockClient({ updatedId: id });
    const result = await saveEntryEdit(client, { ...entry, id }, entryFormValues(entry), null);
    assert.equal(result.entry.id, id);
    assert.deepEqual(calls.filters[0], ["id", id]);
  }
});

test("another account, a signed-out account, or failed auth cannot upload or update", async () => {
  for (const options of [{ user: { id: OTHER } }, { user: null }, { authError: { message: "PRIVATE AUTH ERROR" } }, { authThrows: true }]) {
    const { client, calls } = mockClient(options);
    const result = await saveEntryEdit(client, entry, entryFormValues(entry), photo);
    assert.ok(result.error);
    assert.equal(result.entry, undefined);
    assert.equal(calls.updates.length, 0);
    assert.equal(calls.uploads.length, 0);
    assert.ok(!result.error.includes("PRIVATE"));
  }
});

test("zero affected rows, RLS rejection and network failure never report success", async () => {
  for (const options of [{ zeroRows: true }, { updateError: { code: "42501", message: "PRIVATE DATABASE ERROR" } }, { updateThrows: true }]) {
    const { client } = mockClient(options);
    const result = await saveEntryEdit(client, entry, entryFormValues(entry), null);
    assert.ok(result.error);
    assert.equal(result.entry, undefined);
    assert.ok(!result.error.includes("PRIVATE"));
  }
});

test("successful replacement uploads to the owner's folder and keeps the old file", async () => {
  for (const [type, extension] of [["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"]]) {
    const { client, calls } = mockClient();
    const result = await saveEntryEdit(client, entry, entryFormValues(entry), { type, size: 5 * 1024 * 1024 });
    assert.ok(result.entry);
    assert.ok(calls.uploads[0].path.startsWith(OWNER + "/"));
    assert.ok(calls.uploads[0].path.endsWith("." + extension));
    assert.equal(calls.uploads[0].settings.upsert, false);
    assert.equal(calls.updates[0].image, "https://example.test/replacement.png");
    assert.equal(calls.removals.length, 0);
  }
});

test("failed saves remove only the new photo; failed cleanup still reports failure", async () => {
  for (const options of [{ zeroRows: true }, { updateError: { message: "PRIVATE ERROR" } }, { updateThrows: true }, { zeroRows: true, cleanupThrows: true }]) {
    const { client, calls } = mockClient(options);
    const result = await saveEntryEdit(client, entry, entryFormValues(entry), photo);
    assert.ok(result.error);
    assert.equal(result.entry, undefined);
    assert.deepEqual(calls.removals, [calls.uploads[0].path]);
    assert.ok(!calls.removals.includes(entry.image));
  }
});

test("upload failure or an empty image URL prevents updating the entry", async () => {
  for (const options of [{ uploadError: { message: "PRIVATE STORAGE ERROR" } }, { publicUrl: "   " }]) {
    const { client, calls } = mockClient(options);
    const result = await saveEntryEdit(client, entry, entryFormValues(entry), photo);
    assert.ok(result.error);
    assert.equal(calls.updates.length, 0);
    assert.ok(!result.error.includes("PRIVATE"));
  }
});

test("shared validation keeps existing bilingual rules and rejects invalid replacement photos", async () => {
  const form = entryFormValues(entry);
  assert.deepEqual(validateEntry(form, null, entry.image), {});
  assert.match(validateEntry(form, null).photo, /^Photo is required\./);
  for (const key of ["title", "description", "contributor", "place"]) {
    assert.ok(validateEntry({ ...form, [`${key}_en`]: " " }, null, entry.image)[`${key}_en`]);
    assert.ok(validateEntry({ ...form, [`${key}_kh`]: " " }, null, entry.image)[`${key}_kh`]);
  }
  for (const file of [{ type: "image/gif", size: 10 }, { type: "image/png", size: 5 * 1024 * 1024 + 1 }]) {
    const { client, calls } = mockClient();
    const result = await saveEntryEdit(client, entry, form, file);
    assert.ok(result.errors.photo);
    assert.equal(calls.uploads.length, 0);
    assert.equal(calls.updates.length, 0);
  }
});
