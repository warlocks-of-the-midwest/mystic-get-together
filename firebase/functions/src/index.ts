import * as Firestore from '@google-cloud/firestore';
import * as express from 'express';
import * as functions from 'firebase-functions';
const uuidv4 = require('uuid/v4');
import * as createError from 'http-errors';

// Firestore client - as a Cloud Function, this is
// all the setup we need
const firestore = new Firestore.Firestore({
    projectId: process.env.GCP_PROJECT,
    timestampsInSnapshots: true
  });

// TODO: wrap await's in try/catch

// TODO Remove this business
const aurelia = {"name":"[CommanderReplay] Aurelia - RW Angel Reanimator (EDH / Commander)","cards":{"Solemn Simulacrum":{"quantity":1,"board":"main","set":null,"scryfall_id":"Solemn Simulacrum"},"Ancient Tomb":{"quantity":1,"board":"main","set":null,"scryfall_id":"Ancient Tomb"},"Magus of the Wheel":{"quantity":1,"board":"main","set":null,"scryfall_id":"Magus of the Wheel"},"Emeria Shepherd":{"quantity":1,"board":"main","set":null,"scryfall_id":"Emeria Shepherd"},"Iona, Shield of Emeria":{"quantity":1,"board":"main","set":null,"scryfall_id":"Iona, Shield of Emeria"},"Aurelia, the Warleader":{"quantity":1,"board":"command","set":null,"scryfall_id":"Aurelia, the Warleader"},"Strip Mine":{"quantity":1,"board":"main","set":null,"scryfall_id":"Strip Mine"},"Teferi's Protection":{"quantity":1,"board":"main","set":null,"scryfall_id":"Teferi's Protection"},"Gisela, Blade of Goldnight":{"quantity":1,"board":"main","set":null,"scryfall_id":"Gisela, Blade of Goldnight"},"Archangel of Thune":{"quantity":1,"board":"main","set":null,"scryfall_id":"Archangel of Thune"},"Angel of Serenity":{"quantity":1,"board":"main","set":null,"scryfall_id":"Angel of Serenity"},"Swords to Plowshares":{"quantity":1,"board":"main","set":null,"scryfall_id":"Swords to Plowshares"},"Ugin, the Spirit Dragon":{"quantity":1,"board":"main","set":null,"scryfall_id":"Ugin, the Spirit Dragon"},"Baneslayer Angel":{"quantity":1,"board":"main","set":null,"scryfall_id":"Baneslayer Angel"},"Windswept Heath":{"quantity":1,"board":"main","set":null,"scryfall_id":"Windswept Heath"},"Homeward Path":{"quantity":1,"board":"main","set":null,"scryfall_id":"Homeward Path"},"Return to Dust":{"quantity":1,"board":"main","set":null,"scryfall_id":"Return to Dust"},"Mistveil Plains":{"quantity":1,"board":"main","set":null,"scryfall_id":"Mistveil Plains"},"Plains":{"quantity":9,"board":"main","set":null,"scryfall_id":"Plains"},"Sword of the Animist":{"quantity":1,"board":"main","set":null,"scryfall_id":"Sword of the Animist"},"Urza's Incubator":{"quantity":1,"board":"main","set":null,"scryfall_id":"Urza's Incubator"},"Land Tax":{"quantity":1,"board":"main","set":null,"scryfall_id":"Land Tax"},"Karmic Guide":{"quantity":1,"board":"main","set":null,"scryfall_id":"Karmic Guide"},"Command Tower":{"quantity":1,"board":"main","set":null,"scryfall_id":"Command Tower"},"Enlightened Tutor":{"quantity":1,"board":"main","set":null,"scryfall_id":"Enlightened Tutor"},"Sacred Foundry":{"quantity":1,"board":"main","set":null,"scryfall_id":"Sacred Foundry"},"Boros Locket":{"quantity":1,"board":"main","set":null,"scryfall_id":"Boros Locket"},"Akroma, Angel of Fury":{"quantity":1,"board":"main","set":null,"scryfall_id":"Akroma, Angel of Fury"},"Bruna, the Fading Light":{"quantity":1,"board":"main","set":null,"scryfall_id":"Bruna, the Fading Light"},"Emeria, the Sky Ruin":{"quantity":1,"board":"main","set":null,"scryfall_id":"Emeria, the Sky Ruin"},"Mask of Memory":{"quantity":1,"board":"main","set":null,"scryfall_id":"Mask of Memory"},"Gift of Estates":{"quantity":1,"board":"main","set":null,"scryfall_id":"Gift of Estates"},"Nahiri, the Harbinger":{"quantity":1,"board":"main","set":null,"scryfall_id":"Nahiri, the Harbinger"},"Thran Dynamo":{"quantity":1,"board":"main","set":null,"scryfall_id":"Thran Dynamo"},"Chaos Warp":{"quantity":1,"board":"main","set":null,"scryfall_id":"Chaos Warp"},"Geier Reach Sanitarium":{"quantity":1,"board":"main","set":null,"scryfall_id":"Geier Reach Sanitarium"},"Worn Powerstone":{"quantity":1,"board":"main","set":null,"scryfall_id":"Worn Powerstone"},"Marsh Flats":{"quantity":1,"board":"main","set":null,"scryfall_id":"Marsh Flats"},"Myriad Landscape":{"quantity":1,"board":"main","set":null,"scryfall_id":"Myriad Landscape"},"Boros Garrison":{"quantity":1,"board":"main","set":null,"scryfall_id":"Boros Garrison"},"Reya Dawnbringer":{"quantity":1,"board":"main","set":null,"scryfall_id":"Reya Dawnbringer"},"Gilded Lotus":{"quantity":1,"board":"main","set":null,"scryfall_id":"Gilded Lotus"},"Path to Exile":{"quantity":1,"board":"main","set":null,"scryfall_id":"Path to Exile"},"Burnished Hart":{"quantity":1,"board":"main","set":null,"scryfall_id":"Burnished Hart"},"Altar of Dementia":{"quantity":1,"board":"main","set":null,"scryfall_id":"Altar of Dementia"},"Wheel of Fortune":{"quantity":1,"board":"main","set":null,"scryfall_id":"Wheel of Fortune"},"Devout Witness":{"quantity":1,"board":"main","set":null,"scryfall_id":"Devout Witness"},"Day of Judgment":{"quantity":1,"board":"main","set":null,"scryfall_id":"Day of Judgment"},"Mountain":{"quantity":6,"board":"main","set":null,"scryfall_id":"Mountain"},"Herald of War":{"quantity":1,"board":"main","set":null,"scryfall_id":"Herald of War"},"Path of Ancestry":{"quantity":1,"board":"main","set":null,"scryfall_id":"Path of Ancestry"},"Steelshaper's Gift":{"quantity":1,"board":"main","set":null,"scryfall_id":"Steelshaper's Gift"},"High Market":{"quantity":1,"board":"main","set":null,"scryfall_id":"High Market"},"Expedition Map":{"quantity":1,"board":"main","set":null,"scryfall_id":"Expedition Map"},"Hedron Archive":{"quantity":1,"board":"main","set":null,"scryfall_id":"Hedron Archive"},"Miraculous Recovery":{"quantity":1,"board":"main","set":null,"scryfall_id":"Miraculous Recovery"},"Arid Mesa":{"quantity":1,"board":"main","set":null,"scryfall_id":"Arid Mesa"},"Blasphemous Act":{"quantity":1,"board":"main","set":null,"scryfall_id":"Blasphemous Act"},"Hanweir Battlements":{"quantity":1,"board":"main","set":null,"scryfall_id":"Hanweir Battlements"},"Boros Signet":{"quantity":1,"board":"main","set":null,"scryfall_id":"Boros Signet"},"Wrath of God":{"quantity":1,"board":"main","set":null,"scryfall_id":"Wrath of God"},"Temple of Triumph":{"quantity":1,"board":"main","set":null,"scryfall_id":"Temple of Triumph"},"Plateau":{"quantity":1,"board":"main","set":null,"scryfall_id":"Plateau"},"Planar Bridge":{"quantity":1,"board":"main","set":null,"scryfall_id":"Planar Bridge"},"Adarkar Valkyrie":{"quantity":1,"board":"main","set":null,"scryfall_id":"Adarkar Valkyrie"},"Marshal's Anthem":{"quantity":1,"board":"main","set":null,"scryfall_id":"Marshal's Anthem"},"Temple of the False God":{"quantity":1,"board":"main","set":null,"scryfall_id":"Temple of the False God"},"Lightning Greaves":{"quantity":1,"board":"main","set":null,"scryfall_id":"Lightning Greaves"},"Battlefield Forge":{"quantity":1,"board":"main","set":null,"scryfall_id":"Battlefield Forge"},"Vandalblast":{"quantity":1,"board":"main","set":null,"scryfall_id":"Vandalblast"},"Cavern of Souls":{"quantity":1,"board":"main","set":null,"scryfall_id":"Cavern of Souls"},"Flooded Strand":{"quantity":1,"board":"main","set":null,"scryfall_id":"Flooded Strand"},"Hour of Revelation":{"quantity":1,"board":"main","set":null,"scryfall_id":"Hour of Revelation"},"Platinum Angel":{"quantity":1,"board":"main","set":null,"scryfall_id":"Platinum Angel"},"Tithe":{"quantity":1,"board":"main","set":null,"scryfall_id":"Tithe"},"Angelic Skirmisher":{"quantity":1,"board":"main","set":null,"scryfall_id":"Angelic Skirmisher"},"Austere Command":{"quantity":1,"board":"main","set":null,"scryfall_id":"Austere Command"},"Mesmeric Orb":{"quantity":1,"board":"main","set":null,"scryfall_id":"Mesmeric Orb"},"Aura of Silence":{"quantity":1,"board":"main","set":null,"scryfall_id":"Aura of Silence"},"Boros Charm":{"quantity":1,"board":"main","set":null,"scryfall_id":"Boros Charm"},"Dawnbreak Reclaimer":{"quantity":1,"board":"main","set":null,"scryfall_id":"Dawnbreak Reclaimer"},"Sunhome, Fortress of the Legion":{"quantity":1,"board":"main","set":null,"scryfall_id":"Sunhome, Fortress of the Legion"},"Avacyn, Angel of Hope":{"quantity":1,"board":"main","set":null,"scryfall_id":"Avacyn, Angel of Hope"},"Memory Jar":{"quantity":1,"board":"main","set":null,"scryfall_id":"Memory Jar"},"Stoneforge Mystic":{"quantity":1,"board":"main","set":null,"scryfall_id":"Stoneforge Mystic"},"Akroma, Angel of Wrath":{"quantity":1,"board":"main","set":null,"scryfall_id":"Akroma, Angel of Wrath"},"Angelic Arbiter":{"quantity":1,"board":"main","set":null,"scryfall_id":"Angelic Arbiter"}}};
const xenagos = {"name":"Budget Commander: Xenagos, God of Revels","cards":{"Elemental Bond":{"quantity":1,"board":"main","set":null,"scryfall_id":"Elemental Bond"},"Strionic Resonator":{"quantity":1,"board":"main","set":null,"scryfall_id":"Strionic Resonator"},"Llanowar Elves":{"quantity":1,"board":"main","set":null,"scryfall_id":"Llanowar Elves"},"Rapacious One":{"quantity":1,"board":"main","set":null,"scryfall_id":"Rapacious One"},"Reclamation Sage":{"quantity":1,"board":"main","set":null,"scryfall_id":"Reclamation Sage"},"Nature's Lore":{"quantity":1,"board":"main","set":null,"scryfall_id":"Nature's Lore"},"Farseek":{"quantity":1,"board":"main","set":null,"scryfall_id":"Farseek"},"Giant Adephage":{"quantity":1,"board":"main","set":null,"scryfall_id":"Giant Adephage"},"Tyrant's Familiar":{"quantity":1,"board":"main","set":null,"scryfall_id":"Tyrant's Familiar"},"Thunderfoot Baloth":{"quantity":1,"board":"main","set":null,"scryfall_id":"Thunderfoot Baloth"},"Bane of Bala Ged":{"quantity":1,"board":"main","set":null,"scryfall_id":"Bane of Bala Ged"},"Sage of Ancient Lore":{"quantity":1,"board":"main","set":null,"scryfall_id":"Sage of Ancient Lore"},"Phyrexian Hydra":{"quantity":1,"board":"main","set":null,"scryfall_id":"Phyrexian Hydra"},"Deus of Calamity":{"quantity":1,"board":"main","set":null,"scryfall_id":"Deus of Calamity"},"Moldgraf Monstrosity":{"quantity":1,"board":"main","set":null,"scryfall_id":"Moldgraf Monstrosity"},"Hydra Omnivore":{"quantity":1,"board":"main","set":null,"scryfall_id":"Hydra Omnivore"},"Wood Elves":{"quantity":1,"board":"main","set":null,"scryfall_id":"Wood Elves"},"Elvish Mystic":{"quantity":1,"board":"main","set":null,"scryfall_id":"Elvish Mystic"},"Silklash Spider":{"quantity":1,"board":"main","set":null,"scryfall_id":"Silklash Spider"},"Spellbreaker Behemoth":{"quantity":1,"board":"main","set":null,"scryfall_id":"Spellbreaker Behemoth"},"Hunter's Prowess":{"quantity":1,"board":"main","set":null,"scryfall_id":"Hunter's Prowess"},"Temple of Abandon":{"quantity":1,"board":"main","set":null,"scryfall_id":"Temple of Abandon"},"Gruul Ragebeast":{"quantity":1,"board":"main","set":null,"scryfall_id":"Gruul Ragebeast"},"Spearbreaker Behemoth":{"quantity":1,"board":"main","set":null,"scryfall_id":"Spearbreaker Behemoth"},"Bane of Progress":{"quantity":1,"board":"main","set":null,"scryfall_id":"Bane of Progress"},"Gruul Guildgate":{"quantity":1,"board":"main","set":null,"scryfall_id":"Gruul Guildgate"},"Feldon of the Third Path":{"quantity":1,"board":"main","set":null,"scryfall_id":"Feldon of the Third Path"},"Savage Ventmaw":{"quantity":1,"board":"main","set":null,"scryfall_id":"Savage Ventmaw"},"Terastodon":{"quantity":1,"board":"main","set":null,"scryfall_id":"Terastodon"},"Arbor Elf":{"quantity":1,"board":"main","set":null,"scryfall_id":"Arbor Elf"},"Fierce Empath":{"quantity":1,"board":"main","set":null,"scryfall_id":"Fierce Empath"},"Inferno Titan":{"quantity":1,"board":"main","set":null,"scryfall_id":"Inferno Titan"},"Gruul Signet":{"quantity":1,"board":"main","set":null,"scryfall_id":"Gruul Signet"},"See the Unwritten":{"quantity":1,"board":"main","set":null,"scryfall_id":"See the Unwritten"},"Fyndhorn Elves":{"quantity":1,"board":"main","set":null,"scryfall_id":"Fyndhorn Elves"},"Gruul Turf":{"quantity":1,"board":"main","set":null,"scryfall_id":"Gruul Turf"},"Nature's Claim":{"quantity":1,"board":"main","set":null,"scryfall_id":"Nature's Claim"},"Kazandu Refuge":{"quantity":1,"board":"main","set":null,"scryfall_id":"Kazandu Refuge"},"Rugged Highlands":{"quantity":1,"board":"main","set":null,"scryfall_id":"Rugged Highlands"},"Malignus":{"quantity":1,"board":"main","set":null,"scryfall_id":"Malignus"},"Spinerock Knoll":{"quantity":1,"board":"main","set":null,"scryfall_id":"Spinerock Knoll"},"Warstorm Surge":{"quantity":1,"board":"main","set":null,"scryfall_id":"Warstorm Surge"},"Ulvenwald Tracker":{"quantity":1,"board":"main","set":null,"scryfall_id":"Ulvenwald Tracker"},"Molten Primordial":{"quantity":1,"board":"main","set":null,"scryfall_id":"Molten Primordial"},"Mountain":{"quantity":12,"board":"main","set":null,"scryfall_id":"Mountain"},"Rampaging Baloths":{"quantity":1,"board":"main","set":null,"scryfall_id":"Rampaging Baloths"},"Acidic Slime":{"quantity":1,"board":"main","set":null,"scryfall_id":"Acidic Slime"},"Gruul Charm":{"quantity":1,"board":"main","set":null,"scryfall_id":"Gruul Charm"},"Mosswort Bridge":{"quantity":1,"board":"main","set":null,"scryfall_id":"Mosswort Bridge"},"Timber Gorge":{"quantity":1,"board":"main","set":null,"scryfall_id":"Timber Gorge"},"Harmonize":{"quantity":1,"board":"main","set":null,"scryfall_id":"Harmonize"},"Life's Legacy":{"quantity":1,"board":"main","set":null,"scryfall_id":"Life's Legacy"},"Atarka, World Render":{"quantity":1,"board":"main","set":null,"scryfall_id":"Atarka, World Render"},"Vandalblast":{"quantity":1,"board":"main","set":null,"scryfall_id":"Vandalblast"},"Yavimaya Elder":{"quantity":1,"board":"main","set":null,"scryfall_id":"Yavimaya Elder"},"Farhaven Elf":{"quantity":1,"board":"main","set":null,"scryfall_id":"Farhaven Elf"},"Ruric Thar, the Unbowed":{"quantity":1,"board":"main","set":null,"scryfall_id":"Ruric Thar, the Unbowed"},"Sakura-Tribe Elder":{"quantity":1,"board":"main","set":null,"scryfall_id":"Sakura-Tribe Elder"},"Guild Feud":{"quantity":1,"board":"main","set":null,"scryfall_id":"Guild Feud"},"Skarrg, the Rage Pits":{"quantity":1,"board":"main","set":null,"scryfall_id":"Skarrg, the Rage Pits"},"Soul of the Harvest":{"quantity":1,"board":"main","set":null,"scryfall_id":"Soul of the Harvest"},"Blood Mist":{"quantity":1,"board":"main","set":null,"scryfall_id":"Blood Mist"},"Somberwald Sage":{"quantity":1,"board":"main","set":null,"scryfall_id":"Somberwald Sage"},"Xenagos, God of Revels":{"quantity":1,"board":"command","set":null,"scryfall_id":"Xenagos, God of Revels"},"Chandra's Ignition":{"quantity":1,"board":"main","set":null,"scryfall_id":"Chandra's Ignition"},"Temur Battle Rage":{"quantity":1,"board":"main","set":null,"scryfall_id":"Temur Battle Rage"},"Hunter's Insight":{"quantity":1,"board":"main","set":null,"scryfall_id":"Hunter's Insight"},"Skullwinder":{"quantity":1,"board":"main","set":null,"scryfall_id":"Skullwinder"},"Forest":{"quantity":17,"board":"main","set":null,"scryfall_id":"Forest"},"Evolutionary Leap":{"quantity":1,"board":"main","set":null,"scryfall_id":"Evolutionary Leap"},"Skullclamp":{"quantity":1,"board":"main","set":null,"scryfall_id":"Skullclamp"},"Artisan of Kozilek":{"quantity":1,"board":"main","set":null,"scryfall_id":"Artisan of Kozilek"},"Rampant Growth":{"quantity":1,"board":"main","set":null,"scryfall_id":"Rampant Growth"}}}
const nin = {"name":"Budget Coin Flips","cards":{"Fabricate":{"quantity":1,"board":"main","set":null,"scryfall_id":"Fabricate"},"Darksteel Ingot":{"quantity":1,"board":"main","set":null,"scryfall_id":"Darksteel Ingot"},"Intellectual Offering":{"quantity":1,"board":"main","set":null,"scryfall_id":"Intellectual Offering"},"Karplusan Minotaur":{"quantity":1,"board":"main","set":null,"scryfall_id":"Karplusan Minotaur"},"Young Pyromancer":{"quantity":1,"board":"main","set":null,"scryfall_id":"Young Pyromancer"},"Sol Ring":{"quantity":1,"board":"main","set":null,"scryfall_id":"Sol Ring"},"Mana Geyser":{"quantity":1,"board":"main","set":null,"scryfall_id":"Mana Geyser"},"Mogg Assassin":{"quantity":1,"board":"main","set":null,"scryfall_id":"Mogg Assassin"},"Nin, the Pain Artist":{"quantity":1,"board":"command","set":null,"scryfall_id":"Nin, the Pain Artist"},"Tide of War":{"quantity":1,"board":"main","set":null,"scryfall_id":"Tide of War"},"Hammer of Purphoros":{"quantity":1,"board":"main","set":null,"scryfall_id":"Hammer of Purphoros"},"Stitch in Time":{"quantity":1,"board":"main","set":null,"scryfall_id":"Stitch in Time"},"Commander's Sphere":{"quantity":1,"board":"main","set":null,"scryfall_id":"Commander's Sphere"},"Swiftfoot Boots":{"quantity":1,"board":"main","set":null,"scryfall_id":"Swiftfoot Boots"},"Goblin Bangchuckers":{"quantity":1,"board":"main","set":null,"scryfall_id":"Goblin Bangchuckers"},"Treasure Cruise":{"quantity":1,"board":"main","set":null,"scryfall_id":"Treasure Cruise"},"Relic of Progenitus":{"quantity":1,"board":"main","set":null,"scryfall_id":"Relic of Progenitus"},"Everflowing Chalice":{"quantity":1,"board":"main","set":null,"scryfall_id":"Everflowing Chalice"},"Willbreaker":{"quantity":1,"board":"main","set":null,"scryfall_id":"Willbreaker"},"Muddle the Mixture":{"quantity":1,"board":"main","set":null,"scryfall_id":"Muddle the Mixture"},"Desperate Gambit":{"quantity":1,"board":"main","set":null,"scryfall_id":"Desperate Gambit"},"Izzet Boilerworks":{"quantity":1,"board":"main","set":null,"scryfall_id":"Izzet Boilerworks"},"Mind Stone":{"quantity":1,"board":"main","set":null,"scryfall_id":"Mind Stone"},"Island":{"quantity":15,"board":"main","set":null,"scryfall_id":"Island"},"Volatile Rig":{"quantity":1,"board":"main","set":null,"scryfall_id":"Volatile Rig"},"Creepy Doll":{"quantity":1,"board":"main","set":null,"scryfall_id":"Creepy Doll"},"Krark's Thumb":{"quantity":1,"board":"main","set":null,"scryfall_id":"Krark's Thumb"},"Puppet's Verdict":{"quantity":1,"board":"main","set":null,"scryfall_id":"Puppet's Verdict"},"Reshape":{"quantity":1,"board":"main","set":null,"scryfall_id":"Reshape"},"Izzet Charm":{"quantity":1,"board":"main","set":null,"scryfall_id":"Izzet Charm"},"Talrand, Sky Summoner":{"quantity":1,"board":"main","set":null,"scryfall_id":"Talrand, Sky Summoner"},"Brainstorm":{"quantity":1,"board":"main","set":null,"scryfall_id":"Brainstorm"},"Izzet Signet":{"quantity":1,"board":"main","set":null,"scryfall_id":"Izzet Signet"},"Squee's Revenge":{"quantity":1,"board":"main","set":null,"scryfall_id":"Squee's Revenge"},"Tezzeret the Seeker":{"quantity":1,"board":"main","set":null,"scryfall_id":"Tezzeret the Seeker"},"Risky Move":{"quantity":1,"board":"main","set":null,"scryfall_id":"Risky Move"},"Fervor":{"quantity":1,"board":"main","set":null,"scryfall_id":"Fervor"},"Worn Powerstone":{"quantity":1,"board":"main","set":null,"scryfall_id":"Worn Powerstone"},"Buried Ruin":{"quantity":1,"board":"main","set":null,"scryfall_id":"Buried Ruin"},"Goblin Assassin":{"quantity":1,"board":"main","set":null,"scryfall_id":"Goblin Assassin"},"Counterspell":{"quantity":1,"board":"main","set":null,"scryfall_id":"Counterspell"},"Goblin Archaeologist":{"quantity":1,"board":"main","set":null,"scryfall_id":"Goblin Archaeologist"},"Crooked Scales":{"quantity":1,"board":"main","set":null,"scryfall_id":"Crooked Scales"},"Burnished Hart":{"quantity":1,"board":"main","set":null,"scryfall_id":"Burnished Hart"},"Chance Encounter":{"quantity":1,"board":"main","set":null,"scryfall_id":"Chance Encounter"},"Game of Chaos":{"quantity":1,"board":"main","set":null,"scryfall_id":"Game of Chaos"},"Evolving Wilds":{"quantity":1,"board":"main","set":null,"scryfall_id":"Evolving Wilds"},"Ponder":{"quantity":1,"board":"main","set":null,"scryfall_id":"Ponder"},"Mountain":{"quantity":16,"board":"main","set":null,"scryfall_id":"Mountain"},"Preordain":{"quantity":1,"board":"main","set":null,"scryfall_id":"Preordain"},"Dig Through Time":{"quantity":1,"board":"main","set":null,"scryfall_id":"Dig Through Time"},"Impulse":{"quantity":1,"board":"main","set":null,"scryfall_id":"Impulse"},"Mystic Remora":{"quantity":1,"board":"main","set":null,"scryfall_id":"Mystic Remora"},"Izzet Guildgate":{"quantity":1,"board":"main","set":null,"scryfall_id":"Izzet Guildgate"},"Thought Vessel":{"quantity":1,"board":"main","set":null,"scryfall_id":"Thought Vessel"},"Volcanic Offering":{"quantity":1,"board":"main","set":null,"scryfall_id":"Volcanic Offering"},"Goblin Festival":{"quantity":1,"board":"main","set":null,"scryfall_id":"Goblin Festival"},"Terramorphic Expanse":{"quantity":1,"board":"main","set":null,"scryfall_id":"Terramorphic Expanse"},"Myr Retriever":{"quantity":1,"board":"main","set":null,"scryfall_id":"Myr Retriever"},"Fiery Gambit":{"quantity":1,"board":"main","set":null,"scryfall_id":"Fiery Gambit"},"Goblin Welder":{"quantity":1,"board":"main","set":null,"scryfall_id":"Goblin Welder"},"Swiftwater Cliffs":{"quantity":1,"board":"main","set":null,"scryfall_id":"Swiftwater Cliffs"},"Daretti, Scrap Savant":{"quantity":1,"board":"main","set":null,"scryfall_id":"Daretti, Scrap Savant"},"Frenetic Efreet":{"quantity":1,"board":"main","set":null,"scryfall_id":"Frenetic Efreet"},"Goblin Kaboomist":{"quantity":1,"board":"main","set":null,"scryfall_id":"Goblin Kaboomist"},"Wayfarer's Bauble":{"quantity":1,"board":"main","set":null,"scryfall_id":"Wayfarer's Bauble"},"Swan Song":{"quantity":1,"board":"main","set":null,"scryfall_id":"Swan Song"},"Planar Chaos":{"quantity":1,"board":"main","set":null,"scryfall_id":"Planar Chaos"},"Highland Lake":{"quantity":1,"board":"main","set":null,"scryfall_id":"Highland Lake"},"Molten Birth":{"quantity":1,"board":"main","set":null,"scryfall_id":"Molten Birth"},"Impulsive Maneuvers":{"quantity":1,"board":"main","set":null,"scryfall_id":"Impulsive Maneuvers"}}};
const selvala = {"name":"Trunkload of Elephants ($81)","cards":{"Selvala, Explorer Returned":{"quantity":1,"board":"command","set":null,"scryfall_id":"Selvala, Explorer Returned"},"Rabid Elephant":{"quantity":1,"board":"main","set":null,"scryfall_id":"Rabid Elephant"},"Trained Armodon":{"quantity":1,"board":"main","set":null,"scryfall_id":"Trained Armodon"},"Wild Elephant":{"quantity":1,"board":"main","set":null,"scryfall_id":"Wild Elephant"},"Loxodon Hierarch":{"quantity":1,"board":"main","set":null,"scryfall_id":"Loxodon Hierarch"},"Tranquil Expanse":{"quantity":1,"board":"main","set":null,"scryfall_id":"Tranquil Expanse"},"Crazed Armodon":{"quantity":1,"board":"main","set":null,"scryfall_id":"Crazed Armodon"},"Cultivate":{"quantity":1,"board":"main","set":null,"scryfall_id":"Cultivate"},"Woolly Loxodon":{"quantity":1,"board":"main","set":null,"scryfall_id":"Woolly Loxodon"},"Coat of Arms":{"quantity":1,"board":"main","set":null,"scryfall_id":"Coat of Arms"},"Elfhame Palace":{"quantity":1,"board":"main","set":null,"scryfall_id":"Elfhame Palace"},"Loxodon Partisan":{"quantity":1,"board":"main","set":null,"scryfall_id":"Loxodon Partisan"},"Belbe's Portal":{"quantity":1,"board":"main","set":null,"scryfall_id":"Belbe's Portal"},"Kazandu Tuskcaller":{"quantity":1,"board":"main","set":null,"scryfall_id":"Kazandu Tuskcaller"},"Loxodon Warhammer":{"quantity":1,"board":"main","set":null,"scryfall_id":"Loxodon Warhammer"},"Loxodon Anchorite":{"quantity":1,"board":"main","set":null,"scryfall_id":"Loxodon Anchorite"},"Loxodon Gatekeeper":{"quantity":1,"board":"main","set":null,"scryfall_id":"Loxodon Gatekeeper"},"Tempting Licid":{"quantity":1,"board":"main","set":null,"scryfall_id":"Tempting Licid"},"Elephant Grass":{"quantity":1,"board":"main","set":null,"scryfall_id":"Elephant Grass"},"Ghalma's Warden":{"quantity":1,"board":"main","set":null,"scryfall_id":"Ghalma's Warden"},"Kodama's Reach":{"quantity":1,"board":"main","set":null,"scryfall_id":"Kodama's Reach"},"Krosan Verge":{"quantity":1,"board":"main","set":null,"scryfall_id":"Krosan Verge"},"Loxodon Smiter":{"quantity":1,"board":"main","set":null,"scryfall_id":"Loxodon Smiter"},"Trumpeting Armodon":{"quantity":1,"board":"main","set":null,"scryfall_id":"Trumpeting Armodon"},"Elephant Ambush":{"quantity":1,"board":"main","set":null,"scryfall_id":"Elephant Ambush"},"Plains":{"quantity":11,"board":"main","set":null,"scryfall_id":"Plains"},"Urza's Incubator":{"quantity":1,"board":"main","set":null,"scryfall_id":"Urza's Incubator"},"Iron Tusk Elephant":{"quantity":1,"board":"main","set":null,"scryfall_id":"Iron Tusk Elephant"},"Sandsteppe Mastodon":{"quantity":1,"board":"main","set":null,"scryfall_id":"Sandsteppe Mastodon"},"Mask of Memory":{"quantity":1,"board":"main","set":null,"scryfall_id":"Mask of Memory"},"Terastodon":{"quantity":1,"board":"main","set":null,"scryfall_id":"Terastodon"},"Graypelt Refuge":{"quantity":1,"board":"main","set":null,"scryfall_id":"Graypelt Refuge"},"Door of Destinies":{"quantity":1,"board":"main","set":null,"scryfall_id":"Door of Destinies"},"Behemoth Sledge":{"quantity":1,"board":"main","set":null,"scryfall_id":"Behemoth Sledge"},"Call of the Herd":{"quantity":1,"board":"main","set":null,"scryfall_id":"Call of the Herd"},"Nemesis Mask":{"quantity":1,"board":"main","set":null,"scryfall_id":"Nemesis Mask"},"Frontier Mastodon":{"quantity":1,"board":"main","set":null,"scryfall_id":"Frontier Mastodon"},"Loxodon Wayfarer":{"quantity":1,"board":"main","set":null,"scryfall_id":"Loxodon Wayfarer"},"War Elephant":{"quantity":1,"board":"main","set":null,"scryfall_id":"War Elephant"},"Cryptic Gateway":{"quantity":1,"board":"main","set":null,"scryfall_id":"Cryptic Gateway"},"Infiltration Lens":{"quantity":1,"board":"main","set":null,"scryfall_id":"Infiltration Lens"},"Nightshade Peddler":{"quantity":1,"board":"main","set":null,"scryfall_id":"Nightshade Peddler"},"Bow of Nylea":{"quantity":1,"board":"main","set":null,"scryfall_id":"Bow of Nylea"},"Loxodon Punisher":{"quantity":1,"board":"main","set":null,"scryfall_id":"Loxodon Punisher"},"Blossoming Sands":{"quantity":1,"board":"main","set":null,"scryfall_id":"Blossoming Sands"},"War Mammoth":{"quantity":1,"board":"main","set":null,"scryfall_id":"War Mammoth"},"Acidic Slime":{"quantity":1,"board":"main","set":null,"scryfall_id":"Acidic Slime"},"Metamorphic Wurm":{"quantity":1,"board":"main","set":null,"scryfall_id":"Metamorphic Wurm"},"Noble Elephant":{"quantity":1,"board":"main","set":null,"scryfall_id":"Noble Elephant"},"Southern Elephant":{"quantity":1,"board":"main","set":null,"scryfall_id":"Southern Elephant"},"Mammoth Umbra":{"quantity":1,"board":"main","set":null,"scryfall_id":"Mammoth Umbra"},"Brawn":{"quantity":1,"board":"main","set":null,"scryfall_id":"Brawn"},"Vintara Elephant":{"quantity":1,"board":"main","set":null,"scryfall_id":"Vintara Elephant"},"Loxodon Mystic":{"quantity":1,"board":"main","set":null,"scryfall_id":"Loxodon Mystic"},"Prized Elephant":{"quantity":1,"board":"main","set":null,"scryfall_id":"Prized Elephant"},"Harmonize":{"quantity":1,"board":"main","set":null,"scryfall_id":"Harmonize"},"Selvala's Charge":{"quantity":1,"board":"main","set":null,"scryfall_id":"Selvala's Charge"},"Spelltithe Enforcer":{"quantity":1,"board":"main","set":null,"scryfall_id":"Spelltithe Enforcer"},"Elephant Guide":{"quantity":1,"board":"main","set":null,"scryfall_id":"Elephant Guide"},"Loxodon Stalwart":{"quantity":1,"board":"main","set":null,"scryfall_id":"Loxodon Stalwart"},"Sakura-Tribe Elder":{"quantity":1,"board":"main","set":null,"scryfall_id":"Sakura-Tribe Elder"},"Selesnya Sanctuary":{"quantity":1,"board":"main","set":null,"scryfall_id":"Selesnya Sanctuary"},"Shinen of Life's Roar":{"quantity":1,"board":"main","set":null,"scryfall_id":"Shinen of Life's Roar"},"Siege Mastodon":{"quantity":1,"board":"main","set":null,"scryfall_id":"Siege Mastodon"},"Rampant Elephant":{"quantity":1,"board":"main","set":null,"scryfall_id":"Rampant Elephant"},"Selesnya Sentry":{"quantity":1,"board":"main","set":null,"scryfall_id":"Selesnya Sentry"},"Forest":{"quantity":19,"board":"main","set":null,"scryfall_id":"Forest"},"Selesnya Guildgate":{"quantity":1,"board":"main","set":null,"scryfall_id":"Selesnya Guildgate"},"Elephant Graveyard":{"quantity":1,"board":"main","set":null,"scryfall_id":"Elephant Graveyard"},"Rampant Growth":{"quantity":1,"board":"main","set":null,"scryfall_id":"Rampant Growth"},"Revenge of the Hunted":{"quantity":1,"board":"main","set":null,"scryfall_id":"Revenge of the Hunted"},"Mosstodon":{"quantity":1,"board":"main","set":null,"scryfall_id":"Mosstodon"}}};

