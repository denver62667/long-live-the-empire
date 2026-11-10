// All game content lives here: seats, eras, leaders, crises and the tuning numbers.
// Ratings are 1-10 and are hidden from the player until after they choose.

const DATA = {
  startYear: -500,
  endYear: 1900,
  startStability: 3,
  maxStability: 4,
  stewardStrength: 3,

  seats: {
    ruler:   { name: 'Ruler',   icon: '👑' },
    general: { name: 'General', icon: '⚔️' },
    scholar: { name: 'Scholar', icon: '📜' },
    envoy:   { name: 'Envoy',   icon: '🧭' },
  },

  // Chance that a crisis response works.
  // strength = the seat holder's current strength, mod = how well that approach suits the crisis,
  // eraIndex makes later crises slightly harder.
  chance(strength, mod, eraIndex) {
    // Tuned by simulation: random play survives all 12 eras about 2% of the time,
    // perfect knowledge about 23%.
    const p = 0.085 * (strength + mod) - 0.01 * eraIndex;
    return Math.max(0.05, Math.min(0.95, p));
  },

  // A legacy loses 1 strength for every 2 eras since the leader was appointed.
  fade(erasHeld) {
    return Math.floor(erasHeld / 2);
  },

  eras: [
    {
      label: '500 – 300 BC', seat: 'ruler',
      leaders: [
        { name: 'Darius the Great', place: 'Persia', lived: 'c. 550–486 BC', title: 'King of Persia', rating: 9,
          fact: 'Built a 2,700 km Royal Road that his mounted couriers could cross in nine days. Herodotus\'s praise of those couriers became the unofficial motto of the US postal service.' },
        { name: 'Pericles', place: 'Athens', lived: 'c. 495–429 BC', title: 'Statesman of Athens', rating: 6,
          fact: 'Led Athens through its golden age and built the Parthenon. Then, in wartime, he packed the population inside the city walls, where a plague killed perhaps a quarter of them, himself included.' },
        { name: 'Chandragupta Maurya', place: 'India', lived: 'c. 350–295 BC', title: 'Founder of the Maurya Empire', rating: 9,
          fact: 'Unified most of the Indian subcontinent and gave 500 war elephants to Alexander\'s successor in exchange for territory. By Jain tradition he then gave up the throne to become a monk.' },
        { name: 'Philip II', place: 'Macedon', lived: '382–336 BC', title: 'King of Macedon', rating: 8,
          fact: 'Turned a backwater kingdom into the master of Greece and armed his infantry with pikes up to 6 metres long. His son Alexander inherited that army and conquered Persia with it.' },
      ],
      crisis: {
        year: -430, title: 'Plague in the capital',
        text: 'War has crowded refugees inside your walls, and now a sickness is killing them by the thousand.',
        options: [
          { seat: 'ruler', label: 'Keep order and bury the dead', mod: 1,
            win: 'held the city together until the sickness burned out.', lose: 'could not stop the panic, and the city emptied.' },
          { seat: 'scholar', label: 'Hunt for the cause of the sickness', mod: 0,
            win: 'traced it to the crowded quarters and cleared them.', lose: 'found nothing, and the dying went on.' },
        ],
        fact: 'The Plague of Athens (430 BC) killed perhaps a quarter of the city. Its cause is still debated today.',
      },
    },
    {
      label: '300 – 100 BC', seat: 'envoy',
      leaders: [
        { name: 'Zhang Qian', place: 'Han China', lived: 'died c. 114 BC', title: 'Imperial envoy', rating: 9,
          fact: 'Sent west to find allies, he was captured and held for more than a decade, escaped, and carried on with the mission. His reports opened what became the Silk Road.' },
        { name: 'Megasthenes', place: 'Greece', lived: 'died c. 290 BC', title: 'Ambassador to India', rating: 7,
          fact: 'Lived at the court of Chandragupta Maurya and wrote the first detailed Western account of India. Much of it was accurate, though he also passed on tales of gold-digging ants.' },
        { name: 'Cineas', place: 'Thessaly', lived: 'active c. 280 BC', title: 'Adviser to King Pyrrhus', rating: 7,
          fact: 'King Pyrrhus said Cineas had won him more cities with words than he had won with his armies. He reputedly learned the name of every Roman senator within a day of arriving.' },
        { name: 'Mahinda', place: 'India', lived: '3rd century BC', title: 'Buddhist monk', rating: 7,
          fact: 'By tradition the son of Emperor Ashoka. He led the mission that converted the king of Sri Lanka, bringing Buddhism to an island where it has remained for 2,200 years.' },
      ],
      crisis: {
        year: -218, title: 'An army crosses the mountains',
        text: 'A brilliant enemy general has marched his war elephants over the mountains and into your heartland.',
        options: [
          { seat: 'general', label: 'Meet him in open battle', mod: -2,
            win: 'broke the invader in a single battle.', lose: 'was encircled and the army destroyed.' },
          { seat: 'envoy', label: 'Avoid battle and peel away his allies', mod: 1,
            win: 'left the invader stranded without friends or supplies.', lose: 'won no one over, and the invader marched on.' },
          { seat: 'ruler', label: 'Refuse battle and wear him down', mod: 0,
            win: 'shadowed the invader until his army withered.', lose: 'lost the people\'s patience as the countryside burned.' },
        ],
        fact: 'Hannibal crossed the Alps in 218 BC and crushed Roman armies in open battle for years. Rome survived by refusing to fight him head-on, the "Fabian strategy".',
      },
    },
    {
      label: '100 BC – 100 AD', seat: 'general',
      leaders: [
        { name: 'Julius Caesar', place: 'Rome', lived: '100–44 BC', title: 'Roman general', rating: 9,
          fact: 'At Alesia he besieged a fortress while a relief army besieged him. He built two rings of walls, one facing in and one facing out, and beat both forces.' },
        { name: 'Arminius', place: 'Germania', lived: 'c. 18 BC – 21 AD', title: 'Chieftain of the Cherusci', rating: 7,
          fact: 'A Roman-trained officer who lured three entire legions into the Teutoburg Forest and wiped them out, ending Rome\'s push beyond the Rhine.' },
        { name: 'Trưng Trắc', place: 'Vietnam', lived: 'died 43 AD', title: 'Noblewoman of Giao Chỉ', rating: 6,
          fact: 'With her sister she raised a rebellion that drove out Han Chinese rule, then reigned as queen for about three years before the Han returned in force.' },
        { name: 'Ban Chao', place: 'Han China', lived: '32–102 AD', title: 'Han officer', rating: 8,
          fact: 'Starting with a party of just 36 men, he brought the kingdoms of Central Asia under Han control and held the region for three decades.' },
      ],
      crisis: {
        year: -73, title: 'The slave uprising',
        text: 'Escaped slaves have armed themselves, beaten your garrisons and are gathering followers by the day.',
        options: [
          { seat: 'general', label: 'Send the army to crush it', mod: 0,
            win: 'cornered the rebel army and ended the revolt.', lose: 'lost an army to men with nothing left to lose.' },
          { seat: 'ruler', label: 'Offer freedom and land to those who lay down arms', mod: -1,
            win: 'emptied the rebel camp with a single decree.', lose: 'was ignored, and the revolt spread.' },
        ],
        fact: 'Spartacus led an army of tens of thousands of escaped slaves that defeated several Roman forces between 73 and 71 BC.',
      },
    },
    {
      label: '100 – 300 AD', seat: 'scholar',
      leaders: [
        { name: 'Zhang Heng', place: 'Han China', lived: '78–139 AD', title: 'Court astronomer', rating: 9,
          fact: 'In 132 AD he built a device that showed the direction of an earthquake hundreds of kilometres away: bronze dragons dropped balls into the mouths of bronze toads.' },
        { name: 'Ptolemy', place: 'Alexandria', lived: 'c. 100–170 AD', title: 'Astronomer and geographer', rating: 8,
          fact: 'His Earth-centred model of the heavens was wrong, but it predicted the planets so well that it stayed the standard for about 1,400 years.' },
        { name: 'Galen', place: 'Pergamon', lived: '129 – c. 216 AD', title: 'Physician', rating: 8,
          fact: 'Doctor to gladiators and then to emperors. His medical writings were treated as almost beyond question for some 1,300 years, mistakes included.' },
        { name: 'Liu Hui', place: 'China', lived: '3rd century AD', title: 'Mathematician', rating: 8,
          fact: 'Worked out pi as roughly 3.1416 using a polygon with 3,072 sides, and explained a method for solving sets of equations much like the one Europe later named after Gauss.' },
      ],
      crisis: {
        year: 165, title: 'The soldiers bring home a plague',
        text: 'Your returning armies carry a disease that is spreading down every road in the empire.',
        options: [
          { seat: 'scholar', label: 'Organise the physicians', mod: 0,
            win: 'isolated the sick and slowed the spread.', lose: 'could do nothing as the disease ran its course.' },
          { seat: 'ruler', label: 'Keep the grain moving and the provinces calm', mod: 0,
            win: 'kept the empire fed and loyal through the worst of it.', lose: 'watched the provinces slip into famine and unrest.' },
        ],
        fact: 'The Antonine Plague, from 165 AD, was probably smallpox and killed millions across the Roman Empire. Galen described its symptoms first-hand.',
      },
    },
    {
      label: '300 – 500 AD', seat: 'ruler',
      leaders: [
        { name: 'Constantine', place: 'Rome', lived: 'c. 272–337', title: 'Roman emperor', rating: 8,
          fact: 'Reunited the Roman Empire, legalised Christianity and founded Constantinople, which went on to serve as an imperial capital for more than 1,100 years.' },
        { name: 'Samudragupta', place: 'India', lived: 'ruled c. 335–375', title: 'Gupta emperor', rating: 8,
          fact: 'A pillar inscription credits him with defeating more than twenty kings. He was also a poet and musician, and his own coins show him playing a stringed instrument.' },
        { name: 'Ezana', place: 'Aksum (Ethiopia)', lived: 'ruled c. 320s–360', title: 'King of Aksum', rating: 7,
          fact: 'Ruled a trading empire that the Persian prophet Mani had counted among the four great powers of the world. He became Christian and was among the first rulers anywhere to put the cross on his coins.' },
        { name: 'Attila', place: 'The Huns', lived: 'c. 406–453', title: 'King of the Huns', rating: 5,
          fact: 'Forced the Roman Empire to pay him 2,100 pounds of gold a year. But he built nothing to outlast him, and his empire fell apart within about two years of his death.' },
      ],
      crisis: {
        year: 410, title: 'Whole peoples at the gates',
        text: 'Entire nations are on the move, pushed from their homelands, and they have reached your frontier.',
        options: [
          { seat: 'general', label: 'Fight them at the frontier', mod: -1,
            win: 'threw the migrants back across the river.', lose: 'lost the frontier army, and the road to the capital lay open.' },
          { seat: 'envoy', label: 'Settle them inside your borders as allies', mod: 0,
            win: 'turned the newcomers into loyal border troops.', lose: 'struck a deal that fell apart, and the newcomers turned on you.' },
          { seat: 'ruler', label: 'Pay them to go elsewhere', mod: -1,
            win: 'bought the empire a generation of peace.', lose: 'paid, and they came back for more.' },
        ],
        fact: 'In 410 the Visigoths sacked Rome. It was the first time the city had fallen to a foreign enemy in about 800 years.',
      },
    },
    {
      label: '500 – 700 AD', seat: 'general',
      leaders: [
        { name: 'Belisarius', place: 'Byzantium', lived: 'c. 500–565', title: 'Byzantine general', rating: 9,
          fact: 'Retook North Africa from the Vandals with about 15,000 men, then captured Rome with even fewer.' },
        { name: 'Khalid ibn al-Walid', place: 'Arabia', lived: 'died 642', title: 'Arab commander', rating: 10,
          fact: 'Fought dozens of battles against both the Byzantine and Persian empires, the two superpowers of his day, and is traditionally said never to have lost one.' },
        { name: 'Eulji Mundeok', place: 'Goguryeo (Korea)', lived: 'active 612', title: 'Commander of Goguryeo', rating: 8,
          fact: 'Faced an invasion that Chinese records put at over a million men. He lured some 300,000 of them deep into Korea and destroyed them at the Salsu River; reportedly only 2,700 returned.' },
        { name: 'Narses', place: 'Byzantium', lived: 'c. 478–573', title: 'Palace official', rating: 8,
          fact: 'A court eunuch who was given his first great field command in his seventies. He then finished the conquest of Italy that younger generals had failed to complete.' },
      ],
      crisis: {
        year: 536, title: 'The year without a sun',
        text: 'A strange fog has dimmed the sun for months. The summer is cold and the harvest has failed.',
        options: [
          { seat: 'scholar', label: 'Ration grain and replant with hardier crops', mod: 0,
            win: 'stretched the stores until the sky cleared.', lose: 'misjudged the stores, and the granaries ran dry.' },
          { seat: 'ruler', label: 'Open the royal granaries to the people', mod: 0,
            win: 'fed the people and kept their loyalty.', lose: 'emptied the granaries too soon, and hunger turned to revolt.' },
          { seat: 'envoy', label: 'Buy grain from abroad', mod: -2,
            win: 'found the one harbour with grain to sell.', lose: 'found every neighbour just as hungry.' },
        ],
        fact: 'In 536 volcanic eruptions veiled the sun for more than a year. Summers turned cold and crops failed from Ireland to China.',
      },
    },
    {
      label: '700 – 900 AD', seat: 'scholar',
      leaders: [
        { name: 'Al-Khwarizmi', place: 'Baghdad', lived: 'c. 780–850', title: 'Mathematician', rating: 9,
          fact: 'The title of his book gave us the word "algebra". His own name gave us the word "algorithm".' },
        { name: 'Yi Xing', place: 'Tang China', lived: '683–727', title: 'Buddhist monk', rating: 8,
          fact: 'Built a water-driven model of the heavens with an escapement, the key part of a mechanical clock, more than 500 years before such clocks appeared in Europe.' },
        { name: 'Alcuin', place: 'York', lived: 'c. 735–804', title: 'Teacher at Charlemagne\'s court', rating: 6,
          fact: 'Ran Charlemagne\'s palace school and championed a clear new handwriting, Carolingian minuscule. It is the ancestor of the lowercase letters you are reading now.' },
        { name: 'Jabir ibn Hayyan', place: 'Kufa (Iraq)', lived: 'died c. 806–816', title: 'Alchemist', rating: 7,
          fact: 'Hundreds of works carry his name, describing distillation and crystallisation with a new stress on experiment. They became a foundation of chemistry.' },
      ],
      crisis: {
        year: 793, title: 'Raiders from the sea',
        text: 'Longships are striking your coast without warning, looting towns and vanishing before help can arrive.',
        options: [
          { seat: 'general', label: 'Build a fleet and hunt them down', mod: -1,
            win: 'caught the raiders at sea and burned their ships.', lose: 'chased sails that were never where the fleet was.' },
          { seat: 'envoy', label: 'Pay them off and open trade', mod: -1,
            win: 'turned the raiders into trading partners.', lose: 'paid them, and they returned every summer for more.' },
          { seat: 'ruler', label: 'Fortify the towns and river bridges', mod: 0,
            win: 'ringed the coast with strongholds the raiders could not crack.', lose: 'ran out of money with the walls half built.' },
        ],
        fact: 'The Viking raid on Lindisfarne in 793 opened nearly three centuries of raids. Paying them off often brought them back; fortified towns and bridges worked better.',
      },
    },
    {
      label: '900 – 1100 AD', seat: 'envoy',
      leaders: [
        { name: 'Ibn Fadlan', place: 'Baghdad', lived: 'active 921', title: 'Envoy of the Caliph', rating: 6,
          fact: 'Sent from Baghdad to the Volga, he wrote the only detailed eyewitness account of a Viking ship burial. The mission itself fell flat: the money he had promised his hosts never arrived.' },
        { name: 'Leif Erikson', place: 'Greenland', lived: 'c. 970–1020', title: 'Norse explorer', rating: 7,
          fact: 'Reached North America around the year 1000, nearly 500 years before Columbus.' },
        { name: 'Liutprand of Cremona', place: 'Italy', lived: 'c. 920–972', title: 'Bishop and diplomat', rating: 3,
          fact: 'Sent to Constantinople to arrange a royal marriage, he failed, insulted his hosts and had his purple silks confiscated at the border. His furious report is a classic of bad diplomacy.' },
        { name: 'Al-Masudi', place: 'Baghdad', lived: 'c. 896–956', title: 'Traveller and historian', rating: 8,
          fact: 'Travelled through Persia, India and East Africa, then wrote a history of the world that ranged from Chinese dynasties to the kings of the Franks. He is called the "Herodotus of the Arabs".' },
      ],
      crisis: {
        year: 1054, title: 'The faith splits in two',
        text: 'Your priests have split into two camps, each declaring the other heretics. Provinces are choosing sides.',
        options: [
          { seat: 'scholar', label: 'Call a council to debate it openly', mod: 0,
            win: 'found wording both camps could live with.', lose: 'hosted a council that ended in curses.' },
          { seat: 'envoy', label: 'Broker a quiet compromise', mod: 0,
            win: 'talked both sides down in private.', lose: 'was trusted by neither side.' },
          { seat: 'ruler', label: 'Impose one creed by decree', mod: -2,
            win: 'was obeyed, and the quarrel died out.', lose: 'was defied, and half the empire rose in revolt.' },
        ],
        fact: 'In 1054 the leaders of the Latin and Greek churches excommunicated each other. The East–West Schism has never fully healed.',
      },
    },
    {
      label: '1100 – 1300 AD', seat: 'ruler',
      leaders: [
        { name: 'Genghis Khan', place: 'Mongolia', lived: 'c. 1162–1227', title: 'Khan of the Mongols', rating: 10,
          fact: 'Born into an outcast family, he united the steppe tribes and founded what became the largest connected land empire in history. He promoted on merit and set up a relay postal system.' },
        { name: 'Tamar', place: 'Georgia', lived: 'c. 1160–1213', title: 'Monarch of Georgia', rating: 8,
          fact: 'Crowned with the title "King of Kings", she presided over Georgia\'s golden age and beat far larger neighbouring armies to dominate the Caucasus.' },
        { name: 'Sundiata Keita', place: 'Mali', lived: 'c. 1217–1255', title: 'Prince of the Mandinka', rating: 8,
          fact: 'By tradition he could not walk as a child. He went on to found the Mali Empire, which a century later produced Mansa Musa, perhaps the richest person who ever lived.' },
        { name: 'Jayavarman VII', place: 'Khmer Empire', lived: 'c. 1122–1218', title: 'King of the Khmer', rating: 8,
          fact: 'Took the throne in his late fifties after invaders sacked Angkor. He drove them out, then built 102 hospitals and a network of rest houses along his roads.' },
      ],
      crisis: {
        year: 1241, title: 'Horsemen from the steppe',
        text: 'A vast army of mounted archers has destroyed every kingdom in its path. Its envoys demand your submission.',
        options: [
          { seat: 'general', label: 'Ride out and meet them in battle', mod: -3,
            win: 'did what no one else could and broke the horsemen.', lose: 'was drawn into a feigned retreat and annihilated.' },
          { seat: 'envoy', label: 'Submit, pay tribute and keep your cities', mod: 0,
            win: 'negotiated terms that left the empire standing.', lose: 'offended the khan, and the cities burned.' },
          { seat: 'ruler', label: 'Hold the walled cities and wait them out', mod: -1,
            win: 'held firm until the horsemen turned for home.', lose: 'watched the walls fall one by one.' },
        ],
        fact: 'In April 1241 Mongol armies destroyed two European armies within days of each other, at Legnica and Mohi. States that submitted and paid tribute, such as Novgorod, were mostly left standing.',
      },
    },
    {
      label: '1300 – 1500 AD', seat: 'envoy',
      leaders: [
        { name: 'Ibn Battuta', place: 'Morocco', lived: '1304 – c. 1369', title: 'Traveller and judge', rating: 9,
          fact: 'Left home at 21 on a pilgrimage and kept going for nearly 30 years, covering about 120,000 km. That is far more than Marco Polo, and he served as a judge and ambassador along the way.' },
        { name: 'Zheng He', place: 'Ming China', lived: '1371 – c. 1433', title: 'Admiral of the treasure fleet', rating: 9,
          fact: 'Commanded seven voyages with hundreds of ships and about 28,000 men, reaching East Africa decades before Europeans rounded the Cape. One fleet brought a giraffe home for the emperor.' },
        { name: 'Christopher Columbus', place: 'Genoa', lived: '1451–1506', title: 'Navigator', rating: 5,
          fact: 'He reached the Americas because he badly underestimated the size of the Earth; the scholars who doubted his sums were right. He insisted to the end that he had found Asia.' },
        { name: 'Vasco da Gama', place: 'Portugal', lived: 'c. 1460–1524', title: 'Navigator', rating: 6,
          fact: 'Sailed around Africa to India in 1498, then nearly ruined the mission by offering the ruler of Calicut gifts so cheap that the court laughed at them.' },
      ],
      crisis: {
        year: 1347, title: 'The great dying',
        text: 'Ships have brought a pestilence that kills within days. Whole villages are already empty.',
        options: [
          { seat: 'scholar', label: 'Quarantine ships and travellers', mod: 0,
            win: 'held arrivals offshore and spared the great cities.', lose: 'acted too late; the sickness was already inside.' },
          { seat: 'ruler', label: 'Hold society together as it dies', mod: -1,
            win: 'kept the fields worked and the laws obeyed.', lose: 'lost control as survivors fled their posts.' },
          { seat: 'envoy', label: 'Close the borders to all trade', mod: -1,
            win: 'sealed the frontier before the worst arrived.', lose: 'cut off trade but not the plague.' },
        ],
        fact: 'The Black Death of 1347–51 killed perhaps a third to a half of Europe. The port of Ragusa introduced the first formal quarantine in 1377.',
      },
    },
    {
      label: '1500 – 1700 AD', seat: 'scholar',
      leaders: [
        { name: 'Isaac Newton', place: 'England', lived: '1643–1727', title: 'Natural philosopher', rating: 10,
          fact: 'Sent home for about 18 months when plague closed his university, he laid the foundations of calculus, worked out his theory of colour and began his theory of gravity.' },
        { name: 'Galileo Galilei', place: 'Italy', lived: '1564–1642', title: 'Astronomer', rating: 9,
          fact: 'Improved the telescope and found moons circling Jupiter, proof that not everything orbits the Earth. He spent his last years under house arrest for saying so.' },
        { name: 'Seki Takakazu', place: 'Japan', lived: 'c. 1642–1708', title: 'Mathematician', rating: 7,
          fact: 'Working in a Japan closed to the outside world, he developed determinants at about the same time as Leibniz in Europe and found the Bernoulli numbers independently of Bernoulli.' },
        { name: 'Taqi al-Din', place: 'Ottoman Empire', lived: '1526–1585', title: 'Court astronomer', rating: 7,
          fact: 'Built an observatory in Istanbul to rival the best in Europe and, in 1551, described a steam turbine for turning a roasting spit. The observatory was torn down within a few years on the sultan\'s orders.' },
      ],
      crisis: {
        year: 1644, title: 'The cold years',
        text: 'Winters have grown long and summers short. Harvests fail year after year, and rebels are marching.',
        options: [
          { seat: 'scholar', label: 'Introduce new crops and farming methods', mod: 0,
            win: 'brought in crops that thrived in the cold.', lose: 'saw the new crops fail too.' },
          { seat: 'ruler', label: 'Cut taxes and reform the state', mod: -1,
            win: 'eased the burden just in time.', lose: 'emptied the treasury and still lost the provinces.' },
          { seat: 'general', label: 'Crush the rebellions', mod: -2,
            win: 'scattered the rebel armies.', lose: 'found the unpaid troops joining the rebels.' },
        ],
        fact: 'The mid-1600s were among the coldest years of the Little Ice Age. Famine and revolt struck states around the world, and China\'s Ming dynasty fell in 1644.',
      },
    },
    {
      label: '1700 – 1900 AD', seat: 'general',
      leaders: [
        { name: 'Napoleon Bonaparte', place: 'France', lived: '1769–1821', title: 'Artillery officer', rating: 9,
          fact: 'Fought some 60 battles, lost only a handful, and redrew the map of Europe. His legal code still shapes the law of dozens of countries.' },
        { name: 'Toussaint Louverture', place: 'Saint-Domingue (Haiti)', lived: '1743–1803', title: 'Coachman turned commander', rating: 9,
          fact: 'Born enslaved, he led the only slave revolt in history that created a nation, outfighting or outwitting French, Spanish and British armies along the way.' },
        { name: 'Shaka', place: 'Zulu Kingdom', lived: 'c. 1787–1828', title: 'King of the Zulu', rating: 8,
          fact: 'Swapped the throwing spear for a short stabbing spear and drilled his regiments in an encircling "horns of the buffalo" attack, turning a minor chiefdom into the leading power of southern Africa in about a decade.' },
        { name: 'Simón Bolívar', place: 'Venezuela', lived: '1783–1830', title: 'Revolutionary leader', rating: 8,
          fact: 'Led campaigns that freed what are now six countries from Spanish rule, at one point marching his army over an Andean pass nearly 4,000 metres high.' },
      ],
      crisis: {
        year: 1848, title: 'The people demand a voice',
        text: 'Crowds fill the squares of every city, demanding a constitution, a vote and an end to the old order.',
        options: [
          { seat: 'ruler', label: 'Grant a constitution', mod: -1,
            win: 'gave way gracefully and kept the crown.', lose: 'conceded too little, too late.' },
          { seat: 'general', label: 'Send in the army', mod: -1,
            win: 'cleared the squares and restored order.', lose: 'saw the soldiers refuse to fire and join the crowds.' },
          { seat: 'scholar', label: 'Open schools and promise reform', mod: -1,
            win: 'won over the moderates and split the movement.', lose: 'offered ideas when the crowd wanted power.' },
        ],
        fact: 'In 1848 revolutions broke out in dozens of states across Europe within a few months of each other.',
      },
    },
  ],
};

if (typeof module !== 'undefined') module.exports = DATA;
