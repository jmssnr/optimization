import { nanoid } from "nanoid";
import { Iteration, ResultStatus, Run, Status } from "@/core/types";
import { useEffect, useState } from "react";

export const useOptimizationAlgorithm = (
  initial: Iteration,
  callback: (previousIteration: Iteration[], frameId: number) => Iteration[]
) => {
  const [shouldRestart, setShouldRestart] = useState(false);
  const [runs, setRuns] = useState<Run[]>([]);
  const [iterations, setIterations] = useState<Iteration[]>([initial]);

  useEffect(() => {
    let frameId: number;
    const frame = () => {
      frameId = requestAnimationFrame(frame);
      setIterations((prev) => callback(prev, frameId));
    };

    frameId = requestAnimationFrame(frame);

    if (shouldRestart) {
      setShouldRestart(false);
    }

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [shouldRestart]);

  const startNewRun = (newInitial: Iteration) => {
    const pastIteration = iterations.at(-1)!;
    const pastIterationStatus = pastIteration.status;

    const hasPastRunFinished = pastIterationStatus !== "pending";
    const isNotAlreadyIncluded = runs.every(
      (run) => JSON.stringify(run.iterations) !== JSON.stringify(iterations)
    );

    if (hasPastRunFinished && isNotAlreadyIncluded) {
      setRuns([
        ...runs,
        {
          id: nanoid(),
          iterations,
          result: pastIterationStatus as ResultStatus,
        },
      ]);
    }

    setShouldRestart(true);
    setIterations([newInitial]);
  };

  const removeRun = (id: string) => {
    setRuns(runs.filter((r) => r.id !== id));
  };

  const loadPreviousRun = (id: string) => {
    const previousRun = runs.find((run) => run.id === id);

    if (previousRun !== undefined) {
      setIterations(previousRun.iterations);
      setShouldRestart(false);
    }
  };

  return { startNewRun, removeRun, loadPreviousRun, runs, iterations };
};
