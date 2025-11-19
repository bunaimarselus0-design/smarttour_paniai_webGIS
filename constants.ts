import { Category, Destination } from './types';

// Data taken from the proposal PDF (Page 26)
export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 1,
    name: 'Danau Paniai',
    description: 'Salah satu danau terdalam di Indonesia dengan panorama pegunungan yang memukau. Cocok untuk wisata perahu dan fotografi.',
    category: Category.ALAM,
    latitude: -3.9055,
    longitude: 136.3566,
    rating: 4.8,
    image: 'https://picsum.photos/800/600?random=1',
    features: ['danau', 'gunung', 'perahu', 'pemandangan']
  },
  {
    id: 2,
    name: 'Danau Tigi',
    description: 'Danau dengan ekosistem endemik dan suasana yang tenang. Terletak di wilayah pegunungan.',
    category: Category.ALAM,
    latitude: -4.0333,
    longitude: 136.2333,
    rating: 4.6,
    image: 'https://picsum.photos/800/600?random=2',
    features: ['danau', 'dingin', 'tenang']
  },
  {
    id: 3,
    name: 'Danau Tage',
    description: 'Danau yang terletak berdekatan dengan Danau Paniai, menawarkan keindahan alam yang asri.',
    category: Category.ALAM,
    latitude: -3.9667,
    longitude: 136.2500,
    rating: 4.5,
    image: 'https://picsum.photos/800/600?random=3',
    features: ['danau', 'alam']
  },
  {
    id: 4,
    name: 'Bukit Bobaigo',
    description: 'Kawasan perbukitan dengan panorama alam yang indah, melihat Danau Paniai dari ketinggian.',
    category: Category.ALAM,
    latitude: -3.8900,
    longitude: 136.3600,
    rating: 4.7,
    image: 'https://picsum.photos/800/600?random=4',
    features: ['bukit', 'hiking', 'pemandangan', 'gunung']
  },
  {
    id: 5,
    name: 'Festival Budaya Paniai',
    description: 'Acara tahunan menampilkan seni tradisional khas Papua, tarian perang, dan musik.',
    category: Category.BUDAYA,
    latitude: -3.9000,
    longitude: 136.3500,
    rating: 4.9,
    image: 'https://picsum.photos/800/600?random=5',
    features: ['festival', 'tarian', 'musik', 'ramai']
  },
  {
    id: 6,
    name: 'Rumah Adat Suku Mee',
    description: 'Melihat kehidupan tradisional masyarakat Suku Mee dan arsitektur rumah adat.',
    category: Category.BUDAYA,
    latitude: -3.9100,
    longitude: 136.3400,
    rating: 4.4,
    image: 'https://picsum.photos/800/600?random=6',
    features: ['sejarah', 'arsitektur', 'edukasi']
  }
];

export const AVAILABLE_FEATURES = [
  'danau', 'gunung', 'perahu', 'pemandangan', 
  'dingin', 'tenang', 'bukit', 'hiking', 
  'festival', 'tarian', 'musik', 'sejarah', 'arsitektur', 'edukasi'
];
