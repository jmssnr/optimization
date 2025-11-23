import { Var } from "@/core/variable";
import { useEffect, useState } from "react";

export const useOptimization = <T>(
  initialState: T,
  callback: (previousState: T, frameId: number) => T,
  isPaused: boolean = false
): { state: T; frameTime: number; reset: (newInitial?: T) => void } => {
  const [state, setState] = useState<T>(initialState);
  const [isReset, setIsReset] = useState(false);
  const [frameTime, setFrameTime] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    let frameId: number;
    const frame = (time: number) => {
      frameId = requestAnimationFrame(frame);
      setState((prev) => callback(prev, frameId));
    };

    frameId = requestAnimationFrame(frame);

    if (isReset) {
      setIsReset(false);
    }
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isPaused, isReset]);

  const reset = (newInitial?: T) => {
    setIsReset(true);
    setState(() => newInitial ?? initialState);
  };

  return { state, frameTime, reset };
};
