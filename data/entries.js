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
    titleEn: "Chapei Dang Veng",
    titleKh: "ចាប៉ីដងវែង",
    image: "/images/ChapeiDangVeng.jpg",
    type: "instrument",
    description:
      "A traditional Cambodian two-stringed long-necked guitar, often played by master musicians who improvise poetic lyrics while accompanying themselves. Recognized by UNESCO as Intangible Cultural Heritage.",
    descriptionEn:
      "A traditional Cambodian two-stringed long-necked guitar, often played by master musicians who improvise poetic lyrics while accompanying themselves. Recognized by UNESCO as Intangible Cultural Heritage.",
    descriptionKh:
      "ចាប៉ីដងវែងជាឧបករណ៍ខ្សែពីរដងវែងបែបប្រពៃណីខ្មែរ ដែលជាញឹកញាប់លេងដោយអ្នកភ្លេងជំនាញ និងច្រៀងកំណាព្យភ្លាមៗអមជាមួយការលេងរបស់ខ្លួន។ ត្រូវបានអង្គការយូណេស្កូទទួលស្គាល់ជាបេតិកភណ្ឌវប្បធម៌អរូបី។",
    contributor: "Master Kong Nay",
    contributorEn: "Master Kong Nay",
    contributorKh: "លោកគ្រូ គង់ ណៃ",
    place: "Phnom Penh, Cambodia",
    placeEn: "Phnom Penh, Cambodia",
    placeKh: "រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា",
  },
  {
    title: "Pinpeat Ensemble",
    titleEn: "Pinpeat Ensemble",
    titleKh: "វង់ពិណពាទ្យ",
    image: "/images/Pinpeat.jpg",
    type: "instrument",
    description:
      "A classical Khmer orchestra featuring gongs, xylophones, drums, and oboes. This ensemble has accompanied royal ceremonies, dance dramas, and Buddhist rituals for over a thousand years.",
    descriptionEn:
      "A classical Khmer orchestra featuring gongs, xylophones, drums, and oboes. This ensemble has accompanied royal ceremonies, dance dramas, and Buddhist rituals for over a thousand years.",
    descriptionKh:
      "វង់តន្ត្រីខ្មែរបុរាណដែលមានគង រនាត ស្គរ និងស្រឡៃ។ វង់តន្ត្រីនេះបានប្រគំអមព្រះរាជពិធី ល្ខោនរបាំ និងពិធីព្រះពុទ្ធសាសនាអស់រយៈពេលជាងមួយពាន់ឆ្នាំមកហើយ។",
    contributor: "Royal University of Fine Arts",
    contributorEn: "Royal University of Fine Arts",
    contributorKh: "សាកលវិទ្យាល័យភូមិន្ទវិចិត្រសិល្បៈ",
    place: "Siem Reap, Cambodia",
    placeEn: "Siem Reap, Cambodia",
    placeKh: "ខេត្តសៀមរាប ប្រទេសកម្ពុជា",
  },
  {
    title: "Roneat Ek",
    titleEn: "Roneat Ek",
    titleKh: "រនាតឯក",
    image: "/images/RoneatEk.jpg",
    type: "instrument",
    description:
      "A high-pitched wooden xylophone with twenty-one bamboo keys, and the lead instrument of the pinpeat orchestra. Its player carries the melody and sets the tempo for the rest of the ensemble.",
    descriptionEn:
      "A high-pitched wooden xylophone with twenty-one bamboo keys, and the lead instrument of the pinpeat orchestra. Its player carries the melody and sets the tempo for the rest of the ensemble.",
    descriptionKh:
      "រនាតឯកជាឧបករណ៍វាយធ្វើពីឈើ មានបន្ទះឫស្សីចំនួនម្ភៃមួយ និងជាឧបករណ៍នាំមុខក្នុងវង់ពិណពាទ្យ។ អ្នកលេងរនាតឯកជាអ្នកកាន់បទភ្លេង និងកំណត់ចង្វាក់សម្រាប់វង់ទាំងមូល។",
    contributor: "So Savoeun",
    contributorEn: "So Savoeun",
    contributorKh: "សូ សាវឿន",
    place: "Battambang, Cambodia",
    placeEn: "Battambang, Cambodia",
    placeKh: "ខេត្តបាត់ដំបង ប្រទេសកម្ពុជា",
  },
  {
    title: "Skor Thom",
    titleEn: "Skor Thom",
    titleKh: "ស្គរធំ",
    image: "/images/SkorThom.jpg",
    type: "instrument",
    description:
      "A pair of large barrel drums struck with mallets, providing the deep heartbeat of the pinpeat orchestra and royal ceremonies. The two drums are tuned slightly apart so their tones vibrate against each other.",
    descriptionEn:
      "A pair of large barrel drums struck with mallets, providing the deep heartbeat of the pinpeat orchestra and royal ceremonies. The two drums are tuned slightly apart so their tones vibrate against each other.",
    descriptionKh:
      "ស្គរធំជាគូស្គររាងធុងធំៗ វាយដោយដំបងស្គរ បង្កើតសំឡេងជ្រៅដូចចង្វាក់បេះដូងនៃវង់ពិណពាទ្យ និងព្រះរាជពិធី។ ស្គរទាំងពីរត្រូវបានសម្រួលសំឡេងឱ្យខុសគ្នាបន្តិច ដើម្បីឱ្យសំឡេងរបស់វាញ័រឆ្លើយតបគ្នា។",
    contributor: "Nop Monin",
    contributorEn: "Nop Monin",
    contributorKh: "នព មុនីន",
    place: "Phnom Penh, Cambodia",
    placeEn: "Phnom Penh, Cambodia",
    placeKh: "រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា",
  },
  {
    title: "Kong Vong Thom",
    titleEn: "Kong Vong Thom",
    titleKh: "គងវង់ធំ",
    image: "/images/KongVongThom.jpg",
    type: "instrument",
    description:
      "A circular rack of sixteen tuned gongs that the player circles while striking with soft mallets. It carries the low melody of the pinpeat ensemble and is the larger, older sibling of the kong toch.",
    descriptionEn:
      "A circular rack of sixteen tuned gongs that the player circles while striking with soft mallets. It carries the low melody of the pinpeat ensemble and is the larger, older sibling of the kong toch.",
    descriptionKh:
      "គងវង់ធំជាគងចំនួនដប់ប្រាំមួយដែលរៀបជារង្វង់ ហើយអ្នកលេងដើរជុំវិញវាយដោយដំបងទន់។ វាដើរបទភ្លេងសំឡេងទាបរបស់វង់ពិណពាទ្យ និងជាបងប្អូនធំចាស់ជាងគេរបស់គងតូច។",
    contributor: "Ouk Samnang",
    contributorEn: "Ouk Samnang",
    contributorKh: "អ៊ុក សំណាង",
    place: "Siem Reap, Cambodia",
    placeEn: "Siem Reap, Cambodia",
    placeKh: "ខេត្តសៀមរាប ប្រទេសកម្ពុជា",
  },
  {
    title: "Tro",
    titleEn: "Tro",
    titleKh: "ទ្រ",
    image: "/images/Tro.jpg",
    type: "instrument",
    description:
      "A family of bowed stringed instruments — the tro sau toch, tro sau thom, tro ou, and tro che — whose silk strings sing in the mohori and arak ensembles. Skilled players bend the notes between pitches, imitating the human voice.",
    descriptionEn:
      "A family of bowed stringed instruments — the tro sau toch, tro sau thom, tro ou, and tro che — whose silk strings sing in the mohori and arak ensembles. Skilled players bend the notes between pitches, imitating the human voice.",
    descriptionKh:
      "ទ្រជាក្រុមឧបករណ៍ខ្សែប្រើធ្នូ រួមមានទ្រសោតូច ទ្រសោធំ ទ្រអ៊ូ និងទ្រឆេ ដែលខ្សរសូត្ររបស់វាបន្លឺសំឡេងក្នុងវង់មហោរី និងអារក្ស។ អ្នកលេងជំនាញអាចបត់សំឡេងរវាងកម្ពស់សំឡេង ដើម្បីធ្វើត្រាប់តាមសំឡេងមនុស្ស។",
    contributor: "Chea Sreyneang",
    contributorEn: "Chea Sreyneang",
    contributorKh: "ជា ស្រីនាង",
    place: "Kandal, Cambodia",
    placeEn: "Kandal, Cambodia",
    placeKh: "ខេត្តកណ្តាល ប្រទេសកម្ពុជា",
  },
  {
    title: "កន្សែងក្រហម",
    slug: "kanseng-kraham",
    titleEn: "Kansaeng Kraham",
    titleKh: "កន្សែងក្រហម",
    image: "/images/KansaengKraham.jpg",
    type: "song",
    description:
      "A traditional Khmer song about a red scarf, often sung as a gentle love song expressing affection and remembrance.",
    descriptionEn:
      "A traditional Khmer song about a red scarf, often sung as a gentle love song expressing affection and remembrance.",
    descriptionKh:
      "កន្សែងក្រហមជាបទចម្រៀងប្រពៃណីខ្មែរ អំពីកន្សែងពណ៌ក្រហម ដែលច្រៀងបែបបទស្នេហាដ៏ទន់ភ្លន់ ដើម្បីបង្ហាញសេចក្តីស្រឡាញ់ និងការនឹករឭក។",
    contributor: "Ros Sopheap",
    contributorEn: "Ros Sopheap",
    contributorKh: "រស់ សុភ័ព្ទ",
    place: "Kampong Cham, Cambodia",
    placeEn: "Kampong Cham, Cambodia",
    placeKh: "ខេត្តកំពង់ចាម ប្រទេសកម្ពុជា",
  },
  {
    title: "បាយខុន",
    slug: "baykhon",
    titleEn: "Baykhon",
    titleKh: "បាយខុន",
    image: "/images/Baykhon.jpg",
    type: "song",
    description:
      "A traditional Khmer song associated with the Baykhon wedding blessing ceremony. It is performed to offer good wishes and bring happiness to the newly married couple.",
    descriptionEn:
      "A traditional Khmer song associated with the Baykhon wedding blessing ceremony. It is performed to offer good wishes and bring happiness to the newly married couple.",
    descriptionKh:
      "បាយខុនជាបទចម្រៀងប្រពៃណីខ្មែរ ដែលពាក់ព័ន្ធនឹងពិធីសំពះផ្ទឹមក្នុងមង្គលការ។ បទនេះប្រគំដើម្បីជូនពរ និងនាំសុភមង្គលដល់គូស្វាមីភរិយាថ្មី។",
    contributor: "Bun Rany",
    contributorEn: "Bun Rany",
    contributorKh: "ប៊ុន រ៉ានី",
    place: "Takeo, Cambodia",
    placeEn: "Takeo, Cambodia",
    placeKh: "ខេត្តតាកែវ ប្រទេសកម្ពុជា",
  },
  {
    title: "Pleng Kar",
    titleEn: "Pleng Kar",
    titleKh: "ភ្លេងការ",
    image: "/images/PlengKar.jpg",
    type: "song",
    description:
      "The traditional Khmer wedding music repertoire performed through every stage of the ceremony, from the groom's procession to the final blessing. Passed down by village wedding ensembles, it is one of the most recognizable sounds of Khmer celebration.",
    descriptionEn:
      "The traditional Khmer wedding music repertoire performed through every stage of the ceremony, from the groom's procession to the final blessing. Passed down by village wedding ensembles, it is one of the most recognizable sounds of Khmer celebration.",
    descriptionKh:
      "ភ្លេងការជាសំណុំបទភ្លេងមង្គលការខ្មែរ ដែលប្រគំគ្រប់ដំណាក់កាលនៃពិធី ចាប់ពីដង្ហែរកូនកំលោះរហូតដល់ពិធីជូនពរចុងក្រោយ។ បទភ្លេងនេះត្រូវបានបន្តពីវង់ភ្លេងការតាមភូមិ និងជាសំឡេងមួយដែលគេស្គាល់ច្បាស់បំផុតនៃការអបអររបស់ខ្មែរ។",
    contributor: "Traditional Khmer wedding ensembles",
    contributorEn: "Traditional Khmer wedding ensembles",
    contributorKh: "វង់ភ្លេងការខ្មែរ​ប្រពៃណី",
    place: "Kandal, Cambodia",
    placeEn: "Kandal, Cambodia",
    placeKh: "ខេត្តកណ្តាល ប្រទេសកម្ពុជា",
  },
  {
    title: "Pleng Arak",
    titleEn: "Pleng Arak",
    titleKh: "ភ្លេងអារក្ស",
    image: "/images/PlengArak.png",
    type: "song",
    description:
      "The traditional healing repertoire played to call and honor spirits during Khmer ceremonies. Its hypnotic rhythms and chanted verses have accompanied ritual healing for generations.",
    descriptionEn:
      "The traditional healing repertoire played to call and honor spirits during Khmer ceremonies. Its hypnotic rhythms and chanted verses have accompanied ritual healing for generations.",
    descriptionKh:
      "ភ្លេងអារក្សជាសំណុំបទភ្លេងព្យាបាលបែបប្រពៃណី ដែលលេងដើម្បីហៅ និងគោរពវិញ្ញាណក្នុងពិធីខ្មែរ។ ចង្វាក់ដែលធ្វើឱ្យស្រមៃ និងទំនុកច្រៀងបែបសូត្ររបស់វាបានអមពិធីព្យាបាលតាមជំនឿជាច្រើនជំនាន់មកហើយ។",
    contributor: "Traditional arak musicians",
    contributorEn: "Traditional arak musicians",
    contributorKh: "អ្នកភ្លេងអារក្សប្រពៃណី",
    place: "Siem Reap, Cambodia",
    placeEn: "Siem Reap, Cambodia",
    placeKh: "ខេត្តសៀមរាប ប្រទេសកម្ពុជា",
  },
  {
    title: "Choun Por",
    titleEn: "Choun Por",
    titleKh: "ជូនពរ",
    image: "/images/ChonPor.png",
    type: "song",
    description:
      "The ceremonial music that welcomes the groom's procession at the start of a Khmer wedding. Lively and joyful, it signals the beginning of the marriage rituals and sets the tone for the whole celebration.",
    descriptionEn:
      "The ceremonial music that welcomes the groom's procession at the start of a Khmer wedding. Lively and joyful, it signals the beginning of the marriage rituals and sets the tone for the whole celebration.",
    descriptionKh:
      "ជូនពរជាបទភ្លេងពិធីដែលទទួលស្វាគមន៍ដង្ហែរកូនកំលោះនៅដើមពិធីមង្គលការខ្មែរ។ បទភ្លេងនេះមានភាពរស់រវើក និងរីករាយ ជាសញ្ញាបង្ហាញការចាប់ផ្តើមពិធីអាពាហ៍ពិពាហ៍ និងកំណត់បរិយាកាសសម្រាប់ការអបអរទាំងមូល។",
    contributor: "Khmer wedding musicians",
    contributorEn: "Khmer wedding musicians",
    contributorKh: "អ្នកភ្លេងមង្គលការខ្មែរ",
    place: "Battambang, Cambodia",
    placeEn: "Battambang, Cambodia",
    placeKh: "ខេត្តបាត់ដំបង ប្រទេសកម្ពុជា",
  },
  {
    title: "Smot",
    titleEn: "Smot",
    titleKh: "ស្មូត",
    image: "/images/smot.jpg",
    type: "song",
    description:
      "Traditional Khmer Buddhist chanting repertoire, sung by monks and lay chanters at funerals and memorials. Its slow, meditative melodies carry the words of sacred texts and give voice to remembrance.",
    descriptionEn:
      "Traditional Khmer Buddhist chanting repertoire, sung by monks and lay chanters at funerals and memorials. Its slow, meditative melodies carry the words of sacred texts and give voice to remembrance.",
    descriptionKh:
      "ស្មូតជាសំណុំបទសូត្រព្រះពុទ្ធសាសនាខ្មែរ ដែលព្រះសង្ឃ និងអ្នកសូត្រគ្រហស្ថសូត្រនៅពិធីបុណ្យសព និងពិធីរំឭកវិញ្ញាណក្ខន្ធ។ បទភ្លេងយឺត និងសមាធិរបស់វានាំពាក្យក្នុងគម្ពីរពិសិដ្ឋ និងបង្ហាញការចងចាំ។",
    contributor: "Buddhist monks and chanting masters",
    contributorEn: "Buddhist monks and chanting masters",
    contributorKh: "ព្រះសង្ឃ និងគ្រូស្មូត",
    place: "Phnom Penh, Cambodia",
    placeEn: "Phnom Penh, Cambodia",
    placeKh: "រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា",
  },
];

entries.forEach((entry) => {
  entry.youtubeUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(entry.titleEn + " Khmer music");
  entry.tags = [entry.type, "Khmer music", entry.placeEn.split(",")[0]];
});

export default entries;
