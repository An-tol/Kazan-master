import type { Grain, Protein, SpiceStyle } from '../types';

export const DEFAULT_GRAINS: Grain[] = [
  {
    id: 'buckwheat',
    name: 'Гречка',
    category: 'grain',
    cookTimeMin: 20,
    waterRatio: 2.0,
    soakRequired: false,
    notes: 'Классическая рассыпчатая крупа с ярким ароматом. Идеально с фаршем или говядиной.',
    caloriesPer100g: 343,
    proteinPer100g: 13,
    fatPer100g: 3,
    carbsPer100g: 68,
    gramsPerGlass: 210
  },
  {
    id: 'chickpeas',
    name: 'Нут (Турецкий горох)',
    category: 'legume',
    cookTimeMin: 50,
    waterRatio: 2.5,
    soakRequired: true,
    soakHours: 8,
    notes: 'Плотный, с ореховым привкусом. Держит форму, великолепно впитывает сок зирвака.',
    caloriesPer100g: 364,
    proteinPer100g: 19,
    fatPer100g: 6,
    carbsPer100g: 61,
    gramsPerGlass: 200
  },
  {
    id: 'red_beans',
    name: 'Красная фасоль',
    category: 'legume',
    cookTimeMin: 55,
    waterRatio: 2.5,
    soakRequired: true,
    soakHours: 8,
    notes: 'Мясистая, насыщенная. Делает кашу очень сытной в стиле чили/лобио.',
    caloriesPer100g: 333,
    proteinPer100g: 24,
    fatPer100g: 1,
    carbsPer100g: 60,
    gramsPerGlass: 200
  },
  {
    id: 'barley',
    name: 'Перловка',
    category: 'grain',
    cookTimeMin: 45,
    waterRatio: 2.8,
    soakRequired: true,
    soakHours: 1,
    notes: 'Упругая, кремовая. Замочите на 1 час для равномерного разваривания.',
    caloriesPer100g: 320,
    proteinPer100g: 9,
    fatPer100g: 1.1,
    carbsPer100g: 66,
    gramsPerGlass: 220
  },
  {
    id: 'red_lentils',
    name: 'Красная чечевица',
    category: 'legume',
    cookTimeMin: 15,
    waterRatio: 2.0,
    soakRequired: false,
    notes: 'Варится моментально, разваривается в нежный бархатистый соус, обволакивающий мясо.',
    caloriesPer100g: 314,
    proteinPer100g: 24,
    fatPer100g: 1.5,
    carbsPer100g: 50,
    gramsPerGlass: 210
  },
  {
    id: 'rice',
    name: 'Рис (длиннозерный / басмати)',
    category: 'grain',
    cookTimeMin: 20,
    waterRatio: 2.0,
    soakRequired: false,
    notes: 'Универсальная основа, впитывает все специи и томатную зажарку.',
    caloriesPer100g: 350,
    proteinPer100g: 7,
    fatPer100g: 0.6,
    carbsPer100g: 78,
    gramsPerGlass: 220
  },
  {
    id: 'corn_grits',
    name: 'Кукурузная крупа',
    category: 'grain',
    cookTimeMin: 25,
    waterRatio: 3.2,
    soakRequired: false,
    notes: 'Яркий солнечный цвет, требует периодического помешивания, чтобы не осела на дно.',
    caloriesPer100g: 328,
    proteinPer100g: 8,
    fatPer100g: 1.2,
    carbsPer100g: 71,
    gramsPerGlass: 180
  },
  {
    id: 'split_peas',
    name: 'Горох (колотый)',
    category: 'legume',
    cookTimeMin: 40,
    waterRatio: 2.5,
    soakRequired: true,
    soakHours: 2,
    notes: 'Разваривается в густую шелковистую основу. Прекрасно сочетается с копченостями и фаршем.',
    caloriesPer100g: 341,
    proteinPer100g: 21,
    fatPer100g: 1.5,
    carbsPer100g: 53,
    gramsPerGlass: 220
  },
  {
    id: 'millet',
    name: 'Пшенка',
    category: 'grain',
    cookTimeMin: 20,
    waterRatio: 2.5,
    soakRequired: false,
    notes: 'Совет: перед закладкой ошпарьте крутым кипятком, чтобы смыть естественную горчинку.',
    caloriesPer100g: 348,
    proteinPer100g: 11,
    fatPer100g: 4,
    carbsPer100g: 67,
    gramsPerGlass: 220
  },
  {
    id: 'bulgur',
    name: 'Булгур',
    category: 'grain',
    cookTimeMin: 18,
    waterRatio: 2.0,
    soakRequired: false,
    notes: 'Дроблёная пшеница, обработанная паром. Остается рассыпчатой и не слипается.',
    caloriesPer100g: 342,
    proteinPer100g: 12,
    fatPer100g: 1.3,
    carbsPer100g: 63,
    gramsPerGlass: 200
  },
  {
    id: 'green_lentils',
    name: 'Зелёная / Коричневая чечевица',
    category: 'legume',
    cookTimeMin: 25,
    waterRatio: 2.2,
    soakRequired: false,
    notes: 'В отличие от красной, сохраняет форму зерен и дает приятную упругость.',
    caloriesPer100g: 310,
    proteinPer100g: 24,
    fatPer100g: 1.5,
    carbsPer100g: 50,
    gramsPerGlass: 210
  },
  {
    id: 'mung_beans',
    name: 'Маш (бобы мунг)',
    category: 'legume',
    cookTimeMin: 35,
    waterRatio: 2.5,
    soakRequired: true,
    soakHours: 1,
    notes: 'Классический компонент среднеазиатских каш (машхурда, машкичири).',
    caloriesPer100g: 312,
    proteinPer100g: 23,
    fatPer100g: 2,
    carbsPer100g: 54,
    gramsPerGlass: 200
  },
  {
    id: 'quinoa',
    name: 'Киноа',
    category: 'grain',
    cookTimeMin: 15,
    waterRatio: 2.0,
    soakRequired: false,
    notes: 'Легкая, рассыпчатая, с приятным хрустом зародышей. Богата белком.',
    caloriesPer100g: 368,
    proteinPer100g: 14,
    fatPer100g: 6,
    carbsPer100g: 57,
    gramsPerGlass: 190
  },
  {
    id: 'spelt',
    name: 'Полба',
    category: 'grain',
    cookTimeMin: 35,
    waterRatio: 2.5,
    soakRequired: false,
    notes: 'Древний вид пшеницы с плотной текстурой и ореховым привкусом.',
    caloriesPer100g: 337,
    proteinPer100g: 15,
    fatPer100g: 2.5,
    carbsPer100g: 60,
    gramsPerGlass: 200
  }
];