const deckList = {
    aurelia: aurelia,
    xenagos: xenagos,
    nin: nin,
    selvala: selvala
}

// Import one of the pre-defined decks for a player.
//
// Request body format:
// - player: string - the username of the player
// - deck: string - the short name of the predefined deck
export const importDeckForPlayer = functions.https.onRequest((request, response) => {
    if (request.method !== 'POST') {
        response.status(405)
            .header('Allow', 'POST')
            .send('Method Not Allowed');
    }
    
    const player = request.body.player;
    const deck = deckList[request.body.deck]

    if (deck === undefined) {
        response.send('There is no deck identified by ' + request.body.deck);
    }

    // This function will be removed in the future, so ignore this peek
    // into callback hell
    firestore.collection('Users').where('username', '==', player).limit(1).get()
        .then((querySnapshot) => {
            if (querySnapshot.docs.length === 0) {
                response
                    .status(400)
                    .send('There is no user with the username: ' + player);
            }
            querySnapshot.docs[0].ref.collection('Decks').add(deck)
                .then((addedDoc) => {
                    response
                        .status(201)
                        .header('X-DeckID', addedDoc.id)
                        .send('Deck imported at ' + addedDoc.path);
                 }).catch((reason) => {
                    response
                        .status(500)
                        .send('Failed to import deck: ' + reason);
                 });
        }).catch((reason) => {
            if (reason instanceof createError.HttpError) {
                errorResponseMapper(reason, response);
            } else {
                console.error('Caught unexpected error: ', reason);
                response.sendStatus(500);
            }
        });
});

