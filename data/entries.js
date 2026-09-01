// ============================================================
//  THE COLLECTION
//
//  This file is pure data — the entries themselves. Nothing in
//  here renders on screen, and the components that show these
//  entries never live in this file. To change what the archive
//  collects, edit these objects. Adding an entry here should
//  never require touching any layout code.
//
//  Each entry carries a `type` of "song" or "instrument", plus the
//  four shared fields: title, description, contributor, place.
//  Twelve real entries: eight instruments and four songs, covering
//  the five pitched for this archive and more real Khmer music.
// ============================================================

const entries = [
  {
    title: "Chapei Dang Veng",
    type: "instrument",
    description:
      "A traditional Cambodian two-stringed long-necked guitar, often played by master musicians who improvise poetic lyrics while accompanying themselves. Recognized by UNESCO as Intangible Cultural Heritage.",
    contributor: "Master Kong Nay",
    place: "Phnom Penh, Cambodia",
  },
  {
    title: "Pinpeat Ensemble",
    type: "instrument",
    description:
      "A classical Khmer orchestra featuring gongs, xylophones, drums, and oboes. This ensemble has accompanied royal ceremonies, dance dramas, and Buddhist rituals for over a thousand years.",
    contributor: "Royal University of Fine Arts",
    place: "Siem Reap, Cambodia",
  },
  {
    title: "Roneat Ek",
    type: "instrument",
    description:
      "A high-pitched wooden xylophone with twenty-one bamboo keys, and the lead instrument of the pinpeat orchestra. Its player carries the melody and sets the tempo for the rest of the ensemble.",
    contributor: "So Savoeun",
    place: "Battambang, Cambodia",
  },
  {
    title: "Skor Thom",
    type: "instrument",
    description:
      "A pair of large barrel drums struck with mallets, providing the deep heartbeat of the pinpeat orchestra and royal ceremonies. The two drums are tuned slightly apart so their tones vibrate against each other.",
    contributor: "Nop Monin",
    place: "Phnom Penh, Cambodia",
  },
  {
    title: "Kong Vong Thom",
    type: "instrument",
    description:
      "A circular rack of sixteen tuned gongs that the player circles while striking with soft mallets. It carries the low melody of the pinpeat ensemble and is the larger, older sibling of the kong toch.",
    contributor: "Ouk Samnang",
    place: "Siem Reap, Cambodia",
  },
  {
    title: "Tro",
    type: "instrument",
    description:
      "A family of bowed stringed instruments — the tro sau toch, tro sau thom, tro ou, and tro che — whose silk strings sing in the mohori and arak ensembles. Skilled players bend the notes between pitches, imitating the human voice.",
    contributor: "Chea Sreyneang",
    place: "Kandal, Cambodia",
  },
  {
    title: "Khloy",
    type: "instrument",
    description:
      "A bamboo flute played end-on, its breathy voice heard in folk ensembles and village nights. Paired with the chapei, the khloy accompanies lullabies, love songs, and improvised verse far from the palace.",
    contributor: "Ros Sopheap",
    place: "Kampong Cham, Cambodia",
  },
  {
    title: "Mohori Ensemble",
    type: "instrument",
    description:
      "A softer, more intimate ensemble that blends pinpeat and folk instruments — tro, khloy, roneat, and drums — to accompany weddings, festivals, and everyday entertainment rather than royal ceremony.",
    contributor: "Bun Rany",
    place: "Takeo, Cambodia",
  },
  {
    title: "Pleng Kar",
    type: "song",
    description:
      "The traditional Khmer wedding music repertoire performed through every stage of the ceremony, from the groom's procession to the final blessing. Passed down by village wedding ensembles, it is one of the most recognizable sounds of Khmer celebration.",
    contributor: "Traditional Khmer wedding ensembles",
    place: "Kandal, Cambodia",
  },
  {
    title: "Pleng Arak",
    type: "song",
    description:
      "The traditional healing repertoire played to call and honor spirits during Khmer ceremonies. Its hypnotic rhythms and chanted verses have accompanied ritual healing for generations.",
    contributor: "Traditional arak musicians",
    place: "Siem Reap, Cambodia",
  },
  {
    title: "Choun Por",
    type: "song",
    description:
      "The ceremonial music that welcomes the groom's procession at the start of a Khmer wedding. Lively and joyful, it signals the beginning of the marriage rituals and sets the tone for the whole celebration.",
    contributor: "Khmer wedding musicians",
    place: "Battambang, Cambodia",
  },
  {
    title: "Smot",
    type: "song",
    description:
      "Traditional Khmer Buddhist chanting repertoire, sung by monks and lay chanters at funerals and memorials. Its slow, meditative melodies carry the words of sacred texts and give voice to remembrance.",
    contributor: "Buddhist monks and chanting masters",
    place: "Phnom Penh, Cambodia",
  },
];

export default entries;
