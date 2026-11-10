// Second wave of leaders: two more candidates for every age, so each seat draws 3 from 6.
// Each entry carries its own "Learn more" text and Wikipedia page. Loaded after data.js and extra.js.

(function (data, extra) {
  const MORE = [
    // 500 – 300 BC · Ruler
    [
      { name: 'Alexander the Great', place: 'Macedon', lived: '356–323 BC', title: 'King of Macedon', rating: 6, wiki: 'Alexander_the_Great',
        fact: 'Never lost a battle and conquered from Greece to India by the age of 30. But he left no clear heir. Asked on his deathbed who should inherit, he reportedly said "the strongest", and his generals tore the empire apart.',
        more: 'He was tutored by Aristotle as a teenager. He founded some twenty cities, many of them named Alexandria, and adopted Persian dress and customs, to the anger of his Macedonian veterans. He died in Babylon at 32, and his generals fought over the pieces for forty years.' },
      { name: 'Goujian', place: 'Yue (China)', lived: 'ruled 496–465 BC', title: 'King of Yue', rating: 7, wiki: 'Goujian',
        fact: 'Defeated and made to serve his enemy as a servant, he returned home, slept on brushwood and tasted bitter gall every day so that he would never forget. About twenty years later he wiped his enemy\'s kingdom off the map.',
        more: 'His story gave Chinese the saying "sleeping on brushwood and tasting gall", meaning to endure hardship for a future goal. A bronze sword bearing his name was found in a tomb in 1965, still sharp and almost untarnished after some 2,400 years. After his victory he turned on the advisers who had helped him win.' },
    ],
    // 300 – 100 BC · Envoy
    [
      { name: 'Lu Jia', place: 'Han China', lived: 'died c. 170 BC', title: 'Court scholar', rating: 8, wiki: 'Lu_Jia_(Western_Han)',
        fact: 'Sent to a breakaway southern kingdom, he talked its king into accepting Han authority without a battle. Years later the king rebelled and declared himself emperor, and Lu Jia went back and talked him down again.',
        more: 'The kingdom was Nanyue, covering parts of today\'s southern China and northern Vietnam, and its king was Zhao Tuo. Lu Jia also told the first Han emperor that an empire can be won on horseback but cannot be ruled from horseback, and wrote a book on why earlier dynasties had fallen.' },
      { name: 'Eudoxus of Cyzicus', place: 'Greek Egypt', lived: 'active c. 130 BC', title: 'Navigator', rating: 6, wiki: 'Eudoxus_of_Cyzicus',
        fact: 'Sailed from Egypt to India and back twice for the kings of Egypt, who confiscated his cargo both times. Convinced that Africa could be sailed around, he set out from Spain to prove it and was never heard from again.',
        more: 'On his way home from India he was blown down the East African coast, where he found a ship\'s prow that sailors told him came from Spain. That persuaded him Africa could be rounded. His voyages are among the first recorded Greek uses of the monsoon winds. The story comes from the geographer Strabo, who doubted parts of it.' },
    ],
    // 100 BC – 100 AD · General
    [
      { name: 'Surena', place: 'Parthia', lived: 'died c. 53 BC', title: 'Parthian noble', rating: 8, wiki: 'Surena',
        fact: 'With about 10,000 horsemen he destroyed a Roman army roughly four times the size at Carrhae. His trick was a train of a thousand camels carrying spare arrows, so his archers never ran out. His jealous king then had him executed.',
        more: 'The Roman commander was Crassus, the richest man in Rome and Julius Caesar\'s political partner. Parthian horse archers shot backwards as they rode away, the origin of the phrase "Parthian shot". Plutarch says Surena was not yet 30 at the time.' },
      { name: 'Boudica', place: 'Britain', lived: 'died c. 61 AD', title: 'Queen of the Iceni', rating: 5, wiki: 'Boudica',
        fact: 'Burned three Roman towns to the ground, London among them. Then she met a Roman army she outnumbered many times over, on ground of its choosing, and lost everything in an afternoon.',
        more: 'She rose after Roman officials seized her late husband\'s kingdom, had her flogged and assaulted her daughters. A layer of burnt red ash from her attack still lies beneath parts of London and Colchester. Nobody knows where the final battle was fought.' },
    ],
    // 100 – 300 AD · Scholar
    [
      { name: 'Cai Lun', place: 'Han China', lived: 'c. 50–121 AD', title: 'Palace official', rating: 9, wiki: 'Cai_Lun',
        fact: 'In 105 AD he presented the emperor with a cheap writing material made from bark, hemp, rags and old fishing nets: paper. Papermaking took about a thousand years to reach Europe.',
        more: 'He was a eunuch in charge of the palace workshops. Cruder paper already existed, but his process made it practical; before it, people in China wrote on heavy bamboo strips or costly silk. Caught up in a palace intrigue, he took poison rather than face prison.' },
      { name: 'Diophantus', place: 'Alexandria', lived: '3rd century AD', title: 'Mathematician', rating: 7, wiki: 'Diophantus',
        fact: 'Wrote the Arithmetica, a book of number puzzles that used symbols for unknown quantities. About 1,400 years later Fermat scribbled in the margin of his copy that he had a proof too large to fit there, launching the most famous unsolved problem in mathematics.',
        more: 'Almost nothing is known of his life except a riddle about his age, whose answer is that he lived to 84. Of the thirteen books of the Arithmetica, six survive in Greek and four more in Arabic translation. Fermat\'s Last Theorem was finally proved in 1994.' },
    ],
    // 300 – 500 AD · Ruler
    [
      { name: 'Gwanggaeto the Great', place: 'Goguryeo (Korea)', lived: '374–412', title: 'King of Goguryeo', rating: 8, wiki: 'Gwanggaeto_the_Great',
        fact: 'Took the throne as a teenager and in about 21 years conquered 64 fortresses and 1,400 villages. His son had the record carved on a stone slab more than 6 metres tall, which still stands.',
        more: 'His name means roughly "great expander of territory". The stone stands in what is now north-eastern China and carries about 1,800 Chinese characters. One damaged passage about Japan has been argued over by Korean, Japanese and Chinese historians for more than a century.' },
      { name: 'Shapur II', place: 'Persia', lived: '309–379', title: 'Sasanian king of kings', rating: 8, wiki: 'Shapur_II',
        fact: 'By tradition he was crowned before he was born, with the crown set on his mother\'s belly. He reigned for his entire life of 70 years, the longest of any king of his dynasty.',
        more: 'The Roman emperor Julian invaded his empire in 363 and was killed during the retreat. Shapur then dictated a peace that won back the provinces Persia had lost to Rome. His persecution of Christians followed Rome\'s turn to that religion.' },
    ],
    // 500 – 700 AD · General
    [
      { name: 'Li Jing', place: 'Tang China', lived: '571–649', title: 'Tang general', rating: 9, wiki: 'Li_Jing_(Tang_dynasty)',
        fact: 'In the winter of 630 he led 3,000 cavalry on a surprise ride into the steppe and shattered the Eastern Turkic empire that had menaced China for decades. Later legend turned him into a god.',
        more: 'He had fought for the previous dynasty and was nearly executed by the Tang founders before they decided to use him. His name was later attached to a god of Chinese legend, the Pagoda-Bearing Heavenly King, father of Nezha. A classic military text is written as a dialogue between him and his emperor.' },
      { name: 'Heraclius', place: 'Byzantium', lived: 'c. 575–641', title: 'Byzantine emperor', rating: 7, wiki: 'Heraclius',
        fact: 'With Persian armies at the gates of his capital, he left the city, marched deep into Persia and won a war that had seemed lost. Then he lived to see new Arab armies take Syria and Palestine from him within a decade.',
        more: 'He seized the throne in 610 by sailing from Carthage to overthrow a tyrant. Under him Greek replaced Latin as the official language of the empire. His decisive defeat by the Arabs came at Yarmouk in 636, against Khalid ibn al-Walid.' },
    ],
    // 700 – 900 AD · Scholar
    [
      { name: 'Al-Kindi', place: 'Baghdad', lived: 'c. 801–873', title: 'Philosopher', rating: 8, wiki: 'Al-Kindi',
        fact: 'Wrote the first known guide to breaking codes by counting how often each letter appears. The technique, frequency analysis, remained the codebreaker\'s main weapon for many centuries.',
        more: 'Known as "the Philosopher of the Arabs", he wrote hundreds of works on subjects from optics and medicine to music and perfume, and helped bring Greek philosophy into Arabic. He also promoted Indian numerals. Late in life, rivals at court had his library confiscated for a time.' },
      { name: 'Abbas ibn Firnas', place: 'Córdoba (Spain)', lived: 'c. 810–887', title: 'Inventor and poet', rating: 6, wiki: 'Abbas_ibn_Firnas',
        fact: 'According to an account written centuries later, he covered himself in feathers, fitted a pair of wings, jumped from a height and glided some distance before crashing and hurting his back. He had not thought to add a tail.',
        more: 'He worked at the court of the emirs of Córdoba and is also credited with a water clock, a way of cutting rock crystal and a kind of planetarium. The only account of the flight was written centuries later, so historians treat it with caution. A crater on the Moon is named after him.' },
    ],
    // 900 – 1100 AD · Envoy
    [
      { name: 'Gudrid Thorbjarnardóttir', place: 'Iceland', lived: 'born c. 980', title: 'Norse voyager', rating: 6, wiki: 'Gudrid_Thorbjarnardóttir',
        fact: 'According to the sagas she sailed to North America, gave birth there to the first European child born in the Americas, and later in life made a pilgrimage to Rome. Few people of her century saw so much of the world.',
        more: 'She is known as Gudrid the Far-Traveller, and her son was named Snorri. The settlement was abandoned after a few years, partly because of conflict with the native people. She ended her life as a nun in Iceland, and several later Icelandic bishops were her descendants.' },
      { name: 'Nasir Khusraw', place: 'Persia', lived: '1004 – c. 1088', title: 'Poet and traveller', rating: 7, wiki: 'Nasir_Khusraw',
        fact: 'A tax official who, after a dream at about 40, quit his job and set off on a seven-year journey to Mecca and Cairo. His travel diary is one of the best descriptions of the 11th-century Middle East.',
        more: 'His book is the Safarnama, the "Book of Travels". He was dazzled by Cairo, with its tall houses and orderly markets, and came home a missionary for its Ismaili branch of Islam. Driven out for his beliefs, he spent his last years in a remote valley in the mountains of Badakhshan, where he is still revered.' },
    ],
    // 1100 – 1300 AD · Ruler
    [
      { name: 'Saladin', place: 'Egypt and Syria', lived: '1137–1193', title: 'Sultan', rating: 8, wiki: 'Saladin',
        fact: 'United Egypt and Syria and retook Jerusalem from the Crusaders in 1187, sparing the inhabitants where the Crusaders had once massacred theirs. He gave away so much that he reportedly died without enough money to pay for his funeral.',
        more: 'He was a Kurd, born in Tikrit in what is now Iraq. His great opponent in the Third Crusade, Richard the Lionheart, never met him face to face, though the two exchanged messages and gifts. European writers, his enemies, turned him into a model of chivalry.' },
      { name: 'Frederick II', place: 'Sicily', lived: '1194–1250', title: 'Holy Roman Emperor', rating: 7, wiki: 'Frederick_II,_Holy_Roman_Emperor',
        fact: 'Spoke six languages, wrote a scientific book on falconry and won Jerusalem back by negotiation, without a battle, while excommunicated by the Pope. Contemporaries called him "the wonder of the world". His dynasty collapsed within a generation of his death.',
        more: 'He grew up in Palermo among Latin, Greek and Arabic cultures and founded the University of Naples in 1224. He was excommunicated more than once. He travelled with a menagerie that included an elephant and a giraffe.' },
    ],
    // 1300 – 1500 AD · Envoy
    [
      { name: 'Marco Polo', place: 'Venice', lived: '1254–1324', title: 'Merchant', rating: 7, wiki: 'Marco_Polo',
        fact: 'Spent 24 years away from home, 17 of them in the service of Kublai Khan. His famous book exists only because he was captured in a sea battle and dictated his stories to a cellmate who wrote romances.',
        more: 'He left Venice at 17 with his father and uncle. His book described paper money, coal and a relay postal system to disbelieving Europeans. It never mentions the Great Wall or tea, which has led a few scholars to doubt he reached China, though most accept that he did. Columbus owned a heavily annotated copy.' },
      { name: 'Ruy González de Clavijo', place: 'Castile (Spain)', lived: 'died 1412', title: 'Royal chamberlain', rating: 7, wiki: 'Ruy_González_de_Clavijo',
        fact: 'Sent by the King of Castile on a three-year round trip to Samarkand to meet the conqueror Timur. He arrived, was feasted for weeks and wrote the best European description of Timur\'s court. But Timur died soon afterwards and the hoped-for alliance came to nothing.',
        more: 'Timur had just crushed the Ottoman sultan at Ankara, and Castile hoped for an ally against the Turks. Clavijo described Samarkand\'s gardens, tented palaces and elephants, and noted that the aged Timur could barely see. On the road he travelled alongside a giraffe, a gift to Timur from the sultan of Egypt.' },
    ],
    // 1500 – 1700 AD · Scholar
    [
      { name: 'Leonardo da Vinci', place: 'Italy', lived: '1452–1519', title: 'Painter and engineer', rating: 7, wiki: 'Leonardo_da_Vinci',
        fact: 'Filled thousands of notebook pages with flying machines, armoured vehicles and anatomy drawn from some 30 dissected bodies, centuries ahead of his time. But he published almost none of it, so science had to rediscover most of what he knew.',
        more: 'He wrote his notes in mirror writing, from right to left. He finished only a small number of paintings, among them the Mona Lisa and The Last Supper. He described the hardening of the arteries and worked out how the heart\'s valves close. He spent his last years in France as a guest of the king.' },
      { name: 'Li Shizhen', place: 'Ming China', lived: '1518–1593', title: 'Physician', rating: 8, wiki: 'Li_Shizhen',
        fact: 'Spent 27 years writing an encyclopedia of medicine that describes nearly 1,900 drugs and about 11,000 prescriptions, travelling widely to check remedies himself. He died just before it was printed.',
        more: 'The book is the Compendium of Materia Medica. He failed the civil service examinations three times before turning to medicine. He corrected many errors in older texts and warned against the mercury "elixirs of immortality" still popular at court.' },
    ],
    // 1700 – 1900 AD · General
    [
      { name: 'George Washington', place: 'Virginia', lived: '1732–1799', title: 'Planter and militia officer', rating: 7, wiki: 'George_Washington',
        fact: 'Lost more battles than he won, but kept his ragged army in existence for eight years until Britain gave up. Then he did something almost unheard of: he handed back his power and went home. He did it twice.',
        more: 'The first time was in 1783, when he resigned as commander; King George III reportedly said that if he did so he would be the greatest man in the world. The second was in 1797, after two terms as president. During the war he ran a spy ring and had his army inoculated against smallpox. He enslaved hundreds of people and freed those he owned only in his will.' },
      { name: 'Nader Shah', place: 'Persia', lived: 'c. 1688–1747', title: 'Shah of Persia', rating: 9, wiki: 'Nader_Shah',
        fact: 'The son of a herdsman, he rose from bandit leader to shah, drove out every invader and in 1739 sacked Delhi, carrying off the Peacock Throne and the Koh-i-Noor diamond. He has been called the Napoleon of Persia.',
        more: 'The loot from India was so vast that he cancelled taxes in Persia for three years. Then his rule turned cruel and suspicious: he had his own son blinded, and his officers assassinated him in 1747. His empire fell apart almost at once.' },
    ],
  ];

  MORE.forEach((list, i) => list.forEach(({ wiki, more, ...leader }) => {
    data.eras[i].leaders.push(leader);
    extra.leaders[leader.name] = { wiki, more };
  }));

  extra.links.push(
    { a: 'Genghis Khan', b: 'Marco Polo', type: 'bond',
      text: 'Marco Polo spent 17 years in the service of Kublai Khan, Genghis Khan\'s grandson.' },
  );
})(
  typeof DATA !== 'undefined' ? DATA : require('./data.js'),
  typeof EXTRA !== 'undefined' ? EXTRA : require('./extra.js'),
);
