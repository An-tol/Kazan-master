import type { Grain, Protein } from '../types';

export const DEFAULT_GRAINS: Grain[] = [
  {
    id: 'buckwheat',
    name: 'Гречка',
    category: 'grain',
    cookTimeMin: 20,
    waterRatio: 2.0,
    soakRequired: false,
    notes: 'Классическая рассыпчатая крупа с ярким ароматом. Идеально с фаршем или говядиной.'
  },
  {
    id: 'chickpeas',
    name: 'Нут (Турецкий горох)',
    category: 'legume',
    cookTimeMin: 50,
    waterRatio: 2.5,
    soakRequired: true,
    soakHours: 8,
    notes: 'Плотный, с ореховым привкусом. Держит форму, великолепно впитывает сок зирвака.'
  },
  {
    id: 'red_beans',
    name: 'Красная фасоль',
    category: 'legume',
    cookTimeMin: 55,
    waterRatio: 2.5,
    soakRequired: true,
    soakHours: 8,
    notes: 'Мясистая, насыщенная. Делает кашу очень сытной в стиле чили/лобио.'
  },
  {
    id: 'barley',
    name: 'Перловка',
    category: 'grain',
    cookTimeMin: 45,
    waterRatio: 2.8,
    soakRequired: true,
    soakHours: 1,
    notes: 'Упругая, кремовая. Замочите на 1 час для равномерного разваривания.'
  },
  {
    id: 'red_lentils',
    name: 'Красная чечевица',
    category: 'legume',
    cookTimeMin: 15,
    waterRatio: 2.0,
    soakRequired: false,
    notes: 'Варится моментально, разваривается в нежный бархатистый соус, обволакивающий мясо.'
  },
  {
    id: 'rice',
    name: 'Рис (длиннозерный / басмати)',
    category: 'grain',
    cookTimeMin: 20,
    waterRatio: 2.0,
    soakRequired: false,
    notes: 'Универсальная основа, впитывает все специи и томатную зажарку.'
  },
  {
    id: 'corn_grits',
    name: 'Кукурузная крупа',
    category: 'grain',
    cookTimeMin: 25,
    waterRatio: 3.2,
    soakRequired: false,
    notes: 'Яркий солнечный цвет, требует периодического помешивания, чтобы не осела на дно.'
  },
  {
    id: 'split_peas',
    name: 'Горох (колотый)',
    category: 'legume',
    cookTimeMin: 40,
    waterRatio: 2.5,
    soakRequired: true,
    soakHours: 2,
    notes: 'Разваривается в густую шелковистую основу. Прекрасно сочетается с копченостями и фаршем.'
  },
  {
    id: 'millet',
    name: 'Пшенка',
    category: 'grain',
    cookTimeMin: 20,
    waterRatio: 2.5,
    soakRequired: false,
    notes: 'Совет: перед закладкой ошпарьте крутым кипятком, чтобы смыть естественную горчинку.'
  },
  {
    id: 'bulgur',
    name: 'Булгур',
    category: 'grain',
    cookTimeMin: 18,
    waterRatio: 2.0,
    soakRequired: false,
    notes: 'Дроблёная пшеница, обработанная паром. Остается рассыпчатой и не слипается.'
  },
  {
    id: 'green_lentils',
    name: 'Зелёная / Коричневая чечевица',
    category: 'legume',
    cookTimeMin: 25,
    waterRatio: 2.2,
    soakRequired: false,
    notes: 'В отличие от красной, сохраняет форму зерен и дает приятную упругость.'
  },
  {
    id: 'mung_beans',
    name: 'Маш (бобы мунг)',
    category: 'legume',
    cookTimeMin: 35,
    waterRatio: 2.5,
    soakRequired: true,
    soakHours: 1,
    notes: 'Классический компонент среднеазиатских каш (машхурда, машкичири).'
  },
  {
    id: 'quinoa',
    name: 'Киноа',
    category: 'grain',
    cookTimeMin: 15,
    waterRatio: 2.0,
    soakRequired: false,
    notes: 'Легкая, рассыпчатая, с приятным хрустом зародышей. Богата белком.'
  },
  {
    id: 'spelt',
    name: 'Полба',
    category: 'grain',
    cookTimeMin: 35,
    waterRatio: 2.5,
    soakRequired: false,
    notes: 'Древний вид пшеницы с плотной текстурой и ореховым привкусом.'
  }
];

export const DEFAULT_PROTEINS: Protein[] = [
  {
    id: 'ground_meat',
    name: 'Фарш (говяжий / домашний)',
    category: 'meat',
    fryTimeMin: 8,
    gramsPerServing: 130
  },
  {
    id: 'chicken_thigh',
    name: 'Куриное бедро (филе кусочками)',
    category: 'poultry',
    fryTimeMin: 10,
    gramsPerServing: 140
  },
  {
    id: 'chicken_breast',
    name: 'Куриное филе грудки (кубиками)',
    category: 'poultry',
    fryTimeMin: 7,
    gramsPerServing: 120
  },
  {
    id: 'turkey_fillet',
    name: 'Филе индейки (кусочками)',
    category: 'poultry',
    fryTimeMin: 8,
    gramsPerServing: 130
  },
  {
    id: 'beef_strips',
    name: 'Говядина (соломкой / кусочками)',
    category: 'meat',
    fryTimeMin: 12,
    gramsPerServing: 140
  },
  {
    id: 'pork_pieces',
    name: 'Свинина (нежирная, кубиками)',
    category: 'meat',
    fryTimeMin: 10,
    gramsPerServing: 130
  },
  {
    id: 'mushrooms',
    name: 'Шампиньоны / Лесные грибы (постный)',
    category: 'veg',
    fryTimeMin: 8,
    gramsPerServing: 120
  }
];

export const SPICE_RECOMMENDATIONS = [
  'Зира (кумин) — 1/2 ч.л. (растереть пальцами)',
  'Кориандр молотый — 1/2 ч.л.',
  'Паприка сладкая — 1 ч.л. (для цвета и сладости)',
  'Черный свежемолотый перец — по вкусу',
  'Сушеный чеснок или хмели-сунели — 1/2 ч.л.',
  'Лавровый лист — 1-2 шт. (добавить за 10 мин до конца)'
];
