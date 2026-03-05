// Types for Cultural Context feature

export type CulturalContext = 
  | 'Diwali'
  | 'Holi'
  | 'Eid'
  | 'Christmas'
  | 'Pongal'
  | 'Onam'
  | 'Durga Puja'
  | 'Ganesh Chaturthi'
  | 'Navratri'
  | 'IPL Season'
  | 'Cricket World Cup'
  | 'Monsoon'
  | 'Summer'
  | 'Winter'
  | 'Wedding Season'
  | 'Festival Season'
  | 'Independence Day'
  | 'Republic Day'
  | 'New Year'
  | 'None';

export interface CulturalContextData {
  name: CulturalContext;
  emojis: string[];
  slang: string[];
  metaphors: string[];
  themes: string[];
  hashtags: string[];
}

export const CULTURAL_CONTEXTS: Record<CulturalContext, CulturalContextData> = {
  'Diwali': {
    name: 'Diwali',
    emojis: ['🪔', '✨', '🎆', '🎇', '💥', '🌟', '🪔'],
    slang: ['diwali ki mubarak', 'lights', 'diyas', 'mithai', 'festive vibes'],
    metaphors: ['light over darkness', 'new beginnings', 'prosperity', 'victory of good'],
    themes: ['celebration', 'family', 'tradition', 'lights', 'sweets', 'gifts'],
    hashtags: ['#Diwali2024', '#FestivalOfLights', '#HappyDiwali', '#DiwaliVibes', '#Deepavali']
  },
  'Holi': {
    name: 'Holi',
    emojis: ['🎨', '🌈', '💦', '🎉', '🎊', '😄'],
    slang: ['holi hai', 'rang barse', 'bura na maano', 'colors', 'gulal'],
    metaphors: ['colorful life', 'joy', 'celebration', 'unity', 'fresh start'],
    themes: ['colors', 'joy', 'friendship', 'celebration', 'music', 'dance'],
    hashtags: ['#Holi2024', '#FestivalOfColors', '#HappyHoli', '#RangBarse', '#HoliCelebration']
  },
  'Eid': {
    name: 'Eid',
    emojis: ['🌙', '✨', '🕌', '🙏', '🤲', '🎉'],
    slang: ['eid mubarak', 'festive', 'biryani', 'seviyan', 'family time'],
    metaphors: ['blessings', 'togetherness', 'faith', 'celebration', 'gratitude'],
    themes: ['faith', 'family', 'feast', 'charity', 'prayer', 'celebration'],
    hashtags: ['#EidMubarak', '#Eid2024', '#FestivalOfJoy', '#EidCelebration', '#BlessedEid']
  },
  'Christmas': {
    name: 'Christmas',
    emojis: ['🎄', '🎅', '🎁', '⭐', '❄️', '🔔'],
    slang: ['christmas vibes', 'santa', 'gifts', 'jingle bells', 'festive'],
    metaphors: ['giving', 'joy', 'peace', 'hope', 'celebration'],
    themes: ['celebration', 'family', 'gifts', 'joy', 'peace', 'tradition'],
    hashtags: ['#Christmas2024', '#MerryChristmas', '#FestiveSeason', '#HolidayVibes', '#Xmas']
  },
  'Pongal': {
    name: 'Pongal',
    emojis: ['🌾', '☀️', '🍚', '🐄', '🪔', '🎉'],
    slang: ['pongal', 'harvest', 'sugarcane', 'kolam', 'tamil new year'],
    metaphors: ['harvest', 'prosperity', 'gratitude', 'new beginnings', 'abundance'],
    themes: ['harvest', 'prosperity', 'tradition', 'family', 'gratitude', 'celebration'],
    hashtags: ['#Pongal2024', '#HarvestFestival', '#TamilPongal', '#PongalVibes', '#Prosperity']
  },
  'Onam': {
    name: 'Onam',
    emojis: ['🌺', '🛶', '🐘', '🍌', '🎉', '🌸'],
    slang: ['onam', 'sadhya', 'kathakali', 'boat race', 'flower carpet'],
    metaphors: ['harmony', 'prosperity', 'unity', 'celebration', 'tradition'],
    themes: ['harvest', 'celebration', 'tradition', 'family', 'feast', 'culture'],
    hashtags: ['#Onam2024', '#HarvestFestival', '#KeralaOnam', '#OnamSadhya', '#FestiveVibes']
  },
  'Durga Puja': {
    name: 'Durga Puja',
    emojis: ['🙏', '🌺', '🎉', '🔥', '✨', '🌟'],
    slang: ['durga puja', 'maa durga', 'pandal hopping', 'dhunuchi', 'bengali'],
    metaphors: ['victory of good', 'divine power', 'celebration', 'devotion', 'strength'],
    themes: ['celebration', 'devotion', 'tradition', 'family', 'culture', 'victory'],
    hashtags: ['#DurgaPuja2024', '#MaaDurga', '#PujoVibes', '#DurgaPuja', '#FestiveSeason']
  },
  'Ganesh Chaturthi': {
    name: 'Ganesh Chaturthi',
    emojis: ['🐘', '🙏', '🌺', '🍬', '✨', '🎉'],
    slang: ['ganpati bappa', 'modak', 'visarjan', 'ganesh festival', 'bappa moraya'],
    metaphors: ['new beginnings', 'wisdom', 'prosperity', 'remover of obstacles'],
    themes: ['celebration', 'tradition', 'family', 'devotion', 'wisdom', 'prosperity'],
    hashtags: ['#GaneshChaturthi2024', '#GanpatiBappa', '#FestivalOfJoy', '#GaneshFestival', '#BappaMorya']
  },
  'Navratri': {
    name: 'Navratri',
    emojis: ['🔥', '✨', '🌟', '🎉', '🙏', '🌺'],
    slang: ['navratri', 'garba', 'dandiya', 'dandiya night', 'nine nights'],
    metaphors: ['divine feminine', 'celebration', 'devotion', 'victory', 'strength'],
    themes: ['celebration', 'dance', 'devotion', 'tradition', 'culture', 'family'],
    hashtags: ['#Navratri2024', '#GarbaNight', '#Dandiya', '#NavratriCelebration', '#FestivalOfJoy']
  },
  'IPL Season': {
    name: 'IPL Season',
    emojis: ['🏏', '🔥', '⚡', '🏆', '🎉', '💪'],
    slang: ['ipl', 'cricket fever', 'match', 'six', 'boundary', 'team spirit'],
    metaphors: ['competition', 'teamwork', 'victory', 'passion', 'excitement'],
    themes: ['cricket', 'competition', 'entertainment', 'team spirit', 'excitement'],
    hashtags: ['#IPL2024', '#CricketFever', '#IPLSeason', '#TeamIndia', '#CricketLove']
  },
  'Cricket World Cup': {
    name: 'Cricket World Cup',
    emojis: ['🏏', '🏆', '🌍', '🔥', '⚡', '🎉'],
    slang: ['world cup', 'cricket', 'team india', 'victory', 'champions'],
    metaphors: ['global competition', 'national pride', 'victory', 'excellence'],
    themes: ['cricket', 'competition', 'national pride', 'victory', 'celebration'],
    hashtags: ['#CricketWorldCup2024', '#TeamIndia', '#WorldCup', '#CricketLove', '#Champions']
  },
  'Monsoon': {
    name: 'Monsoon',
    emojis: ['🌧️', '☔', '🌈', '⛈️', '💧', '🌿'],
    slang: ['monsoon', 'barish', 'rain', 'chai pakoda', 'rainy vibes'],
    metaphors: ['refreshment', 'new beginnings', 'growth', 'romance', 'cozy'],
    themes: ['rain', 'refreshment', 'cozy', 'romance', 'nature', 'growth'],
    hashtags: ['#Monsoon2024', '#RainySeason', '#MonsoonVibes', '#Barish', '#RainyDays']
  },
  'Summer': {
    name: 'Summer',
    emojis: ['☀️', '🌴', '🏖️', '🍹', '🕶️', '🌺'],
    slang: ['summer', 'garmi', 'vacation', 'mango', 'cold drink'],
    metaphors: ['energy', 'vibrancy', 'growth', 'adventure', 'fun'],
    themes: ['heat', 'vacation', 'fun', 'energy', 'outdoors', 'celebration'],
    hashtags: ['#Summer2024', '#SummerVibes', '#HeatWave', '#VacationMode', '#SummerFun']
  },
  'Winter': {
    name: 'Winter',
    emojis: ['❄️', '🧥', '☕', '🔥', '🧣', '🌟'],
    slang: ['winter', 'sardi', 'cozy', 'hot coffee', 'blanket weather'],
    metaphors: ['coziness', 'reflection', 'warmth', 'comfort', 'introspection'],
    themes: ['cold', 'cozy', 'comfort', 'warmth', 'reflection', 'celebration'],
    hashtags: ['#Winter2024', '#WinterVibes', '#CozySeason', '#ColdWeather', '#WinterWonderland']
  },
  'Wedding Season': {
    name: 'Wedding Season',
    emojis: ['💒', '👰', '🤵', '💍', '🎉', '✨'],
    slang: ['wedding season', 'shaadi', 'baraat', 'mehendi', 'sangeet'],
    metaphors: ['union', 'celebration', 'new beginnings', 'love', 'commitment'],
    themes: ['celebration', 'love', 'family', 'tradition', 'joy', 'union'],
    hashtags: ['#WeddingSeason2024', '#ShaadiVibes', '#IndianWedding', '#WeddingCelebration', '#BigFatIndianWedding']
  },
  'Festival Season': {
    name: 'Festival Season',
    emojis: ['🎉', '✨', '🌟', '🎊', '🎆', '🎇'],
    slang: ['festive season', 'celebration', 'party', 'joy', 'festive vibes'],
    metaphors: ['celebration', 'joy', 'unity', 'tradition', 'community'],
    themes: ['celebration', 'joy', 'family', 'tradition', 'community', 'festivity'],
    hashtags: ['#FestivalSeason2024', '#FestiveVibes', '#Celebration', '#Joy', '#FestivalTime']
  },
  'Independence Day': {
    name: 'Independence Day',
    emojis: ['🇮🇳', '🎆', '✨', '🌟', '🎉', '🙏'],
    slang: ['independence day', 'azadi', 'freedom', 'proud indian', 'nation'],
    metaphors: ['freedom', 'patriotism', 'unity', 'progress', 'pride'],
    themes: ['patriotism', 'freedom', 'unity', 'celebration', 'pride', 'nation'],
    hashtags: ['#IndependenceDay2024', '#Azadi', '#ProudIndian', '#India', '#Freedom']
  },
  'Republic Day': {
    name: 'Republic Day',
    emojis: ['🇮🇳', '🎉', '🌟', '✨', '🎆', '🙏'],
    slang: ['republic day', 'gantantra diwas', 'constitution', 'proud indian'],
    metaphors: ['democracy', 'constitution', 'unity', 'pride', 'progress'],
    themes: ['patriotism', 'democracy', 'constitution', 'unity', 'celebration'],
    hashtags: ['#RepublicDay2024', '#GantantraDiwas', '#India', '#Constitution', '#ProudIndian']
  },
  'New Year': {
    name: 'New Year',
    emojis: ['🎊', '🎉', '✨', '🌟', '🥂', '🎆'],
    slang: ['new year', 'party', 'celebration', 'resolution', 'fresh start'],
    metaphors: ['new beginnings', 'fresh start', 'opportunity', 'growth', 'celebration'],
    themes: ['celebration', 'new beginnings', 'resolutions', 'hope', 'party'],
    hashtags: ['#NewYear2024', '#HappyNewYear', '#NewBeginnings', '#2024Vibes', '#Celebration']
  },
  'None': {
    name: 'None',
    emojis: [],
    slang: [],
    metaphors: [],
    themes: [],
    hashtags: []
  }
};

