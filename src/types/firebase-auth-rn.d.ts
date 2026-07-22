import type { Persistence } from '@firebase/auth';

/**
 * `@firebase/auth`'s package.json declares a top-level "types" condition
 * (pointing at the generic/browser bundle) ahead of its "react-native"
 * condition in export-map key order, so TypeScript always resolves types
 * from the browser build regardless of Metro's platform resolution —
 * `getReactNativePersistence` genuinely exists at runtime (bundled via the
 * "react-native" condition on native, see src/lib/firebase.ts) but is
 * invisible to tsc. This augmentation just restores that one signature.
 */
declare module '@firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
