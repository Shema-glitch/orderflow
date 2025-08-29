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
          id: 'bread', 
          name: 'Bread Type', 
          items: ['White', 'Wheat', 'Sourdough', 'Rye', 'Ciabatta'] 
        },
        { 
          id: 'fillings', 
          name: 'Protein Fillings', 
          items: ['Turkey', 'Ham', 'Roast Beef', 'Grilled Chicken', 'Tuna Salad'] 
        },
        { 
          id: 'cheese', 
          name: 'Cheese', 
          items: ['Cheddar', 'Swiss', 'Provolone', 'American', 'Pepper Jack'] 
        },
        { 
          id: 'veggies', 
          name: 'Veggies', 
          items: ['Lettuce', 'Tomato', 'Onion', 'Pickles', 'Cucumbers', 'Bell Peppers'] 
        },
        { 
          id: 'sauces', 
          name: 'Sauces', 
          items: ['Mayonnaise', 'Mustard', 'Ranch', 'BBQ Sauce', 'Vinaigrette'] 
        },
      ],
    },
  ],
};
