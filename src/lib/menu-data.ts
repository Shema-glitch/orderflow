import type { Menu } from './types';

export const menu: Menu = {
  categories: [
    {
      id: 'protein-shake',
      name: 'Protein Shake',
      subcategories: [
        { 
          id: 'milk', 
          name: 'Milk Type', 
          items: ['Almond Milk', 'Soya Milk', 'Low Fat Milk', 'Full Fat Milk'] 
        },
        { 
          id: 'protein', 
          name: 'Protein Flavor', 
          items: ['Vanilla Ice Cream', 'Double-Rich Chocolate'] 
        },
        { 
          id: 'toppings', 
          name: 'Toppings', 
          items: ['Frozen Watermelon', 'Frozen Mango', 'Frozen Berries', 'Frozen Banana', 'Peanut Butter', 'Oats', 'Flax Seeds', 'Chia Seeds'] 
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
          items: ['Brown Bread', 'Wholewheat Bagel', 'Brown Focaccia'] 
        },
        { 
          id: 'protein', 
          name: 'Protein', 
          items: ['Roast Chicken', 'Roast Beef', 'Tofu', 'Egg', 'Tuna (+2K)', 'Smoked Salmon (+5K)']
        },
        {
          id: 'fat',
          name: 'Fat',
          items: ['Guacamole', 'Hummus', 'Goat Cheese', 'Feta Cheese', 'Cream Cheese']
        },
        {
          id: 'fiber',
          name: 'Fiber',
          items: ['Grilled Veggies', 'Lettuce & Tomato', 'Wilted Spinach', 'Grilled Mushrooms', 'Roast Beetroot']
        },
        { 
          id: 'sauce', 
          name: 'Sauce', 
          items: ['Basil & Pecorino Pesto', 'Chimichuri', 'Lemon Tahini', 'Fresh Tomato & Herbs Spread', 'Cilantro Yogonnaise'] 
        },
      ],
    },
  ],
};
