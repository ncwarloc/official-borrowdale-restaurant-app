import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon
          src={require('@/assets/images/tabIcons/home.png')}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="menu">
        <Label>Menu</Label>
        <Icon
          sf="fork.knife"
          androidSrc={require('@/assets/images/tabIcons/explore.png')}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="cart">
        <Label>Cart</Label>
        <Icon
          sf="cart"
          androidSrc={require('@/assets/images/tabIcons/home.png')}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="orders">
        <Label>Orders</Label>
        <Icon
          sf="list.bullet"
          androidSrc={require('@/assets/images/tabIcons/explore.png')}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon
          sf="person"
          androidSrc={require('@/assets/images/tabIcons/home.png')}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