export function getCulturalContextData(context: CulturalContext): CulturalContextData {
  return CULTURAL_CONTEXTS[context] || CULTURAL_CONTEXTS['None'];
}

export function generateCulturalPrompt(context: CulturalContext): string {
  const data = getCulturalContextData(context);
  
  if (context === 'None') {
    return '';
  }

  let prompt = `\n\nCultural Context: ${context}\n`;
  
  if (data.emojis.length > 0) {
    prompt += `Cultural Emojis: ${data.emojis.join(' ')}\n`;
  }
  
  if (data.slang.length > 0) {
    prompt += `Cultural Slang/Phrases: ${data.slang.join(', ')}\n`;
  }
  
  if (data.metaphors.length > 0) {
    prompt += `Cultural Metaphors: ${data.metaphors.join(', ')}\n`;
  }
  
  if (data.themes.length > 0) {
    prompt += `Cultural Themes: ${data.themes.join(', ')}\n`;
  }
  
  prompt += `\nInstructions for Cultural Context:
1. Naturally weave in relevant cultural emojis, slang, and metaphors where appropriate
2. Make the content feel authentic and relatable to Indian audiences during this ${context} period
3. Use cultural references that resonate with the ${context} celebration/season
4. Include culturally relevant hashtags from the suggested list
5. Keep the tone festive, warm, and culturally aware
6. Avoid being stereotypical - be authentic and respectful`;

  return prompt;
}