export const DEFAULT_PROTEINS: Protein[] = [
  {
    id: 'ground_meat',
    name: 'Фарш (говяжий / домашний)',
    category: 'meat',
    fryTimeMin: 8,
    gramsPerServing: 130,
    caloriesPer100g: 250,
    proteinPer100g: 18,
    fatPer100g: 20,
    carbsPer100g: 0
  },
  {
    id: 'chicken_thigh',
    name: 'Куриное бедро (филе кусочками)',
    category: 'poultry',
    fryTimeMin: 10,
    gramsPerServing: 140,
    caloriesPer100g: 180,
    proteinPer100g: 20,
    fatPer100g: 11,
    carbsPer100g: 0
  },
  {
    id: 'chicken_breast',
    name: 'Куриное филе грудки (кубиками)',
    category: 'poultry',
    fryTimeMin: 7,
    gramsPerServing: 120,
    caloriesPer100g: 113,
    proteinPer100g: 23.6,
    fatPer100g: 1.9,
    carbsPer100g: 0.4
  },
  {
    id: 'turkey_fillet',
    name: 'Филе индейки (кусочками)',
    category: 'poultry',
    fryTimeMin: 8,
    gramsPerServing: 130,
    caloriesPer100g: 110,
    proteinPer100g: 21.5,
    fatPer100g: 2.5,
    carbsPer100g: 0
  },
  {
    id: 'beef_strips',
    name: 'Говядина (соломкой / кусочками)',
    category: 'meat',
    fryTimeMin: 12,
    gramsPerServing: 140,
    caloriesPer100g: 190,
    proteinPer100g: 22,
    fatPer100g: 11,
    carbsPer100g: 0
  },
  {
    id: 'pork_pieces',
    name: 'Свинина (нежирная, кубиками)',
    category: 'meat',
    fryTimeMin: 10,
    gramsPerServing: 130,
    caloriesPer100g: 210,
    proteinPer100g: 20,
    fatPer100g: 14,
    carbsPer100g: 0
  },
  {
    id: 'mushrooms',
    name: 'Шампиньоны / Лесные грибы (постный)',
    category: 'veg',
    fryTimeMin: 8,
    gramsPerServing: 120,
    caloriesPer100g: 27,
    proteinPer100g: 4,
    fatPer100g: 1,
    carbsPer100g: 1
  }
];