const createBaseGameDocument = function(params) {
    return {
        turn_order: {
            1: params.username
        }
    };
};

enum PlayState {
    Playing = 'playing',
    Draw = 'draw',
    Lost = 'lost',
    Won = 'won'
};

enum Board {
    Main = 'main',
    Command = 'command',
    Side = 'side',
    Maybe = 'maybe'
};

enum Zone {
    Library = 'Library',
    Hand = 'Hand',
    Battlefield = 'Battlefield',
    Graveyard = 'Graveyard',
    Stack = 'Stack',
    Exile = 'Exile',
    Command = 'Command'
    // Reveal zone maybe?
};

const createBasePlayerDocument = function(params) {
    return {
        life : 40,
        username : params.username,
        counters: {
            energy: 0,
            experience: 0,
            poison: 0
        },
        play_state: PlayState.Playing
    };
};

const createEmptyZone = function() {
    return {
        cards: {}
    };
};

const createLibraryZone = function(params) {
    const player = params.player;
    const deck = params.deck;
    const zone = createEmptyZone();

    // Expand the deck so a card with quantity > 1 becomes
    // that number of distinct objects
    const library = [];
    Object.keys(deck.cards).forEach(key => {
        const card = deck.cards[key];
        for (let i = 0; i < card.quantity; i++) {
            library.push(card);
        }
    });
    // Now shuffle it
    library.sort(() => uuidv4());

    // Now we can iterate over the library to create the zone
    let position = 0;
    library.forEach(card => {
        if (card.board === Board.Main) {
            const id = uuidv4();
            // We do not fully populate this since it is unnecessary,
            // and this reduces bandwidth usage (recall that we pay for 
            // bandwith and since Firestore is schemaless, the field name 
            // has to be sent as well)
            // TODO: this creates an invalid object... probably because the properties
            // aren't properly defined
            Object.defineProperty(zone.cards, id, {
                value: {
                    id: id,
                    scryfall_id: card.scryfall_id,
                    state: {
                        owner: player,
                        controller: player,
                        zone: Zone.Library,
                        position: position,
                        tapped: false,
                        face_up: false,
                        clone_of: null,
                        is_morph: false,
                        is_token: false,
                        power: null,
                        toughness: null,
                        attachments: {
                            counters: {

                            },
                            permanents: {

                            }
                        }
                    }
                },
                enumerable: true
            });
            position++;
        }
    });
    
    return zone;
};

