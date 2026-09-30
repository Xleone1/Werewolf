export type VillageWeather = 'Clear' | 'FullMoon' | 'ThickFog' | 'Eclipse' | 'Thunderstorm';

export interface WeatherInfo {
  type: VillageWeather;
  emoji: string;
  titleFr: string;
  titleEn: string;
  titleEs: string;
  descFr: string;
  descEn: string;
  descEs: string;
}

export const WEATHER_DETAILS: Record<VillageWeather, WeatherInfo> = {
  Clear: {
    type: 'Clear',
    emoji: '🌌',
    titleFr: 'Nuit Étoilée et Paisible',
    titleEn: 'Peaceful Starry Night',
    titleEs: 'Noche Estrellada y Serena',
    descFr: 'Le ciel est dégagé sur le village. Les étoiles brillent sereinement.',
    descEn: 'The sky over the village is clear. Stars shine serenely.',
    descEs: 'El cielo está despejado sobre la aldea. Las estrellas brillan serenas.',
  },
  FullMoon: {
    type: 'FullMoon',
    emoji: '🌕',
    titleFr: 'Pleine Lune Magique',
    titleEn: 'Magical Full Moon',
    titleEs: 'Luna Llena Mágica',
    descFr:
      "La lune brille d'une clarté surnaturelle... L'énergie des Loups et des créatures de la nuit est décuplée !",
    descEn:
      'The moon shines with supernatural clarity... The energy of wolves and night creatures surges!',
    descEs:
      'La luna brilla con una claridad sobrenatural... ¡La energía de los lobos y las criaturas de la noche se multiplica!',
  },
  ThickFog: {
    type: 'ThickFog',
    emoji: '🌫️',
    titleFr: 'Brouillard Épais et Mystérieux',
    titleEn: 'Thick Mysterious Fog',
    titleEs: 'Niebla Densa y Misteriosa',
    descFr:
      "Un brouillard dense s'étend sur Thiercelieux. Les silhouettes s'estompent dans l'ombre...",
    descEn: 'A dense fog creeps over the village. Silhouettes fade in the shadows...',
    descEs:
      'Una niebla densa se extiende sobre la aldea. Las siluetas se desdibujan en las sombras...',
  },
  Eclipse: {
    type: 'Eclipse',
    emoji: '⚡',
    titleFr: 'Éclipse Obscure',
    titleEn: 'Dark Eclipse',
    titleEs: 'Eclipse Oscuro',
    descFr:
      'Une éclipse mystique plonge le village dans le secret... Les votes de lynchage restent anonymes !',
    descEn: 'A mystical eclipse shrouds the village... Lynch votes will be anonymous!',
    descEs:
      '¡Un eclipse místico sume a la aldea en el secreto... Los votos de linchamiento serán anónimos!',
  },
  Thunderstorm: {
    type: 'Thunderstorm',
    emoji: '🌩️',
    titleFr: 'Orage et Tempête',
    titleEn: 'Thunderstorm & Tempests',
    titleEs: 'Tormenta y Tempestad',
    descFr:
      "Le vent hurle et les éclairs fendent la nuit ! Les nuits et les jours s'enchaînent à toute vitesse.",
    descEn: 'Wind howls and lightning splits the night! Phases pass swiftly.',
    descEs:
      '¡El viento aúlla y los relámpagos rasgan la noche! Las fases se suceden a toda velocidad.',
  },
};

export function getRandomWeather(): VillageWeather {
  const rand = Math.random();
  if (rand < 0.5) return 'Clear';
  if (rand < 0.65) return 'FullMoon';
  if (rand < 0.78) return 'ThickFog';
  if (rand < 0.89) return 'Eclipse';
  return 'Thunderstorm';
}