export const SPICE_STYLES: Record<SpiceStyle, { name: string; description: string; spices: { name: string; amount: string; notes?: string }[] }> = {
  classic: {
    name: 'Классический казан',
    description: 'Универсальный сбалансированный букет специй для любого мяса',
    spices: [
      { name: 'Зира (кумин)', amount: '1/2 ч. л.', notes: 'растереть пальцами' },
      { name: 'Кориандр молотый', amount: '1/2 ч. л.' },
      { name: 'Паприка сладкая', amount: '1 ч. л.', notes: 'для цвета и сладости' },
      { name: 'Черный перец', amount: 'по вкусу' },
      { name: 'Лавровый лист', amount: '1-2 шт.', notes: 'положить в казан за 10 мин до конца' }
    ]
  },
  plov: {
    name: 'Восточный (Пловный)',
    description: 'Ароматный среднеазиатский профиль с барбарисом и целым чесноком',
    spices: [
      { name: 'Зира цельная', amount: '1 ч. л.', notes: 'главная специя плова' },
      { name: 'Барбарис сушеный', amount: '1 ст. л.', notes: 'дает приятную кислинку' },
      { name: 'Куркума (или шафран)', amount: '1/2 ч. л.', notes: 'золотой цвет' },
      { name: 'Чеснок целый', amount: '1 головка целиком', notes: 'снять шелуху и утопить в центр' },
      { name: 'Острый стручковый перец', amount: '1 шт.', notes: 'целиком, не разрезая' }
    ]
  },
  georgian: {
    name: 'Кавказский (Пряный)',
    description: 'Яркий букет трав: хмели-сунели, уцхо-сунели и кориандр',
    spices: [
      { name: 'Хмели-сунели', amount: '1 ч. л.' },
      { name: 'Уцхо-сунели (пажитник)', amount: '1/2 ч. л.' },
      { name: 'Красный острый перец', amount: 'на кончике ножа' },
      { name: 'Сушеный чеснок и кориандр', amount: '1/2 ч. л.' },
      { name: 'Свежая кинза или петрушка', amount: 'пучок', notes: 'посыпать при подаче' }
    ]
  },
  herbs: {
    name: 'Нежный с травами',
    description: 'Мягкий европейский вкус с прованскими травами и сливочным маслом',
    spices: [
      { name: 'Прованские травы (тимьян, розмарин)', amount: '1 ч. л.' },
      { name: 'Сливочное масло', amount: '25-30 г', notes: 'положить на поверхность перед упреванием' },
      { name: 'Мускатный орех', amount: 'щепотка' },
      { name: 'Черный свежемолотый перец', amount: 'по вкусу' }
    ]
  }
};