const createCommandZone = function(params) {
    const player = params.player;
    const deck = params.deck;
    const zone = createEmptyZone();

    Object.keys(deck.cards).forEach(key => {
        const card = deck.cards[key];
        if (card.board === Board.Command) {
            const id = uuidv4();
            Object.defineProperty(zone.cards, id, {
                value: {
                    id: id,
                    scryfall_id: card.scryfall_id,
                    state: {
                        owner: player,
                        controller: player,
                        zone: Zone.Command,
                        position: 0,
                        tapped: false,
                        face_up: true,
                        clone_of: null,
                        is_morph: false,
                        is_token: false,
                        power: null,
                        toughness: null,
                        attachments: {
                            counters: {

                            },
                            permanents: {

                            }
                        }
                    }
                },
                enumerable: true
            });
        }
    });
    return zone;
}

const regenerateObject = function(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}

const lookupDeck = async function(player: string, deckId: string): Promise<Firestore.DocumentSnapshot> {
    let querySnapshot;
    try {
        querySnapshot = await firestore.collection('Users')
            .where('username', '==', player)
            .limit(1)
            .get();
    } catch (e) {
        console.error('Caught error searching for user', e);
        throw createError(500);
    }
    
    if (querySnapshot.docs.length === 0) {
        throw createError(400, null, {
            headers: {
                'X-Reason': 'User does not exist'
            }
        });
    }

    const userDoc = querySnapshot.docs[0].ref;
    console.info('Found userDoc at ' + userDoc.path);
    return userDoc.collection('Decks').doc(deckId).get();
}

