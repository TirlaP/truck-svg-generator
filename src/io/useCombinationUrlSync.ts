import { useEffect, useRef } from 'react';
import type { Combination } from '../types';
import {
  readCombinationFromLocation,
  writeCombinationToLocation,
} from './exporters';

/** Reads #c=... on mount, writes #c=... on every change (debounced). */
export function useCombinationUrlSync(
  combination: Combination,
  onInitialLoad?: (c: Combination) => void,
): void {
  const didInit = useRef(false);

  // On mount: read an existing combination from the URL and report it back.
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const found = readCombinationFromLocation();
    if (found && onInitialLoad) {
      onInitialLoad(found);
    }
    // Only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On every change: debounce writing to the hash.
  useEffect(() => {
    if (!didInit.current) return;
    const handle = window.setTimeout(() => {
      writeCombinationToLocation(combination);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [combination]);
}

export default useCombinationUrlSync;
