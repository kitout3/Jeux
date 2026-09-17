export const STATS = {
  "force": "Force",
  "endurance": "Endurance",
  "agilite": "Agilité",
  "perception": "Perception",
  "intelligence": "Intelligence",
  "sagesse": "Sagesse"
};
export const RES = {
  "or": {
    "name": "Or",
    "icon": "●",
    "color": "#efbd69",
    "value": 1
  },
  "cuivre": {
    "name": "Cuivre",
    "icon": "◆",
    "color": "#dfa077",
    "value": 2
  },
  "argent": {
    "name": "Argent",
    "icon": "◈",
    "color": "#d1e0e8",
    "value": 3
  },
  "obsidienne": {
    "name": "Obsidienne",
    "icon": "⬟",
    "color": "#c0a6ed",
    "value": 4
  }
};
export const COLORS = [
  "#efbd69",
  "#74cdb8",
  "#b8a4ea",
  "#ed989c",
  "#87bee8",
  "#d9de8a"
];
export const BIOMES = [
  {
    "name": "Cité impériale",
    "short": "Cité",
    "resource": "or",
    "color": "#d5b578",
    "territories": [
      "Faubourg impérial",
      "Remparts de la Cité",
      "Citadelle"
    ]
  },
  {
    "name": "Forêt aux arbres Cuivrés",
    "short": "Forêt",
    "resource": "cuivre",
    "color": "#7cbd93",
    "territories": [
      "Lisière cuivrée",
      "Bois des murmures",
      "Cœur de la forêt"
    ]
  },
  {
    "name": "Désert aux sables Argentés",
    "short": "Désert",
    "resource": "argent",
    "color": "#d7b697",
    "territories": [
      "Dunes argentées",
      "Oasis oubliée",
      "Ruines du désert"
    ]
  },
  {
    "name": "Montagne aux roches Obsidiennes",
    "short": "Montagne",
    "resource": "obsidienne",
    "color": "#a4a9d6",
    "territories": [
      "Col d’obsidienne",
      "Pic des ombres",
      "Sommet ancestral"
    ]
  }
];
export const HEROES = {
  "arbaletrier": {
    "name": "Arbalétrier",
    "icon": "➶",
    "hp": 6,
    "stats": [
      0,
      -2,
      1,
      2,
      0,
      -1
    ],
    "role": "Portée & chasse",
    "skill": "Poser un piège",
    "description": "Attaque dans un biome voisin sans contre-attaque. Pose un piège de 3 dégâts sur sa case.",
    "scoring": "+1 PV par quête de chasse terminée."
  },
  "vicaire": {
    "name": "Vicaire",
    "icon": "✥",
    "hp": 8,
    "stats": [
      -2,
      0,
      -1,
      0,
      1,
      2
    ],
    "role": "Bénédictions & charité",
    "skill": "Bénir un joueur",
    "description": "Bénit un joueur et lui prend jusqu’à 4 Or. Pioche une Anomalie à chaque bénédiction. Peut rediriger ses Anomalies.",
    "scoring": "+1 PV par quête de charité terminée."
  },
  "heretique": {
    "name": "Hérétique",
    "icon": "☾",
    "hp": 8,
    "stats": [
      -1,
      0,
      -2,
      1,
      2,
      0
    ],
    "role": "Malédictions & duel",
    "skill": "Maudire un adversaire",
    "description": "Maudit un adversaire et lui vole 3 points de vie. Sacrifie 1 point de vie pour choisir sa statistique d’attaque. Inverse ses bénédictions et malédictions.",
    "scoring": "Vole 1 PV supplémentaire à un joueur qu’il élimine."
  },
  "marchand": {
    "name": "Marchand",
    "icon": "⚖",
    "hp": 6,
    "stats": [
      -2,
      -1,
      0,
      1,
      2,
      0
    ],
    "role": "Économie & monopoles",
    "skill": "Ouvrir une bourse",
    "description": "Achète un territoire pour sa difficulté en Or. Reçoit une bourse de 4 Or au début et à chaque Départ. Dispose de deux échanges forcés par tour.",
    "scoring": "+1 PV par monopole, en plus des 3 PV habituels."
  },
  "chevalier": {
    "name": "Chevalier",
    "icon": "♞",
    "hp": 10,
    "stats": [
      2,
      1,
      0,
      -1,
      -2,
      0
    ],
    "role": "Conquête & protection",
    "skill": "Ériger un autel",
    "description": "+1 contre les territoires neutres. Capture les territoires adverses sans critique. Un autel augmente le niveau et protège le territoire des conquêtes.",
    "scoring": "+1 PV par territoire possédé."
  },
  "hommebete": {
    "name": "Homme-Bête",
    "icon": "♜",
    "hp": 10,
    "stats": [
      2,
      1,
      0,
      -1,
      0,
      -2
    ],
    "role": "Puissance & boss",
    "skill": "Déchaîner la fureur",
    "description": "Retente son premier combat raté. Sa fureur additionne deux D10 à sa prochaine attaque. Un critique recharge sa potion.",
    "scoring": "+1 PV par boss éliminé."
  }
};
export const SPACE_TYPES = {
  "start": {
    "name": "Départ",
    "icon": "⚑"
  },
  "camp": {
    "name": "Campement",
    "icon": "⌂"
  },
  "territory": {
    "name": "Territoire",
    "icon": "♜"
  },
  "quest": {
    "name": "Quête",
    "icon": "▤"
  },
  "anomaly": {
    "name": "Anomalie",
    "icon": "✦"
  },
  "resource": {
    "name": "Ressources",
    "icon": "◆"
  },
  "tower": {
    "name": "Tour de garde",
    "icon": "♖"
  },
  "obelisk": {
    "name": "Obélisque",
    "icon": "†"
  }
};
export const BOARD = [
  {
    "id": 0,
    "biome": 0,
    "type": "start",
    "difficulty": 0,
    "row": 12,
    "col": 12,
    "name": "Départ"
  },
  {
    "id": 1,
    "biome": 0,
    "type": "territory",
    "difficulty": 4,
    "row": 12,
    "col": 11,
    "name": "Faubourg impérial"
  },
  {
    "id": 2,
    "biome": 0,
    "type": "quest",
    "difficulty": 0,
    "row": 12,
    "col": 10,
    "name": "Quête"
  },
  {
    "id": 3,
    "biome": 0,
    "type": "territory",
    "difficulty": 6,
    "row": 12,
    "col": 9,
    "name": "Remparts de la Cité"
  },
  {
    "id": 4,
    "biome": 0,
    "type": "anomaly",
    "difficulty": 0,
    "row": 12,
    "col": 8,
    "name": "Anomalie"
  },
  {
    "id": 5,
    "biome": 0,
    "type": "resource",
    "difficulty": 0,
    "row": 12,
    "col": 7,
    "name": "Ressources"
  },
  {
    "id": 6,
    "biome": 0,
    "type": "territory",
    "difficulty": 8,
    "row": 12,
    "col": 6,
    "name": "Citadelle"
  },
  {
    "id": 7,
    "biome": 0,
    "type": "quest",
    "difficulty": 0,
    "row": 12,
    "col": 5,
    "name": "Quête"
  },
  {
    "id": 8,
    "biome": 0,
    "type": "tower",
    "difficulty": 0,
    "row": 12,
    "col": 4,
    "name": "Tour de garde"
  },
  {
    "id": 9,
    "biome": 0,
    "type": "anomaly",
    "difficulty": 0,
    "row": 12,
    "col": 3,
    "name": "Anomalie"
  },
  {
    "id": 10,
    "biome": 0,
    "type": "obelisk",
    "difficulty": 0,
    "row": 12,
    "col": 2,
    "name": "Obélisque"
  },
  {
    "id": 11,
    "biome": 0,
    "type": "resource",
    "difficulty": 0,
    "row": 12,
    "col": 1,
    "name": "Ressources"
  },
  {
    "id": 12,
    "biome": 1,
    "type": "camp",
    "difficulty": 0,
    "row": 12,
    "col": 0,
    "name": "Campement"
  },
  {
    "id": 13,
    "biome": 1,
    "type": "territory",
    "difficulty": 4,
    "row": 11,
    "col": 0,
    "name": "Lisière cuivrée"
  },
  {
    "id": 14,
    "biome": 1,
    "type": "quest",
    "difficulty": 0,
    "row": 10,
    "col": 0,
    "name": "Quête"
  },
  {
    "id": 15,
    "biome": 1,
    "type": "territory",
    "difficulty": 6,
    "row": 9,
    "col": 0,
    "name": "Bois des murmures"
  },
  {
    "id": 16,
    "biome": 1,
    "type": "anomaly",
    "difficulty": 0,
    "row": 8,
    "col": 0,
    "name": "Anomalie"
  },
  {
    "id": 17,
    "biome": 1,
    "type": "resource",
    "difficulty": 0,
    "row": 7,
    "col": 0,
    "name": "Ressources"
  },
  {
    "id": 18,
    "biome": 1,
    "type": "territory",
    "difficulty": 8,
    "row": 6,
    "col": 0,
    "name": "Cœur de la forêt"
  },
  {
    "id": 19,
    "biome": 1,
    "type": "quest",
    "difficulty": 0,
    "row": 5,
    "col": 0,
    "name": "Quête"
  },
  {
    "id": 20,
    "biome": 1,
    "type": "tower",
    "difficulty": 0,
    "row": 4,
    "col": 0,
    "name": "Tour de garde"
  },
  {
    "id": 21,
    "biome": 1,
    "type": "anomaly",
    "difficulty": 0,
    "row": 3,
    "col": 0,
    "name": "Anomalie"
  },
  {
    "id": 22,
    "biome": 1,
    "type": "obelisk",
    "difficulty": 0,
    "row": 2,
    "col": 0,
    "name": "Obélisque"
  },
  {
    "id": 23,
    "biome": 1,
    "type": "resource",
    "difficulty": 0,
    "row": 1,
    "col": 0,
    "name": "Ressources"
  },
  {
    "id": 24,
    "biome": 2,
    "type": "camp",
    "difficulty": 0,
    "row": 0,
    "col": 0,
    "name": "Campement"
  },
  {
    "id": 25,
    "biome": 2,
    "type": "territory",
    "difficulty": 4,
    "row": 0,
    "col": 1,
    "name": "Dunes argentées"
  },
  {
    "id": 26,
    "biome": 2,
    "type": "quest",
    "difficulty": 0,
    "row": 0,
    "col": 2,
    "name": "Quête"
  },
  {
    "id": 27,
    "biome": 2,
    "type": "territory",
    "difficulty": 6,
    "row": 0,
    "col": 3,
    "name": "Oasis oubliée"
  },
  {
    "id": 28,
    "biome": 2,
    "type": "anomaly",
    "difficulty": 0,
    "row": 0,
    "col": 4,
    "name": "Anomalie"
  },
  {
    "id": 29,
    "biome": 2,
    "type": "resource",
    "difficulty": 0,
    "row": 0,
    "col": 5,
    "name": "Ressources"
  },
  {
    "id": 30,
    "biome": 2,
    "type": "territory",
    "difficulty": 8,
    "row": 0,
    "col": 6,
    "name": "Ruines du désert"
  },
  {
    "id": 31,
    "biome": 2,
    "type": "quest",
    "difficulty": 0,
    "row": 0,
    "col": 7,
    "name": "Quête"
  },
  {
    "id": 32,
    "biome": 2,
    "type": "tower",
    "difficulty": 0,
    "row": 0,
    "col": 8,
    "name": "Tour de garde"
  },
  {
    "id": 33,
    "biome": 2,
    "type": "anomaly",
    "difficulty": 0,
    "row": 0,
    "col": 9,
    "name": "Anomalie"
  },
  {
    "id": 34,
    "biome": 2,
    "type": "obelisk",
    "difficulty": 0,
    "row": 0,
    "col": 10,
    "name": "Obélisque"
  },
  {
    "id": 35,
    "biome": 2,
    "type": "resource",
    "difficulty": 0,
    "row": 0,
    "col": 11,
    "name": "Ressources"
  },
  {
    "id": 36,
    "biome": 3,
    "type": "camp",
    "difficulty": 0,
    "row": 0,
    "col": 12,
    "name": "Campement"
  },
  {
    "id": 37,
    "biome": 3,
    "type": "territory",
    "difficulty": 4,
    "row": 1,
    "col": 12,
    "name": "Col d’obsidienne"
  },
  {
    "id": 38,
    "biome": 3,
    "type": "quest",
    "difficulty": 0,
    "row": 2,
    "col": 12,
    "name": "Quête"
  },
  {
    "id": 39,
    "biome": 3,
    "type": "territory",
    "difficulty": 6,
    "row": 3,
    "col": 12,
    "name": "Pic des ombres"
  },
  {
    "id": 40,
    "biome": 3,
    "type": "anomaly",
    "difficulty": 0,
    "row": 4,
    "col": 12,
    "name": "Anomalie"
  },
  {
    "id": 41,
    "biome": 3,
    "type": "resource",
    "difficulty": 0,
    "row": 5,
    "col": 12,
    "name": "Ressources"
  },
  {
    "id": 42,
    "biome": 3,
    "type": "territory",
    "difficulty": 8,
    "row": 6,
    "col": 12,
    "name": "Sommet ancestral"
  },
  {
    "id": 43,
    "biome": 3,
    "type": "quest",
    "difficulty": 0,
    "row": 7,
    "col": 12,
    "name": "Quête"
  },
  {
    "id": 44,
    "biome": 3,
    "type": "tower",
    "difficulty": 0,
    "row": 8,
    "col": 12,
    "name": "Tour de garde"
  },
  {
    "id": 45,
    "biome": 3,
    "type": "anomaly",
    "difficulty": 0,
    "row": 9,
    "col": 12,
    "name": "Anomalie"
  },
  {
    "id": 46,
    "biome": 3,
    "type": "obelisk",
    "difficulty": 0,
    "row": 10,
    "col": 12,
    "name": "Obélisque"
  },
  {
    "id": 47,
    "biome": 3,
    "type": "resource",
    "difficulty": 0,
    "row": 11,
    "col": 12,
    "name": "Ressources"
  }
];
export const BOSSES = [
  {
    "id": 1,
    "biome": 1,
    "name": "Gardien de la Forêt",
    "difficulty": 6,
    "reward": 3
  },
  {
    "id": 2,
    "biome": 2,
    "name": "Titan du Désert",
    "difficulty": 8,
    "reward": 4
  },
  {
    "id": 3,
    "biome": 3,
    "name": "Seigneur de la Montagne",
    "difficulty": 10,
    "reward": 5
  }
];
export const OBJECTIVES = [
  {
    "id": "or",
    "cost": 9
  },
  {
    "id": "cuivre",
    "cost": 9
  },
  {
    "id": "argent",
    "cost": 6
  },
  {
    "id": "obsidienne",
    "cost": 3
  }
];
export const QUESTS = [
  {
    "id": "hunt-0-1",
    "type": "hunt",
    "biome": 0,
    "difficulty": 2,
    "reward": 1,
    "title": "Sur la piste",
    "text": "Vaincre une créature de difficulté 2 dans le biome Cité."
  },
  {
    "id": "hunt-0-2",
    "type": "hunt",
    "biome": 0,
    "difficulty": 4,
    "reward": 2,
    "title": "Traque périlleuse",
    "text": "Vaincre une créature de difficulté 4 dans le biome Cité."
  },
  {
    "id": "hunt-0-3",
    "type": "hunt",
    "biome": 0,
    "difficulty": 6,
    "reward": 3,
    "title": "Chasse légendaire",
    "text": "Vaincre une créature de difficulté 6 dans le biome Cité."
  },
  {
    "id": "hunt-1-1",
    "type": "hunt",
    "biome": 1,
    "difficulty": 2,
    "reward": 1,
    "title": "Sur la piste",
    "text": "Vaincre une créature de difficulté 2 dans le biome Forêt."
  },
  {
    "id": "hunt-1-2",
    "type": "hunt",
    "biome": 1,
    "difficulty": 4,
    "reward": 2,
    "title": "Traque périlleuse",
    "text": "Vaincre une créature de difficulté 4 dans le biome Forêt."
  },
  {
    "id": "hunt-1-3",
    "type": "hunt",
    "biome": 1,
    "difficulty": 6,
    "reward": 3,
    "title": "Chasse légendaire",
    "text": "Vaincre une créature de difficulté 6 dans le biome Forêt."
  },
  {
    "id": "hunt-2-1",
    "type": "hunt",
    "biome": 2,
    "difficulty": 2,
    "reward": 1,
    "title": "Sur la piste",
    "text": "Vaincre une créature de difficulté 2 dans le biome Désert."
  },
  {
    "id": "hunt-2-2",
    "type": "hunt",
    "biome": 2,
    "difficulty": 4,
    "reward": 2,
    "title": "Traque périlleuse",
    "text": "Vaincre une créature de difficulté 4 dans le biome Désert."
  },
  {
    "id": "hunt-2-3",
    "type": "hunt",
    "biome": 2,
    "difficulty": 6,
    "reward": 3,
    "title": "Chasse légendaire",
    "text": "Vaincre une créature de difficulté 6 dans le biome Désert."
  },
  {
    "id": "hunt-3-1",
    "type": "hunt",
    "biome": 3,
    "difficulty": 2,
    "reward": 1,
    "title": "Sur la piste",
    "text": "Vaincre une créature de difficulté 2 dans le biome Montagne."
  },
  {
    "id": "hunt-3-2",
    "type": "hunt",
    "biome": 3,
    "difficulty": 4,
    "reward": 2,
    "title": "Traque périlleuse",
    "text": "Vaincre une créature de difficulté 4 dans le biome Montagne."
  },
  {
    "id": "hunt-3-3",
    "type": "hunt",
    "biome": 3,
    "difficulty": 6,
    "reward": 3,
    "title": "Chasse légendaire",
    "text": "Vaincre une créature de difficulté 6 dans le biome Montagne."
  },
  {
    "id": "charity-or-1",
    "type": "charity",
    "resource": "or",
    "amount": 3,
    "reward": 1,
    "title": "Un geste de charité",
    "text": "Donner 3 Or."
  },
  {
    "id": "charity-or-2",
    "type": "charity",
    "resource": "or",
    "amount": 6,
    "reward": 2,
    "title": "Secourir les habitants",
    "text": "Donner 6 Or."
  },
  {
    "id": "charity-or-3",
    "type": "charity",
    "resource": "or",
    "amount": 9,
    "reward": 3,
    "title": "Bienfaiteur du royaume",
    "text": "Donner 9 Or."
  },
  {
    "id": "charity-cuivre-1",
    "type": "charity",
    "resource": "cuivre",
    "amount": 3,
    "reward": 1,
    "title": "Un geste de charité",
    "text": "Donner 3 Cuivre."
  },
  {
    "id": "charity-cuivre-2",
    "type": "charity",
    "resource": "cuivre",
    "amount": 6,
    "reward": 2,
    "title": "Secourir les habitants",
    "text": "Donner 6 Cuivre."
  },
  {
    "id": "charity-cuivre-3",
    "type": "charity",
    "resource": "cuivre",
    "amount": 9,
    "reward": 3,
    "title": "Bienfaiteur du royaume",
    "text": "Donner 9 Cuivre."
  },
  {
    "id": "charity-argent-1",
    "type": "charity",
    "resource": "argent",
    "amount": 2,
    "reward": 1,
    "title": "Un geste de charité",
    "text": "Donner 2 Argent."
  },
  {
    "id": "charity-argent-2",
    "type": "charity",
    "resource": "argent",
    "amount": 4,
    "reward": 2,
    "title": "Secourir les habitants",
    "text": "Donner 4 Argent."
  },
  {
    "id": "charity-argent-3",
    "type": "charity",
    "resource": "argent",
    "amount": 6,
    "reward": 3,
    "title": "Bienfaiteur du royaume",
    "text": "Donner 6 Argent."
  },
  {
    "id": "charity-obsidienne-1",
    "type": "charity",
    "resource": "obsidienne",
    "amount": 1,
    "reward": 1,
    "title": "Un geste de charité",
    "text": "Donner 1 Obsidienne."
  },
  {
    "id": "charity-obsidienne-2",
    "type": "charity",
    "resource": "obsidienne",
    "amount": 2,
    "reward": 2,
    "title": "Secourir les habitants",
    "text": "Donner 2 Obsidienne."
  },
  {
    "id": "charity-obsidienne-3",
    "type": "charity",
    "resource": "obsidienne",
    "amount": 3,
    "reward": 3,
    "title": "Bienfaiteur du royaume",
    "text": "Donner 3 Obsidienne."
  }
];
export const ANOMALIES = [
  {
    "effect": "resource",
    "resource": "or",
    "amount": -3,
    "title": "Perte de Or",
    "sign": -1,
    "target": "self",
    "id": 0
  },
  {
    "effect": "resource",
    "resource": "cuivre",
    "amount": -3,
    "title": "Perte de Cuivre",
    "sign": -1,
    "target": "self",
    "id": 1
  },
  {
    "effect": "resource",
    "resource": "argent",
    "amount": -2,
    "title": "Perte de Argent",
    "sign": -1,
    "target": "self",
    "id": 2
  },
  {
    "effect": "resource",
    "resource": "obsidienne",
    "amount": -1,
    "title": "Perte de Obsidienne",
    "sign": -1,
    "target": "self",
    "id": 3
  },
  {
    "effect": "health",
    "amount": -4,
    "title": "Morsure de l’ombre",
    "sign": -1,
    "target": "self",
    "id": 4
  },
  {
    "effect": "skill",
    "title": "Pouvoir scellé",
    "sign": -1,
    "target": "self",
    "id": 5
  },
  {
    "effect": "potion",
    "title": "Fiole vide",
    "sign": -1,
    "target": "self",
    "id": 6
  },
  {
    "effect": "status",
    "title": "Malédiction",
    "sign": -1,
    "target": "self",
    "id": 7
  },
  {
    "effect": "resource",
    "resource": "or",
    "amount": -3,
    "title": "Perte de Or",
    "sign": -1,
    "target": "next",
    "id": 8
  },
  {
    "effect": "resource",
    "resource": "cuivre",
    "amount": -3,
    "title": "Perte de Cuivre",
    "sign": -1,
    "target": "next",
    "id": 9
  },
  {
    "effect": "resource",
    "resource": "argent",
    "amount": -2,
    "title": "Perte de Argent",
    "sign": -1,
    "target": "next",
    "id": 10
  },
  {
    "effect": "resource",
    "resource": "obsidienne",
    "amount": -1,
    "title": "Perte de Obsidienne",
    "sign": -1,
    "target": "next",
    "id": 11
  },
  {
    "effect": "health",
    "amount": -4,
    "title": "Morsure de l’ombre",
    "sign": -1,
    "target": "next",
    "id": 12
  },
  {
    "effect": "skill",
    "title": "Pouvoir scellé",
    "sign": -1,
    "target": "next",
    "id": 13
  },
  {
    "effect": "potion",
    "title": "Fiole vide",
    "sign": -1,
    "target": "next",
    "id": 14
  },
  {
    "effect": "status",
    "title": "Malédiction",
    "sign": -1,
    "target": "next",
    "id": 15
  },
  {
    "effect": "resource",
    "resource": "or",
    "amount": -3,
    "title": "Perte de Or",
    "sign": -1,
    "target": "previous",
    "id": 16
  },
  {
    "effect": "resource",
    "resource": "cuivre",
    "amount": -3,
    "title": "Perte de Cuivre",
    "sign": -1,
    "target": "previous",
    "id": 17
  },
  {
    "effect": "resource",
    "resource": "argent",
    "amount": -2,
    "title": "Perte de Argent",
    "sign": -1,
    "target": "previous",
    "id": 18
  },
  {
    "effect": "resource",
    "resource": "obsidienne",
    "amount": -1,
    "title": "Perte de Obsidienne",
    "sign": -1,
    "target": "previous",
    "id": 19
  },
  {
    "effect": "health",
    "amount": -4,
    "title": "Morsure de l’ombre",
    "sign": -1,
    "target": "previous",
    "id": 20
  },
  {
    "effect": "skill",
    "title": "Pouvoir scellé",
    "sign": -1,
    "target": "previous",
    "id": 21
  },
  {
    "effect": "potion",
    "title": "Fiole vide",
    "sign": -1,
    "target": "previous",
    "id": 22
  },
  {
    "effect": "status",
    "title": "Malédiction",
    "sign": -1,
    "target": "previous",
    "id": 23
  },
  {
    "effect": "resource",
    "resource": "or",
    "amount": 3,
    "title": "Gain de Or",
    "sign": 1,
    "target": "self",
    "id": 24
  },
  {
    "effect": "resource",
    "resource": "cuivre",
    "amount": 3,
    "title": "Gain de Cuivre",
    "sign": 1,
    "target": "self",
    "id": 25
  },
  {
    "effect": "resource",
    "resource": "argent",
    "amount": 2,
    "title": "Gain de Argent",
    "sign": 1,
    "target": "self",
    "id": 26
  },
  {
    "effect": "resource",
    "resource": "obsidienne",
    "amount": 1,
    "title": "Gain de Obsidienne",
    "sign": 1,
    "target": "self",
    "id": 27
  },
  {
    "effect": "health",
    "amount": 4,
    "title": "Souffle de vie",
    "sign": 1,
    "target": "self",
    "id": 28
  },
  {
    "effect": "skill",
    "title": "Élan retrouvé",
    "sign": 1,
    "target": "self",
    "id": 29
  },
  {
    "effect": "potion",
    "title": "Fiole renouvelée",
    "sign": 1,
    "target": "self",
    "id": 30
  },
  {
    "effect": "status",
    "title": "Bénédiction",
    "sign": 1,
    "target": "self",
    "id": 31
  },
  {
    "effect": "resource",
    "resource": "or",
    "amount": 3,
    "title": "Gain de Or",
    "sign": 1,
    "target": "next",
    "id": 32
  },
  {
    "effect": "resource",
    "resource": "cuivre",
    "amount": 3,
    "title": "Gain de Cuivre",
    "sign": 1,
    "target": "next",
    "id": 33
  },
  {
    "effect": "resource",
    "resource": "argent",
    "amount": 2,
    "title": "Gain de Argent",
    "sign": 1,
    "target": "next",
    "id": 34
  },
  {
    "effect": "resource",
    "resource": "obsidienne",
    "amount": 1,
    "title": "Gain de Obsidienne",
    "sign": 1,
    "target": "next",
    "id": 35
  },
  {
    "effect": "health",
    "amount": 4,
    "title": "Souffle de vie",
    "sign": 1,
    "target": "next",
    "id": 36
  },
  {
    "effect": "skill",
    "title": "Élan retrouvé",
    "sign": 1,
    "target": "next",
    "id": 37
  },
  {
    "effect": "potion",
    "title": "Fiole renouvelée",
    "sign": 1,
    "target": "next",
    "id": 38
  },
  {
    "effect": "status",
    "title": "Bénédiction",
    "sign": 1,
    "target": "next",
    "id": 39
  },
  {
    "effect": "resource",
    "resource": "or",
    "amount": 3,
    "title": "Gain de Or",
    "sign": 1,
    "target": "previous",
    "id": 40
  },
  {
    "effect": "resource",
    "resource": "cuivre",
    "amount": 3,
    "title": "Gain de Cuivre",
    "sign": 1,
    "target": "previous",
    "id": 41
  },
  {
    "effect": "resource",
    "resource": "argent",
    "amount": 2,
    "title": "Gain de Argent",
    "sign": 1,
    "target": "previous",
    "id": 42
  },
  {
    "effect": "resource",
    "resource": "obsidienne",
    "amount": 1,
    "title": "Gain de Obsidienne",
    "sign": 1,
    "target": "previous",
    "id": 43
  },
  {
    "effect": "health",
    "amount": 4,
    "title": "Souffle de vie",
    "sign": 1,
    "target": "previous",
    "id": 44
  },
  {
    "effect": "skill",
    "title": "Élan retrouvé",
    "sign": 1,
    "target": "previous",
    "id": 45
  },
  {
    "effect": "potion",
    "title": "Fiole renouvelée",
    "sign": 1,
    "target": "previous",
    "id": 46
  },
  {
    "effect": "status",
    "title": "Bénédiction",
    "sign": 1,
    "target": "previous",
    "id": 47
  }
];
export const RULEBOOK = "https://kitout3.github.io/livre-de-regle/";
export const VERSION = 1;