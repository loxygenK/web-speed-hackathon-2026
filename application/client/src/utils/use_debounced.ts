import { useCallback, useEffect, useRef } from "react";

export function useDebounce(fn: () => void, ms: number) {
  const debounced = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if(debounced.current) {
        clearTimeout(debounced.current);
      }
    }
  });

  return useCallback(() => {
    if(debounced.current !== null) {
      return;
    }

    debounced.current = setTimeout(() => {
      debounced.current = null;
    }, ms);
    fn();
  }, [fn]);
}

