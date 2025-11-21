import { useEffect, useState } from "react";

export const useAnimation = <T>(
  initialState: T,
  callback: (previousState: T, initialState?: T) => T,
  isPaused: boolean = false
): { state: T; frameTime: number; iteration: number; reset: () => void } => {
  const [state, setState] = useState<T>(initialState);
  const [iteration, setIteration] = useState(0);
  const [frameTime, setFrameTime] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    let frameId: number;
    const frame = (time: number) => {
      setState(callback);
      setFrameTime(time);
      setIteration((prev) => prev + 1);
      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isPaused]);

  const reset = () => {
    setState(() => initialState);
    setIteration(() => 0);
  };

  return { state, frameTime, iteration, reset };
};
