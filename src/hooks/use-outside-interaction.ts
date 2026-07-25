"use client";

import * as React from "react";

// Detects a pointerdown outside every element in `refs` while `active` is
// true, and calls `onOutside`. Uses pointerdown instead of mousedown: on
// touch devices mousedown is a synthesized compatibility event whose
// firing order relative to pointerdown/touchstart/click isn't guaranteed
// consistent across mobile browsers/WebViews — pointerdown unifies mouse,
// touch, and pen into one event that fires early and consistently (mirrors
// the pattern already used for option selection in ui/dropdown.tsx).
//
// The document listener is registered once for the component's lifetime
// (not re-subscribed every time `active` flips), so there's no listener
// attach/detach timing to reason about — refs/onOutside/active are read
// through internal refs updated every render instead.
export function useOutsideInteraction(
  refs: React.RefObject<HTMLElement | null>[],
  onOutside: () => void,
  active: boolean
): void {
  const refsRef = React.useRef(refs);
  refsRef.current = refs;
  const onOutsideRef = React.useRef(onOutside);
  onOutsideRef.current = onOutside;
  const activeRef = React.useRef(active);
  activeRef.current = active;

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!activeRef.current) return;
      const target = event.target as Node | null;
      if (!target) return;
      const isInside = refsRef.current.some(
        (ref) => ref.current != null && ref.current.contains(target)
      );
      if (!isInside) {
        onOutsideRef.current();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, []);
}
