import {
  Baby,
  Beef,
  Cake,
  ChefHat,
  Coffee,
  GlassWater,
  Leaf,
  Salad,
  Soup,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react-native';
import type { ComponentType } from 'react';

export type MenuIconProps = { size?: number; color?: string };

export type MenuCategory = {
  id: string;
  name: string;
  icon: ComponentType<MenuIconProps>;
  q: string;
};

export type MenuItemAddon = { n: string; p: number };

export type MenuItem = {
  id: string;
  cat: string;
  name: string;
  price: number;
  q: string;
  desc: string;
  ingredients: string[];
  prep: string;
  cal: number;
  spice: number;
  addons: MenuItemAddon[];
  pairings: string[];
};

export const CATEGORIES: MenuCategory[] = [
  { id: 'experience', name: 'Restaurant Experience', icon: Sparkles, q: 'garden restaurant borrowdale interior' },
  { id: 'main', name: 'Main Dishes', icon: UtensilsCrossed, q: 'grilled meat plate zimbabwe' },
  { id: 'traditional', name: 'Traditional', icon: ChefHat, q: 'traditional zimbabwean food' },
  { id: 'stach', name: 'Plain Stach', icon: Soup, q: 'sadza rice plate' },
  { id: 'sides', name: 'Side Dishes', icon: Leaf, q: 'traditional leafy greens side' },
  { id: 'platter', name: 'Platter', icon: Beef, q: 'sharing meat platter' },
  { id: 'salads', name: 'Salads', icon: Salad, q: 'fresh garden salad' },
  { id: 'vegetables', name: 'Vegetables', icon: Leaf, q: 'roasted vegetables side' },
  { id: 'dessert', name: 'Dessert', icon: Cake, q: 'dessert plate' },
  { id: 'hotdrinks', name: 'Hot Drinks', icon: Coffee, q: 'coffee cup' },
  { id: 'colddrinks', name: 'Cold Drinks', icon: GlassWater, q: 'fresh juice glass' },
  { id: 'kidcamp', name: 'KidCamp', icon: Baby, q: 'kids party balloons' },
];

export const ITEMS: MenuItem[] = [
  // Main Dishes
  { id: 'm1', cat: 'main', name: 'Egg Fried Rice', price: 4, q: 'egg fried rice', desc: 'Wok-tossed rice with egg, scallions and a touch of soy.', ingredients: ['Rice', 'Egg', 'Scallions'], prep: '10 min', cal: 380, spice: 0, addons: [], pairings: [] },
  { id: 'm2', cat: 'main', name: 'Beef Curry & Chips', price: 13, q: 'beef curry chips', desc: 'Slow-simmered beef in a warming curry sauce, served with golden chips.', ingredients: ['Beef', 'Curry spices', 'Chips'], prep: '25 min', cal: 780, spice: 2, addons: [], pairings: ['m22'] },
  { id: 'm3', cat: 'main', name: 'Chicken Curry & Fries', price: 8, q: 'chicken curry fries', desc: 'Tender chicken in a fragrant curry sauce with crispy fries.', ingredients: ['Chicken', 'Curry spices', 'Fries'], prep: '22 min', cal: 650, spice: 2, addons: [], pairings: ['sa1'] },
  { id: 'm4', cat: 'main', name: 'BBQ Pork Ribs & Fries', price: 15, q: 'bbq pork ribs fries', desc: 'Fall-off-the-bone pork ribs glazed in smoky BBQ sauce, with fries.', ingredients: ['Pork ribs', 'BBQ glaze', 'Fries'], prep: '30 min', cal: 980, spice: 1, addons: [], pairings: ['v3'] },
  { id: 'm5', cat: 'main', name: 'Full Gango', price: 10, q: 'grilled chicken gizzards plate', desc: 'A full plate of gango, pan-fried until golden and lightly seasoned.', ingredients: ['Gango', 'Onion', 'Spice mix'], prep: '20 min', cal: 520, spice: 1, addons: [], pairings: [] },
  { id: 'm6', cat: 'main', name: 'Half Gango', price: 5, q: 'grilled chicken gizzards plate', desc: 'A half portion of our pan-fried gango.', ingredients: ['Gango', 'Onion', 'Spice mix'], prep: '18 min', cal: 300, spice: 1, addons: [], pairings: [] },
  { id: 'm7', cat: 'main', name: 'Pork Bones', price: 8, q: 'braised pork bones', desc: 'Slow-braised pork bones in a rich, savoury gravy.', ingredients: ['Pork bones', 'Gravy', 'Onion'], prep: '35 min', cal: 610, spice: 1, addons: [], pairings: [] },
  { id: 'm8', cat: 'main', name: 'Beef Bones', price: 7, q: 'braised beef bones', desc: 'Hearty beef bones simmered until tender in a deep gravy.', ingredients: ['Beef bones', 'Gravy', 'Garlic'], prep: '35 min', cal: 590, spice: 1, addons: [], pairings: [] },
  { id: 'm9', cat: 'main', name: 'Trotter', price: 7, q: 'pork trotters stew', desc: 'Slow-cooked trotters in a rich, sticky sauce.', ingredients: ['Trotters', 'Onion', 'Gravy'], prep: '40 min', cal: 640, spice: 1, addons: [], pairings: [] },
  { id: 'm10', cat: 'main', name: 'Oxtail', price: 10, q: 'oxtail stew', desc: 'Classic slow-braised oxtail in a deep, savoury sauce.', ingredients: ['Oxtail', 'Gravy', 'Vegetables'], prep: '45 min', cal: 720, spice: 1, addons: [], pairings: ['ps6'] },
  { id: 'm11', cat: 'main', name: 'Knuckle Bones', price: 7, q: 'braised beef knuckle', desc: 'Beef knuckle bones, braised low and slow until tender.', ingredients: ['Knuckle bones', 'Gravy', 'Onion'], prep: '40 min', cal: 600, spice: 1, addons: [], pairings: [] },
  { id: 'm12', cat: 'main', name: 'Goat Stew', price: 7, q: 'goat meat stew', desc: 'Traditional goat stew, simmered with onion and tomato.', ingredients: ['Goat meat', 'Tomato', 'Onion'], prep: '35 min', cal: 560, spice: 1, addons: [], pairings: ['ps4'] },
  { id: 'm13', cat: 'main', name: 'Zondo', price: 5, q: 'stewed beans plate', desc: "Zone Garden's own zondo, slow-cooked to order.", ingredients: ['Zondo', 'Onion', 'Spice'], prep: '20 min', cal: 380, spice: 1, addons: [], pairings: [] },
  { id: 'm14', cat: 'main', name: 'Full Fish', price: 10, q: 'fried whole fish', desc: 'A whole fish, fried until golden and crisp.', ingredients: ['Fish', 'Seasoning', 'Lemon'], prep: '20 min', cal: 520, spice: 1, addons: [], pairings: [] },
  { id: 'm15', cat: 'main', name: 'Half Fish', price: 7, q: 'fried whole fish', desc: 'A half portion of our golden fried fish.', ingredients: ['Fish', 'Seasoning', 'Lemon'], prep: '18 min', cal: 320, spice: 1, addons: [], pairings: [] },
  { id: 'm16', cat: 'main', name: 'Full Chicken', price: 18, q: 'grilled whole chicken', desc: 'A full chicken, flame-grilled and generously seasoned.', ingredients: ['Chicken', 'Spice rub'], prep: '30 min', cal: 1100, spice: 1, addons: [], pairings: ['v1'] },
  { id: 'm17', cat: 'main', name: 'Half Chicken & Fries', price: 13, q: 'grilled chicken fries', desc: 'Half a flame-grilled chicken with a side of fries.', ingredients: ['Chicken', 'Fries'], prep: '25 min', cal: 780, spice: 1, addons: [], pairings: [] },
  { id: 'm18', cat: 'main', name: '¼ Chicken & Fries', price: 8, q: 'grilled chicken fries', desc: 'A quarter chicken, flame-grilled, with fries.', ingredients: ['Chicken', 'Fries'], prep: '20 min', cal: 520, spice: 1, addons: [], pairings: [] },
  { id: 'm19', cat: 'main', name: 'Beef Stir Fry & Fries', price: 7, q: 'beef stir fry fries', desc: 'Quick-fried beef strips with peppers and onion, served with fries.', ingredients: ['Beef', 'Peppers', 'Onion', 'Fries'], prep: '18 min', cal: 610, spice: 1, addons: [], pairings: [] },
  { id: 'm20', cat: 'main', name: 'Pork Chop & Fries', price: 11, q: 'grilled pork chop fries', desc: 'A grilled pork chop served with a side of fries.', ingredients: ['Pork chop', 'Fries'], prep: '22 min', cal: 700, spice: 0, addons: [], pairings: [] },
  { id: 'm21', cat: 'main', name: 'Pork Chop', price: 8, q: 'grilled pork chop', desc: 'A grilled pork chop, served on its own.', ingredients: ['Pork chop'], prep: '20 min', cal: 480, spice: 0, addons: [], pairings: [] },
  { id: 'm22', cat: 'main', name: 'T-bone & Fries', price: 13, q: 't-bone steak fries', desc: 'A char-grilled T-bone steak with a side of fries.', ingredients: ['T-bone steak', 'Fries'], prep: '25 min', cal: 850, spice: 0, addons: [], pairings: ['m2'] },
  { id: 'm23', cat: 'main', name: 'T-bone', price: 10, q: 't-bone steak grilled', desc: 'A char-grilled T-bone steak, served on its own.', ingredients: ['T-bone steak'], prep: '22 min', cal: 620, spice: 0, addons: [], pairings: [] },
  { id: 'm24', cat: 'main', name: 'Plain Burger', price: 4, q: 'beef burger', desc: 'A classic beef burger patty in a soft bun.', ingredients: ['Beef patty', 'Bun'], prep: '12 min', cal: 420, spice: 0, addons: [], pairings: [] },
  { id: 'm25', cat: 'main', name: 'Burger & Fries', price: 7, q: 'beef burger fries', desc: 'Our classic beef burger served with a side of fries.', ingredients: ['Beef patty', 'Bun', 'Fries'], prep: '15 min', cal: 680, spice: 0, addons: [], pairings: [] },

  // Traditional
  { id: 't1', cat: 'traditional', name: 'Tsuro', price: 8, q: 'traditional stewed meat plate', desc: 'Tsuro, prepared the traditional way and slow-cooked to order.', ingredients: ['Tsuro', 'Onion', 'Traditional spice'], prep: '35 min', cal: 480, spice: 1, addons: [], pairings: ['ps4'] },
  { id: 't2', cat: 'traditional', name: 'Maguru & Matumbu', price: 7, q: 'tripe offal stew', desc: 'A hearty offal dish, simmered low and slow in a traditional style.', ingredients: ['Maguru', 'Matumbu', 'Onion'], prep: '40 min', cal: 560, spice: 1, addons: [], pairings: [] },
  { id: 't3', cat: 'traditional', name: 'Zvinyenze', price: 6, q: 'traditional zimbabwean stew', desc: 'A Zone Garden traditional specialty, prepared to order.', ingredients: ['Traditional ingredients'], prep: '30 min', cal: 450, spice: 1, addons: [], pairings: [] },
  { id: 't4', cat: 'traditional', name: 'Hanga', price: 7, q: 'guinea fowl stew', desc: 'Hanga, slow-cooked in a traditional sauce.', ingredients: ['Hanga', 'Onion', 'Traditional spice'], prep: '35 min', cal: 500, spice: 1, addons: [], pairings: [] },
  { id: 't5', cat: 'traditional', name: 'Road Runner', price: 8, q: 'free range chicken stew', desc: 'Free-range "road runner" chicken, slow-cooked the traditional way.', ingredients: ['Road runner chicken', 'Onion', 'Traditional spice'], prep: '40 min', cal: 540, spice: 1, addons: [], pairings: ['ps2'] },
  { id: 't6', cat: 'traditional', name: 'Madora', price: 6, q: 'mopane worms plate', desc: 'Madora, prepared traditional style.', ingredients: ['Madora', 'Onion', 'Tomato'], prep: '25 min', cal: 380, spice: 1, addons: [], pairings: [] },
  { id: 't7', cat: 'traditional', name: 'Matemba', price: 4, q: 'dried kapenta fish fried', desc: 'Matemba, fried to a crisp traditional finish.', ingredients: ['Matemba', 'Onion', 'Tomato'], prep: '20 min', cal: 340, spice: 1, addons: [], pairings: [] },
  { id: 't8', cat: 'traditional', name: 'Special Game Meat (Mhara, Njiri, Buffalo)', price: 8, q: 'game meat stew plate', desc: 'A rotating selection of game meat — mhara, njiri or buffalo — prepared traditional style.', ingredients: ['Game meat', 'Onion', 'Traditional spice'], prep: '40 min', cal: 560, spice: 1, addons: [], pairings: ['ps6'] },

  // Plain Stach
  { id: 'ps1', cat: 'stach', name: 'Fries', price: 4, q: 'french fries', desc: 'Golden, crispy fries.', ingredients: ['Potato'], prep: '10 min', cal: 380, spice: 0, addons: [], pairings: [] },
  { id: 'ps2', cat: 'stach', name: 'Zviyo', price: 3, q: 'finger millet sadza', desc: 'Zviyo (finger millet sadza), stone-ground and prepared fresh.', ingredients: ['Zviyo meal'], prep: '20 min', cal: 340, spice: 0, addons: [], pairings: [] },
  { id: 'ps3', cat: 'stach', name: 'Mapfunde', price: 2, q: 'sorghum sadza', desc: 'Mapfunde (sorghum sadza), a hearty traditional starch.', ingredients: ['Mapfunde meal'], prep: '20 min', cal: 320, spice: 0, addons: [], pairings: [] },
  { id: 'ps4', cat: 'stach', name: 'White Sadza', price: 1, q: 'white maize sadza', desc: 'Classic white maize sadza, stone-ground and freshly prepared.', ingredients: ['Maize meal'], prep: '15 min', cal: 280, spice: 0, addons: [], pairings: [] },
  { id: 'ps5', cat: 'stach', name: 'Mhunga', price: 3, q: 'pearl millet sadza', desc: 'Mhunga (pearl millet sadza), a nutritious traditional side.', ingredients: ['Mhunga meal'], prep: '20 min', cal: 330, spice: 0, addons: [], pairings: [] },
  { id: 'ps6', cat: 'stach', name: 'Rice & Dovi', price: 3, q: 'rice peanut butter sauce', desc: 'Steamed rice with a rich peanut butter (dovi) sauce.', ingredients: ['Rice', 'Dovi'], prep: '15 min', cal: 420, spice: 0, addons: [], pairings: [] },
  { id: 'ps7', cat: 'stach', name: 'Mashed Potato', price: 4, q: 'mashed potato bowl', desc: 'Creamy mashed potato.', ingredients: ['Potato', 'Butter', 'Milk'], prep: '15 min', cal: 360, spice: 0, addons: [], pairings: [] },

  // Side Dishes
  { id: 'sd1', cat: 'sides', name: 'Beans', price: 2, q: 'stewed beans', desc: 'Slow-cooked beans in a light sauce.', ingredients: ['Beans', 'Onion', 'Tomato'], prep: '20 min', cal: 220, spice: 0, addons: [], pairings: [] },
  { id: 'sd2', cat: 'sides', name: 'Nyevhe', price: 2, q: 'traditional leafy greens', desc: 'Nyevhe, a traditional leafy green side.', ingredients: ['Nyevhe', 'Onion'], prep: '15 min', cal: 90, spice: 0, addons: [], pairings: [] },
  { id: 'sd3', cat: 'sides', name: 'Munyemba', price: 2, q: 'cowpea leaves side dish', desc: 'Munyemba (cowpea leaves), a traditional leafy side.', ingredients: ['Munyemba', 'Onion'], prep: '15 min', cal: 90, spice: 0, addons: [], pairings: [] },
  { id: 'sd4', cat: 'sides', name: 'Mubora', price: 2, q: 'pumpkin leaves side dish', desc: 'Mubora (pumpkin leaves), a traditional leafy side with peanut butter.', ingredients: ['Mubora', 'Peanut butter'], prep: '15 min', cal: 110, spice: 0, addons: [], pairings: [] },

  // Platter
  { id: 'pl1', cat: 'platter', name: 'Platter For 2', price: 25, q: 'sharing meat platter', desc: 'A generous sharing platter of grilled meats, built for two.', ingredients: ['Mixed grill', 'Fries', 'Salad'], prep: '30 min', cal: 1800, spice: 1, addons: [], pairings: ['sa1'] },
  { id: 'pl2', cat: 'platter', name: 'Platter For 5', price: 30, q: 'sharing meat platter', desc: 'Our sharing platter, sized for a table of five.', ingredients: ['Mixed grill', 'Fries', 'Salad'], prep: '35 min', cal: 3200, spice: 1, addons: [], pairings: [] },
  { id: 'pl3', cat: 'platter', name: 'Platter For 7', price: 50, q: 'sharing meat platter', desc: 'A big sharing platter, built for a table of seven.', ingredients: ['Mixed grill', 'Fries', 'Salad'], prep: '40 min', cal: 4200, spice: 1, addons: [], pairings: [] },
  { id: 'pl4', cat: 'platter', name: 'Platter For 10', price: 100, q: 'sharing meat platter', desc: 'The full Zone Garden platter experience, built for a table of ten.', ingredients: ['Mixed grill', 'Fries', 'Salad'], prep: '45 min', cal: 6000, spice: 1, addons: [], pairings: [] },

  // Salads
  { id: 'sa1', cat: 'salads', name: 'Farm Salad', price: 5, q: 'fresh farm garden salad', desc: 'Fresh farm vegetables tossed in a light dressing.', ingredients: ['Mixed vegetables', 'Dressing'], prep: '10 min', cal: 180, spice: 0, addons: [], pairings: [] },
  { id: 'sa2', cat: 'salads', name: 'Pork Salad', price: 5, q: 'pork salad plate', desc: 'A hearty salad topped with pork.', ingredients: ['Pork', 'Mixed greens'], prep: '15 min', cal: 340, spice: 0, addons: [], pairings: [] },
  { id: 'sa3', cat: 'salads', name: 'French Salad', price: 2, q: 'french garden salad', desc: 'A simple, classic French-style salad.', ingredients: ['Mixed greens', 'Dressing'], prep: '8 min', cal: 140, spice: 0, addons: [], pairings: [] },
  { id: 'sa4', cat: 'salads', name: 'Cucumber & Avocado Salad', price: 2, q: 'cucumber avocado salad', desc: 'Fresh cucumber and avocado in a light dressing.', ingredients: ['Cucumber', 'Avocado'], prep: '8 min', cal: 160, spice: 0, addons: [], pairings: [] },

  // Vegetables
  { id: 'v1', cat: 'vegetables', name: 'Steamed Mixed Vegetables', price: 3, q: 'steamed mixed vegetables', desc: 'A light side of steamed seasonal vegetables.', ingredients: ['Mixed vegetables'], prep: '12 min', cal: 90, spice: 0, addons: [], pairings: [] },
  { id: 'v2', cat: 'vegetables', name: 'Glazed Butternut', price: 3, q: 'glazed roasted butternut squash', desc: 'Roasted butternut finished with a sweet glaze.', ingredients: ['Butternut', 'Glaze'], prep: '20 min', cal: 180, spice: 0, addons: [], pairings: [] },
  { id: 'v3', cat: 'vegetables', name: 'Roasted Brussel Sprouts', price: 5, q: 'roasted brussel sprouts', desc: 'Brussels sprouts roasted until crisp and caramelised.', ingredients: ['Brussels sprouts', 'Oil', 'Seasoning'], prep: '20 min', cal: 210, spice: 0, addons: [], pairings: [] },

  // Dessert
  { id: 'de1', cat: 'dessert', name: 'Ice Cream on Waffle', price: 4, q: 'ice cream waffle dessert', desc: 'A warm waffle topped with ice cream and a chocolate drizzle.', ingredients: ['Waffle', 'Ice cream', 'Chocolate'], prep: '10 min', cal: 480, spice: 0, addons: [], pairings: [] },
  { id: 'de2', cat: 'dessert', name: 'Fruit Salad', price: 4, q: 'fresh fruit salad bowl', desc: 'A refreshing bowl of fresh seasonal fruit.', ingredients: ['Mixed fruit'], prep: '8 min', cal: 160, spice: 0, addons: [], pairings: [] },

  // Hot Drinks
  { id: 'hd1', cat: 'hotdrinks', name: 'Cappuccino', price: 2, q: 'cappuccino coffee cup', desc: 'Espresso with steamed, frothed milk.', ingredients: ['Espresso', 'Milk'], prep: '5 min', cal: 90, spice: 0, addons: [], pairings: [] },
  { id: 'hd2', cat: 'hotdrinks', name: 'Hot Chocolate', price: 2, q: 'hot chocolate drink', desc: 'Rich, creamy hot chocolate.', ingredients: ['Cocoa', 'Milk'], prep: '5 min', cal: 210, spice: 0, addons: [], pairings: [] },
  { id: 'hd3', cat: 'hotdrinks', name: 'Coffee', price: 2, q: 'black coffee cup', desc: 'Freshly brewed coffee.', ingredients: ['Coffee'], prep: '5 min', cal: 5, spice: 0, addons: [], pairings: [] },
  { id: 'hd4', cat: 'hotdrinks', name: 'Tea', price: 2, q: 'tea cup', desc: 'A pot of freshly brewed tea.', ingredients: ['Tea leaves'], prep: '5 min', cal: 5, spice: 0, addons: [], pairings: [] },

  // Cold Drinks (price = medium; Large size available as an add-on)
  { id: 'cd1', cat: 'colddrinks', name: 'Apple Juice', price: 2, q: 'apple juice glass', desc: 'Fresh apple juice.', ingredients: ['Apple'], prep: '3 min', cal: 110, spice: 0, addons: [{ n: 'Large size', p: 1 }], pairings: [] },
  { id: 'cd2', cat: 'colddrinks', name: 'Orange Juice', price: 2, q: 'orange juice glass', desc: 'Fresh orange juice.', ingredients: ['Orange'], prep: '3 min', cal: 110, spice: 0, addons: [{ n: 'Large size', p: 1 }], pairings: [] },
  { id: 'cd3', cat: 'colddrinks', name: 'Apple and Pine', price: 2, q: 'apple pineapple juice', desc: 'Apple and pineapple juice blend.', ingredients: ['Apple', 'Pineapple'], prep: '3 min', cal: 120, spice: 0, addons: [{ n: 'Large size', p: 1 }], pairings: [] },
  { id: 'cd4', cat: 'colddrinks', name: 'Carrots and Pine', price: 2, q: 'carrot pineapple juice', desc: 'Carrot and pineapple juice blend.', ingredients: ['Carrot', 'Pineapple'], prep: '3 min', cal: 110, spice: 0, addons: [{ n: 'Large size', p: 1 }], pairings: [] },
  { id: 'cd5', cat: 'colddrinks', name: 'Watermelon Juice', price: 2, q: 'watermelon juice glass', desc: 'Fresh watermelon juice.', ingredients: ['Watermelon'], prep: '3 min', cal: 90, spice: 0, addons: [{ n: 'Large size', p: 1 }], pairings: [] },
  { id: 'cd6', cat: 'colddrinks', name: 'Mocktail', price: 4, q: 'colorful mocktail drink', desc: 'A colourful, refreshing house mocktail.', ingredients: ['Mixed fruit', 'Soda'], prep: '6 min', cal: 160, spice: 0, addons: [], pairings: [] },
];

/** Picked once per app launch (module evaluates a single time per session), mirroring the reference. */
export const CHEF_RECOMMENDATION: MenuItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];

/**
 * Curated Home-screen rows. These are not real menu categories (no item has
 * cat: "specials"/"popular"/"arrivals") — shared here so Home's "See all" can
 * route to `/category/<id>` and have the category screen recognize them as
 * virtual categories instead of a real cat lookup.
 */
export const SPECIALS_IDS = ['m3', 't2', 'sa1', 'pl2', 'ps6'];
export const POPULAR_IDS = ['m16', 'm4', 'm22', 'pl1'];
export const ARRIVALS_IDS = ['t1', 't5', 't8'];
