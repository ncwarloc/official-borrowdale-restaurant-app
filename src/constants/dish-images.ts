import type { ImageSourcePropType } from 'react-native';

import type { MenuCategory, MenuItem } from '@/constants/menu-data';

/** Real Zone Garden menu photography, ported from design-reference/ZoneGardensApp.jsx. */
export const DISH_IMAGES: Record<string, ImageSourcePropType> = {
  m1: require('@/assets/images/dishes/menu-photo-1.jpg'),
  m2: require('@/assets/images/dishes/menu-photo-2.jpg'),
  m3: require('@/assets/images/dishes/menu-photo-3.jpg'),
  m4: require('@/assets/images/dishes/menu-photo-4.jpg'),
  m5: require('@/assets/images/dishes/menu3-photo-1.jpg'),
  m6: require('@/assets/images/dishes/menu3-photo-2.jpg'),
  m7: require('@/assets/images/dishes/photo-img-003.jpg'),
  m8: require('@/assets/images/dishes/menu3-photo-3.jpg'),
  m9: require('@/assets/images/dishes/menu4-photo-1.jpg'),
  m10: require('@/assets/images/dishes/menu3-photo-5.jpg'),
  m11: require('@/assets/images/dishes/menu3-photo-6.jpg'),
  m12: require('@/assets/images/dishes/menu4-photo-2.jpg'),
  m13: require('@/assets/images/dishes/menu3-photo-7.jpg'),
  m14: require('@/assets/images/dishes/menu3-photo-8.jpg'),
  m15: require('@/assets/images/dishes/menu3-photo-9.jpg'),
  m16: require('@/assets/images/dishes/menu3-photo-10.jpg'),
  m17: require('@/assets/images/dishes/menu4-photo-3.jpg'),
  m18: require('@/assets/images/dishes/photo-img-002.jpg'),
  m19: require('@/assets/images/dishes/menu4-photo-4.jpg'),
  m20: require('@/assets/images/dishes/menu4-photo-5.jpg'),
  m21: require('@/assets/images/dishes/menu5-photo-1.jpg'),
  m22: require('@/assets/images/dishes/menu4-photo-6.jpg'),
  m23: require('@/assets/images/dishes/menu5-photo-2.jpg'),
  m24: require('@/assets/images/dishes/menu4-photo-7.jpg'),
  m25: require('@/assets/images/dishes/menu4-photo-8.jpg'),

  t1: require('@/assets/images/dishes/trad1-photo-1.jpg'),
  t2: require('@/assets/images/dishes/trad2-photo-1.jpg'),
  t3: require('@/assets/images/dishes/trad1-photo-2.jpg'),
  t4: require('@/assets/images/dishes/trad1-photo-3.jpg'),
  t5: require('@/assets/images/dishes/trad1-photo-4.jpg'),
  t6: require('@/assets/images/dishes/photo-img-015.jpg'),
  t7: require('@/assets/images/dishes/trad1-photo-5.jpg'),
  t8: require('@/assets/images/dishes/trad1-photo-6.jpg'),

  ps1: require('@/assets/images/dishes/stach1-photo-1.jpg'),
  ps2: require('@/assets/images/dishes/stach1-photo-2.jpg'),
  ps3: require('@/assets/images/dishes/stach1-photo-3.jpg'),
  ps4: require('@/assets/images/dishes/stach1-photo-4.jpg'),
  ps5: require('@/assets/images/dishes/stach1-photo-5.jpg'),
  ps6: require('@/assets/images/dishes/photo-img-014.jpg'),
  ps7: require('@/assets/images/dishes/photo-img-013.jpg'),

  sd1: require('@/assets/images/dishes/sides1-photo-1.jpg'),
  sd2: require('@/assets/images/dishes/sides1-photo-2.jpg'),
  sd3: require('@/assets/images/dishes/sides1-photo-3.jpg'),
  sd4: require('@/assets/images/dishes/sides1-photo-4.jpg'),

  pl1: require('@/assets/images/dishes/photo-img-025.jpg'),
  pl2: require('@/assets/images/dishes/photo-img-025.jpg'),
  pl3: require('@/assets/images/dishes/photo-img-025.jpg'),
  pl4: require('@/assets/images/dishes/photo-img-025.jpg'),

  sa1: require('@/assets/images/dishes/photo-img-027.jpg'),
  sa2: require('@/assets/images/dishes/photo-img-027.jpg'),
  sa3: require('@/assets/images/dishes/photo-img-027.jpg'),
  sa4: require('@/assets/images/dishes/photo-img-026.jpg'),

  v1: require('@/assets/images/dishes/veg1-photo-1.jpg'),
  v2: require('@/assets/images/dishes/veg1-photo-2.jpg'),
  v3: require('@/assets/images/dishes/photo-img-028.jpg'),

  de1: require('@/assets/images/dishes/photo-img-036.jpg'),
  de2: require('@/assets/images/dishes/des1-photo-1.jpg'),

  hd1: require('@/assets/images/dishes/hot1-photo-1.jpg'),
  hd2: require('@/assets/images/dishes/hot1-photo-2.jpg'),
  hd3: require('@/assets/images/dishes/hot1-photo-3.jpg'),
  hd4: require('@/assets/images/dishes/hot1-photo-4.jpg'),

  cd1: require('@/assets/images/dishes/cold1-photo-1.jpg'),
  cd2: require('@/assets/images/dishes/cold1-photo-2.jpg'),
  cd3: require('@/assets/images/dishes/cold1-photo-3.jpg'),
  cd4: require('@/assets/images/dishes/cold1-photo-4.jpg'),
  cd5: require('@/assets/images/dishes/cold1-photo-5.jpg'),
  cd6: require('@/assets/images/dishes/photo-img-039.jpg'),
};

export const CATEGORY_IMAGES: Record<string, ImageSourcePropType> = {
  experience: require('@/assets/images/dishes/rexp-photo-1.jpg'),
  kidcamp: require('@/assets/images/dishes/kidcamp1-photo-3.jpg'),
  main: require('@/assets/images/dishes/photo-img-001.jpg'),
  traditional: require('@/assets/images/dishes/photo-img-012.jpg'),
  stach: require('@/assets/images/dishes/photo-img-014.jpg'),
  sides: require('@/assets/images/dishes/photo-img-015.jpg'),
  platter: require('@/assets/images/dishes/photo-img-025.jpg'),
  salads: require('@/assets/images/dishes/photo-img-026.jpg'),
  vegetables: require('@/assets/images/dishes/photo-img-028.jpg'),
  dessert: require('@/assets/images/dishes/photo-img-036.jpg'),
  hotdrinks: require('@/assets/images/dishes/photo-img-037.jpg'),
  colddrinks: require('@/assets/images/dishes/photo-img-039.jpg'),
};

export function dishImg(item: MenuItem): ImageSourcePropType {
  return DISH_IMAGES[item.id];
}

export function catImg(category: MenuCategory): ImageSourcePropType {
  return CATEGORY_IMAGES[category.id];
}