const createPlayerInFirestore = async function(gameRef: Firestore.DocumentReference, player: string,
    deck: any): Promise<void> {
        const basePlayerDoc = createBasePlayerDocument({ username: player });
        try {
            await gameRef.collection('Players').doc(player).create(basePlayerDoc);
        } catch (e) {
            if (e.message.includes('ALREADY_EXISTS')) {
                throw createError(409, null, {
                    headers: {
                        'X-Reason': 'The target player is already in the game'
                    }
                });
            } else {
                console.error('Caught unrecognized error creating player document', e);
                throw createError(500);
            }
        }

        const playerRef = gameRef.collection('Players').doc(player);
        const libraryZone = regenerateObject(createLibraryZone({ deck: deck }));
        const commandZone = regenerateObject(createCommandZone({ deck: deck }));

        try {
            await Promise.all([
                playerRef.collection('Zones').doc(Zone.Library).create(libraryZone),
                playerRef.collection('Zones').doc(Zone.Command).create(commandZone),
                playerRef.collection('Zones').doc(Zone.Hand).create(createEmptyZone()),
                playerRef.collection('Zones').doc(Zone.Battlefield).create(createEmptyZone()),
                playerRef.collection('Zones').doc(Zone.Graveyard).create(createEmptyZone()),
                playerRef.collection('Zones').doc(Zone.Exile).create(createEmptyZone()),
                playerRef.collection('Zones').doc(Zone.Stack).create(createEmptyZone()),
            ]);
        } catch (e) {
            console.error('Caught error initializing zones', e)
            throw createError(500);
        }
    }

