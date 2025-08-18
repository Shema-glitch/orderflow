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
          items: ['Whole Milk', 'Skim Milk', 'Oat Milk', 'Almond Milk', 'Soy Milk'] 
        },
        { 
          id: 'protein', 
          name: 'Protein Powder', 
          items: ['Whey', 'Casein', 'Soy', 'Pea', 'Hemp'] 
        },
        { 
          id: 'fruits', 
          name: 'Fruits', 
          items: ['Banana', 'Strawberry', 'Blueberry', 'Mango', 'Pineapple'] 
        },
        { 
          id: 'boosts', 
          name: 'Boosts', 
          items: ['Spinach', 'Kale', 'Chia Seeds', 'Flax Seeds', 'Peanut Butter'] 
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
