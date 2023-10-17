import { useCallback, useMemo, useState } from "react";

export function useStack() {
  const [arr, setArr] = useState<any[]>([]);

  const stack = useMemo(() => [...arr], [arr]);

  const push = useCallback(
    (item: any) => {
      setArr([...arr, item]);
    },
    [arr]
  );

  const pop = useCallback(() => {
    const item = arr.pop();
    setArr((arr) => [arr]);
    return item;
  }, [arr]);

  return { push, pop, stack };
}