const createNewGameHelper = async function(player: string, deckId: string): Promise<string> {
    let deckDoc;
    try {
        deckDoc = await lookupDeck(player, deckId);
    } catch (e) {
        if (e instanceof createError.HttpError) {
            throw e;
        } else {
            console.error('Caught error looking up deck', e)
            throw createError(500);
        }
        
    }
    if (!deckDoc.exists) {
        throw createError(400, null, {
            headers: {
                'X-Reason': 'The deck does not exist'
            }
        });
    }

    const deck = deckDoc.data();
    const baseGameDoc = createBaseGameDocument({ username: player});
    try {
        const gameDocRef = await firestore.collection('Games').add(baseGameDoc);
        console.info('Created new game at: ' + gameDocRef.path);
        try {
            await createPlayerInFirestore(gameDocRef, player, deck);
            return Promise.resolve(gameDocRef.id);
        } catch (e) {
            if (e instanceof createError.HttpError) {
                throw e;
            } else {
                console.error('Caught error creating player in Firestore', e)
                throw createError(500);
            }
        }
    } catch (e) {
        console.error('Caught error adding base game document', e)
        throw createError(500);
    }
}

export const createNewGame = functions.https.onRequest((request, response) => {
    if (request.method !== 'POST') {
        response
            .status(405)
            .header('Allow', 'POST')
            .send('Method Not Allowed');
    }
    
    const player = request.body.player;
    const deckId = request.body.deck;

    if (player === undefined) {
        response
            .status(400)
            .send('Body must include "player" attribute denoting host player\'s username');
    }
    if (deckId === undefined) {
        response
            .status(400)
            .send('Body must include "deck" attribute denoting host player\'s desired deck ID');
    }

    console.log('Creating new game with hosting player ' + player);
    console.log('Using deck with ID ' + deckId);

    createNewGameHelper(player, deckId)
        .then((gameDocId) => {
            response.status(201)
                .header('X-GameID', gameDocId)
                .send();
        })
        .catch((error) => {
            errorResponseMapper(error, response);
        })
});

