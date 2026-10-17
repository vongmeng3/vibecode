import { notFound } from "next/navigation";
import EntryEditor from "../../../../../components/EntryEditor.js";
import { isEntryId } from "../../../../../lib/entry-slugs.js";

export default async function EditEntryPage({ params }) {
  const { id } = await params;
  if (!isEntryId(id)) notFound();
  return <EntryEditor id={id} />;
}
