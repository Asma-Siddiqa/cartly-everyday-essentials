import headphonesImage from '../assets/products/headphones.jpg'
import backpackImage from '../assets/products/backpack.jpg'
import speakerImage from '../assets/products/speaker.jpg'
import lampImage from '../assets/products/lamp.jpg'
import keyboardImage from '../assets/products/keyboard.jpg'
import mouseImage from '../assets/products/mouse.jpg'
import bottleImage from '../assets/products/bottle.jpg'
import notebookImage from '../assets/products/notebook.jpg'
import powerBankImage from '../assets/products/powerbank.jpg'
import smartwatchImage from '../assets/products/smartwatch.jpg'
import sneakersImage from '../assets/products/sneakers.jpg'
import coffeeImage from '../assets/products/coffee.jpg'
import chargerImage from '../assets/products/charger.jpg'

/*
 * Local catalogue. Product IDs are stable and are the only values saved in the
 * cart, so product details can change without leaving stale copies in storage.
 */
export const PRODUCTS = [
  {
    id: 'aurora-anc-headphones',
    name: 'Aurora ANC Wireless Headphones',
    brand: 'Soundwave',
    category: 'Audio',
    price: 8499,
    rating: 4.6,
    reviewCount: 218,
    stock: 8,
    image: headphonesImage,
    badge: 'Best seller',
    description:
      'Over-ear headphones with active noise cancelling, a lightweight headband, and up to 32 hours of battery life. Tuned for long study sessions, noisy commutes, and shared hostel rooms.',
    highlights: [
      'Active noise cancelling with a transparency mode',
      '32-hour battery life; USB-C fast charging',
      'Soft memory-foam ear cushions',
    ],
    deliveryEstimate: '1–2 working days',
    keywords: 'wireless bluetooth over ear noise cancelling headphones study',
  },
  {
    id: 'trailblazer-commuter-backpack',
    name: 'Trailblazer 24L Commuter Backpack',
    brand: 'Northline',
    category: 'Bags',
    price: 3850,
    rating: 4.4,
    reviewCount: 96,
    stock: 12,
    image: backpackImage,
    badge: null,
    description:
      'A water-resistant 24-litre backpack with a padded 15-inch laptop sleeve, a quick-access front pocket, and a breathable back panel. Sized for university days and weekend trips.',
    highlights: [
      'Padded compartment fits most 15-inch laptops',
      'Water-resistant recycled polyester shell',
      'Hidden side pocket for a water bottle',
    ],
    deliveryEstimate: '1–2 working days',
    keywords: 'backpack bag laptop commuter university water resistant',
  },
  {
    id: 'pulse-mini-speaker',
    name: 'Pulse Mini Bluetooth Speaker',
    brand: 'Soundwave',
    category: 'Audio',
    price: 2299,
    rating: 4.2,
    reviewCount: 142,
    stock: 5,
    image: speakerImage,
    badge: null,
    description:
      'A pocket-sized speaker with a surprisingly full sound, 12 hours of playback, and a splash-resistant finish. Pair two units for stereo sound.',
    highlights: [
      '12-hour playtime from a single charge',
      'IPX5 splash resistance',
      'Wireless stereo pairing with a second Pulse speaker',
    ],
    deliveryEstimate: '1–2 working days',
    keywords: 'speaker bluetooth portable mini audio wireless',
  },
  {
    id: 'halo-desk-lamp',
    name: 'Halo LED Desk Lamp',
    brand: 'Lumio',
    category: 'Home',
    price: 1899,
    rating: 4.5,
    reviewCount: 73,
    stock: 10,
    image: lampImage,
    badge: 'Study pick',
    description:
      'A compact LED desk lamp with three colour temperatures, stepless dimming, and a weighted base that stays put. The warm setting is easy on late-night eyes.',
    highlights: [
      'Three light temperatures and touch dimming',
      'Flicker-free, eye-friendly LED panel',
      'Folding arm saves desk space',
    ],
    deliveryEstimate: '1–2 working days',
    keywords: 'lamp light desk study led home',
  },
  {
    id: 'clickcraft-mechanical-keyboard',
    name: 'ClickCraft 65% Mechanical Keyboard',
    brand: 'KeyForge',
    category: 'Tech Accessories',
    price: 6750,
    rating: 4.7,
    reviewCount: 184,
    stock: 4,
    image: keyboardImage,
    badge: 'Editor’s pick',
    description:
      'A compact 65% mechanical keyboard with hot-swappable switches, PBT keycaps, and both wired and Bluetooth modes. The smaller footprint leaves more room for notes.',
    highlights: [
      'Hot-swappable tactile switches',
      'Connect via USB-C or Bluetooth',
      'Compact 65% layout with arrow keys',
    ],
    deliveryEstimate: '1–2 working days',
    keywords: 'keyboard mechanical wireless bluetooth usb c tech',
  },
  {
    id: 'glide-wireless-mouse',
    name: 'Glide Wireless Mouse',
    brand: 'KeyForge',
    category: 'Tech Accessories',
    price: 1450,
    rating: 4.1,
    reviewCount: 156,
    stock: 15,
    image: mouseImage,
    badge: null,
    description:
      'A quiet, comfortable wireless mouse with a 1,000 DPI sensor and a battery that lasts up to 18 months. A reliable everyday companion for lectures and assignments.',
    highlights: [
      'Silent-click buttons',
      'Up to 18 months on one AA battery',
      'Plug-and-play USB receiver',
    ],
    deliveryEstimate: '1–2 working days',
    keywords: 'mouse wireless silent ergonomic computer accessory',
  },
  {
    id: 'hydra-steel-bottle',
    name: 'Hydra 1L Insulated Steel Bottle',
    brand: 'Terra',
    category: 'Lifestyle',
    price: 1250,
    rating: 4.3,
    reviewCount: 88,
    stock: 0,
    image: bottleImage,
    badge: null,
    description:
      'A double-walled stainless steel bottle that keeps drinks cold for 24 hours or hot for 12. The leak-proof lid fits neatly into a backpack side pocket.',
    highlights: [
      'Keeps drinks cold for 24 hours',
      'Leak-proof twist lid',
      'BPA-free and dishwasher safe',
    ],
    deliveryEstimate: '1–2 working days',
    keywords: 'bottle steel insulated water flask lifestyle',
  },
  {
    id: 'focus-dot-grid-notebook',
    name: 'Focus A5 Dot-Grid Notebook',
    brand: 'Paperlane',
    category: 'Stationery',
    price: 650,
    rating: 4.4,
    reviewCount: 64,
    stock: 25,
    image: notebookImage,
    badge: null,
    description:
      'A 160-page A5 notebook with thick, fountain-pen-friendly paper and a lay-flat binding. The dot grid works for notes, diagrams, and quick product sketches.',
    highlights: [
      '160 pages of 100gsm paper',
      'Lay-flat stitched binding',
      'Elastic closure and ribbon marker',
    ],
    deliveryEstimate: '1–2 working days',
    keywords: 'notebook stationery paper dot grid study journal',
  },
  {
    id: 'volt-fast-charge-power-bank',
    name: 'Volt 10,000mAh Fast-Charge Power Bank',
    brand: 'ChargeUp',
    category: 'Tech Accessories',
    price: 2750,
    rating: 4.2,
    reviewCount: 201,
    stock: 7,
    image: powerBankImage,
    badge: null,
    description:
      'A slim 10,000mAh power bank with 20W USB-C output. It charges a phone quickly between classes and has enough capacity for a full day out.',
    highlights: [
      '20W USB-C fast charging',
      'Charges two devices at once',
      'Airline-friendly 10,000mAh capacity',
    ],
    deliveryEstimate: '1–2 working days',
    keywords: 'power bank charger battery portable usb c tech',
  },
  {
    id: 'orbit-smartwatch-s2',
    name: 'Orbit Smartwatch S2',
    brand: 'Orbit',
    category: 'Wearables',
    price: 9999,
    rating: 4.0,
    reviewCount: 57,
    stock: 3,
    image: smartwatchImage,
    badge: null,
    description:
      'A lightweight smartwatch with heart-rate tracking, sleep insights, and a seven-day battery. It pairs with both Android and iOS and shows notifications at a glance.',
    highlights: [
      'Seven-day typical battery life',
      'Heart-rate and sleep tracking',
      '5 ATM water resistance',
    ],
    deliveryEstimate: '1–2 working days',
    keywords: 'smartwatch wearable fitness watch heart rate',
  },
  {
    id: 'stride-everyday-sneakers',
    name: 'Stride Everyday Sneakers',
    brand: 'Roam',
    category: 'Footwear',
    price: 4499,
    rating: 4.5,
    reviewCount: 129,
    stock: 6,
    image: sneakersImage,
    badge: null,
    description:
      'Lightweight everyday sneakers with a cushioned midsole and a breathable knit upper. Built for long walks across campus and the city.',
    highlights: [
      'Breathable knit upper',
      'Cushioned, flexible midsole',
      'Removable memory-foam insole',
    ],
    deliveryEstimate: '2–3 working days',
    keywords: 'sneakers shoes footwear running walking campus',
  },
  {
    id: 'brewmate-coffee-kit',
    name: 'BrewMate Coffee Brewing Kit',
    brand: 'Slowday',
    category: 'Home',
    price: 2100,
    rating: 4.8,
    reviewCount: 41,
    stock: 9,
    image: coffeeImage,
    badge: 'Small batch',
    description:
      'A beginner-friendly brewing kit with a ceramic dripper, 50 paper filters, a measuring scoop, and a bag of locally roasted beans. A slow morning in a box.',
    highlights: [
      'Ceramic pour-over dripper and filters',
      'Locally roasted 250g coffee beans',
      'Brew guide for a consistent cup',
    ],
    deliveryEstimate: '2–3 working days',
    keywords: 'coffee brewing kit pour over home slowday',
  },
  {
    id: 'arc-gan-travel-charger',
    name: 'Arc 65W GaN Travel Charger',
    brand: 'ChargeUp',
    category: 'Tech Accessories',
    price: 3200,
    rating: 4.3,
    reviewCount: 112,
    stock: 2,
    image: chargerImage,
    badge: 'Low stock',
    description:
      'A compact 65W GaN charger with two USB-C ports and one USB-A port. One plug can charge a laptop, phone, and earbuds at the same time.',
    highlights: [
      '65W total output with power sharing',
      'Two USB-C ports and one USB-A port',
      'Foldable pins for travel',
    ],
    deliveryEstimate: '1–2 working days',
    keywords: 'charger gan usb c travel adapter laptop phone tech',
  },
]

export const CATEGORIES = [...new Set(PRODUCTS.map((product) => product.category))].sort()

export function getProductById(products, id) {
  return products.find((product) => product.id === id) ?? null
}

export const FEATURED_PRODUCT_ID = 'aurora-anc-headphones'