const joinGameHelper = async function(gameId: string, player: string, deckId: string): Promise<void> {
    let deckDoc;
    try {
        deckDoc = await lookupDeck(player, deckId);
    } catch (e) {
        if (e instanceof createError.HttpError) {
            throw e;
        } else {
            console.error('Caught error looking up deck', e)
            throw createError(500);
        }
        
    }
    if (!deckDoc.exists) {
        throw createError(400, null, {
            headers: {
                'X-Reason': 'The deck does not exist'
            }
        });
    }
    

    const deck = deckDoc.data();
    const gameDocRef = firestore.collection('Games').doc(gameId);
    let gameDoc;
    try {
        gameDoc = await gameDocRef.get();
    } catch (e) {
        console.error('Caught error getting game document', e)
        throw createError(500);
    }
    if (!gameDoc.exists) {
        throw createError(400, null, {
            headers: {
                'X-Reason': 'The target game does not exist'
            }
        });
    }
    
    return createPlayerInFirestore(gameDocRef, player, deck);
}

export const joinGame = functions.https.onRequest((request, response) => {
    if (request.method !== 'POST') {
        response.status(405)
            .header('Allow', 'POST')
            .send('Method Not Allowed');
    }
    
    const gameId = request.body.game;
    const player = request.body.player;
    const deckId = request.body.deck;

    if (gameId === undefined) {
        response
            .status(400)
            .send('Body must include "game" attribute denoting target game\'s ID');
    }
    if (player === undefined) {
        response
            .status(400)
            .send('Body must include "player" attribute denoting host player\'s username');
    }
    if (deckId === undefined) {
        response
            .status(400)
            .send('Body must include "deck" attribute denoting host player\'s desired deck ID');
    }

    console.log('Joining existing game (' + gameId + ') with hosting player ' + player);
    console.log('Using deck with ID ' + deckId);

    joinGameHelper(gameId, player, deckId)
        .then(() => {
            response.status(200)
                .send();
        })
        .catch((error) => {
            errorResponseMapper(error, response);
        })
});

