import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { F_LABEL, useZoneGardenTheme } from '@/constants/theme';

export type SplashProps = {
  onDone?: () => void;
};

const GRID = 3;
const LOGO_SIZE = 220;
const SHARD_EASE = Easing.bezier(0.16, 1, 0.3, 1);
const SHARD_DURATION = 1050;
const SHARD_DELAY_STEP = 35;

type ShardSpec = {
  key: string;
  left: number;
  top: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  rot: number;
  delay: number;
};

// Cell edges snap the last row/column to LOGO_SIZE exactly, so rounding
// never leaves a hairline gap along the bottom/right of the assembled logo.
function cellEdge(index: number): number {
  return index === GRID ? LOGO_SIZE : Math.round((index * LOGO_SIZE) / GRID);
}

function buildShards(): ShardSpec[] {
  const shards: ShardSpec[] = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const cx = col - 1;
      const cy = row - 1;
      const mag = 130 + ((row + col) % 3) * 22;
      const dx = cx === 0 ? (col === 1 && row !== 1 ? 0 : 14) : cx * mag;
      const dy = cy === 0 ? 0 : cy * mag;
      const rot = ((row * 3 + col) % 2 === 0 ? -1 : 1) * (18 + ((row + col) * 7) % 26);
      const left = cellEdge(col);
      const top = cellEdge(row);
      shards.push({
        key: `${row}-${col}`,
        left,
        top,
        width: cellEdge(col + 1) - left,
        height: cellEdge(row + 1) - top,
        dx,
        dy,
        rot,
        delay: ((row * 3 + col) % 9) * SHARD_DELAY_STEP,
      });
    }
  }
  return shards;
}

const SHARDS = buildShards();

function Shard({ shard, exploded }: { shard: ShardSpec; exploded: boolean }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (exploded) {
      progress.value = withDelay(
        shard.delay,
        withTiming(1, { duration: SHARD_DURATION, easing: SHARD_EASE }),
      );
    }
  }, [exploded, progress, shard.delay]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateX: (1 - progress.value) * shard.dx },
      { translateY: (1 - progress.value) * shard.dy },
      { rotate: `${(1 - progress.value) * shard.rot}deg` },
      { scale: 0.7 + progress.value * 0.3 },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.cell,
        { left: shard.left, top: shard.top, width: shard.width, height: shard.height },
        style,
      ]}>
      <Image
        source={require('@/assets/images/logo.png')}
        resizeMode="cover"
        style={{
          position: 'absolute',
          width: LOGO_SIZE,
          height: LOGO_SIZE,
          left: -shard.left,
          top: -shard.top,
        }}
      />
    </Animated.View>
  );
}

export function Splash({ onDone }: SplashProps) {
  const theme = useZoneGardenTheme();
  const [stage, setStage] = useState(0);
  const glow = useSharedValue(0);
  const fade = useSharedValue(1);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 1600),
      setTimeout(() => setStage(3), 2300),
      setTimeout(() => onDone?.(), 3300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  useEffect(() => {
    if (stage >= 2) {
      glow.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.ease) });
    }
    if (stage === 3) {
      fade.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) });
    }
  }, [stage, glow, fade]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  const innerGlowStyle = useAnimatedStyle(() => ({ opacity: glow.value * 0.4 }));
  const outerGlowStyle = useAnimatedStyle(() => ({ opacity: glow.value * 0.2 }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  return (
    <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="none">
      <LinearGradient
        colors={theme.bgGradientColors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <View style={styles.logoBox}>
          <Animated.View
            style={[styles.glowBlobOuter, { backgroundColor: theme.ember }, outerGlowStyle]}
          />
          <Animated.View
            style={[styles.glowBlobInner, { backgroundColor: theme.gold }, innerGlowStyle]}
          />
          {SHARDS.map((shard) => (
            <Shard key={shard.key} shard={shard} exploded={stage >= 1} />
          ))}
        </View>
        <Animated.Text
          style={[
            F_LABEL,
            styles.subtitle,
            { color: theme.isDark ? '#8FD9A3' : theme.goldDeep },
            subtitleStyle,
          ]}>
          Garden-to-Table Dining
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  content: {
    width: 320,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  glowBlobInner: {
    position: 'absolute',
    top: LOGO_SIZE / 2 - (LOGO_SIZE * 1.3) / 2,
    left: LOGO_SIZE / 2 - (LOGO_SIZE * 1.3) / 2,
    width: LOGO_SIZE * 1.3,
    height: LOGO_SIZE * 1.3,
    borderRadius: (LOGO_SIZE * 1.3) / 2,
  },
  glowBlobOuter: {
    position: 'absolute',
    top: LOGO_SIZE / 2 - (LOGO_SIZE * 1.7) / 2,
    left: LOGO_SIZE / 2 - (LOGO_SIZE * 1.7) / 2,
    width: LOGO_SIZE * 1.7,
    height: LOGO_SIZE * 1.7,
    borderRadius: (LOGO_SIZE * 1.7) / 2,
  },
  cell: {
    position: 'absolute',
    overflow: 'hidden',
  },
  subtitle: {
    marginTop: 20,
    fontSize: 11,
  },
});
