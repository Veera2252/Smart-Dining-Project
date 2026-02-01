import { MenuItem, DietaryTag } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Truffle Mushroom Risotto',
    description: 'Creamy arborio rice with wild mushrooms, truffle oil, and parmesan crisp.',
    price: 24,
    category: 'Mains',
    tags: [DietaryTag.GF, DietaryTag.VEGAN],
    image: 'https://picsum.photos/seed/risotto/400/300',
    calories: 650
  },
  {
    id: '2',
    name: 'Spicy Thai Basil Chicken',
    description: 'Minced chicken stir-fried with holy basil, chili, and garlic served with jasmine rice.',
    price: 18,
    category: 'Mains',
    tags: [DietaryTag.SPICY, DietaryTag.DF],
    image: 'https://picsum.photos/seed/thai/400/300',
    calories: 520
  },
  {
    id: '3',
    name: 'Grilled Salmon Bowl',
    description: 'Atlantic salmon with quinoa, roasted chickpeas, kale, and lemon tahini dressing.',
    price: 22,
    category: 'Mains',
    tags: [DietaryTag.GF, DietaryTag.DF],
    image: 'https://picsum.photos/seed/salmon/400/300',
    calories: 580
  },
  {
    id: '4',
    name: 'Crispy Calamari',
    description: 'Fried squid rings served with spicy marinara and lemon wedges.',
    price: 14,
    category: 'Appetizers',
    tags: [DietaryTag.DF],
    image: 'https://picsum.photos/seed/calamari/400/300',
    calories: 410
  },
  {
    id: '5',
    name: 'Caprese Salad',
    description: 'Fresh mozzarella, vine-ripened tomatoes, and basil drizzled with balsamic glaze.',
    price: 12,
    category: 'Appetizers',
    tags: [DietaryTag.GF, DietaryTag.VEGAN],
    image: 'https://picsum.photos/seed/salad/400/300',
    calories: 320
  },
  {
    id: '6',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla bean ice cream.',
    price: 10,
    category: 'Desserts',
    tags: [],
    image: 'https://picsum.photos/seed/cake/400/300',
    calories: 750
  }
];

export const CATEGORIES = ['All', 'Appetizers', 'Mains', 'Desserts'];