const determineTurnOrderHelper = async function(gameId: string): Promise<void> {
    try {
        const gameDocRef = firestore.collection('Games').doc(gameId);
        const gameDoc = await gameDocRef.get();
        if (gameDoc.exists) {
            const playersCol = await gameDocRef.collection('Players').get();
            const playerOrder = playersCol.docs
                .map((doc) => doc.id)
                .sort(() => uuidv4());
            
            const turnOrder = {};
            // This is just some crap way to turning the array into a map (even though
            // the keys are just the position and the values are the same)
            for (let i = 0; i < playerOrder.length; i++) {
                Object.defineProperty(turnOrder, i.toString(), {
                    value: playerOrder[i],
                    enumerable: true
                });
            }

            await gameDocRef.set({ turn_order: turnOrder }, { merge: true })
            return;
        } else {
            throw createError(400, 'Bad Request', {
                headers: {
                    'X-Reason': 'The game document does not exist' 
                }
            });
        }
    } catch (e) {
        if (e instanceof createError.HttpError) {
            throw e;
        } else {
            console.error('Caught error determining turn order', e);
            throw createError(500);
        }
        
    }
}

export const determineTurnOrder = functions.https.onRequest((request, response) => {
    if (request.method !== 'POST') {
        response.status(405)
            .header('Allow', 'POST')
            .send('Method Not Allowed');
    }
    
    const gameId = request.body.game;

    if (gameId === undefined) {
        response
            .status(400)
            .send('Body must include "game" attribute denoting target game\'s ID');
    }

    determineTurnOrderHelper(gameId)
        .then(() => {
            response.send('Game is ready to start.');
        })
        .catch((error) => {
            errorResponseMapper(error, response);
        })
});

const errorResponseMapper = function(error: createError.HttpError, response: express.Response): void {
    response.status(error.status)
        .header(error.headers)
        .send(error.message);
}
