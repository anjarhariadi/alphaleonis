import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    // Safari <14 fallback
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      (
        mql as unknown as { addListener: (cb: typeof onChange) => void }
      ).addListener(onChange);
    }
    setIsMobile(mql.matches);
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        (
          mql as unknown as { removeListener: (cb: typeof onChange) => void }
        ).removeListener(onChange);
      }
    };
  }, []);

  return isMobile;
}
