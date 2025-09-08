import type { Menu } from './types';

export const menu: Menu = {
  categories: [
    {
      id: 'protein-shake',
      name: 'Protein Shake',
      subcategories: [
        {
          id: 'base',
          name: 'Base',
          items: ['Full Fat', 'Skimmed', 'Dairy Free Option'],
        },
        {
          id: 'flavour',
          name: 'Flavour',
          items: ['Vanilla Ice Cream', 'Double Rich Chocolate'],
        },
        {
          id: 'toppings',
          name: 'Add any 2 Toppings',
          items: [
            'Frozen Banana',
            'Frozen Berries',
            'Frozen Mango',
            'Frozen Watermelon',
            'Peanut Butter',
            'Chia Seeds',
            'Flax Seeds',
            'Oats',
          ],
        },
      ],
    },
    {
      id: 'coffee',
      name: 'Coffee',
      subcategories: [
        {
          id: 'type',
          name: 'Type',
          items: [
            'Espresso',
            'Americano',
            'Cappuccino',
            'Latte',
            'Mocha',
            'Macchiato/Caramel',
          ],
        },
      ],
    },
    {
      id: 'tea',
      name: 'Tea',
      subcategories: [
        {
          id: 'type',
          name: 'Type',
          items: [
            'Black',
            'Green',
            'Mint',
            'Ginger Lemon',
            'African',
            'Hibiscus',
          ],
        },
      ],
    },
     {
      id: 'fresh-drinks',
      name: 'Fresh Drinks',
      subcategories: [
        {
          id: 'type',
          name: 'Type',
          items: [
            'Watermelon',
            'Juice of the Day',
          ],
        },
      ],
    },
     {
      id: 'sodas',
      name: 'House-Made Sodas',
      subcategories: [
        {
          id: 'type',
          name: 'Type',
          items: [
            'Lemonade',
            'Gingerale',
            'Pineade',
          ],
        },
      ],
    },
    {
      id: 'sandwich',
      name: 'Build Your Own Sandwich',
      subcategories: [
        {
          id: 'carb',
          name: 'Carb',
          items: ['Brown Bread', 'Wholewheat Bagel', 'Brown Focaccia'],
        },
        {
          id: 'protein',
          name: 'Protein',
          items: [
            'Roast Chicken',
            'Roast Beef',
            'Tofu',
            'Egg',
            'Tuna (+2K)',
            'Smoked Salmon (+5K)',
          ],
        },
        {
          id: 'fat',
          name: 'Fat',
          items: [
            'Guacamole',
            'Hummus',
            'Goat Cheese',
            'Feta Cheese',
            'Cream Cheese',
          ],
        },
        {
          id: 'fiber',
          name: 'Fiber',
          items: [
            'Grilled Veggies',
            'Lettuce & Tomato',
            'Wilted Spinach',
            'Grilled Mushrooms',
            'Roast Beetroot',
          ],
        },
        {
          id: 'sauce',
          name: 'Sauce',
          items: [
            'Basil & Pecorino Pesto',
            'Chimichuri',
            'Lemon Tahini',
            'Fresh Tomato & Herbs Spread',
            'Cilantro Yogonnaise',
          ],
        },
      ],
    },
  ],
};
