import { gradientDescent } from "@/core/gradient-descent";
import { rosenbrock } from "@/core/test-functions/rosenbrock";
import { gradient } from "@/core/utils";
import { Var } from "@/core/variable";
import { useOptimization } from "@/hooks/useOptimization";

export const useMinimizeRosenbrock = (pause?: boolean) => {
  const grad = gradient(rosenbrock);
  const initial = [
    {
      iter: 0,
      x: [new Var(-4), new Var(-4)],
      fun: rosenbrock([new Var(-4), new Var(-4)]),
      gradNorm: Math.hypot(...grad([new Var(-4), new Var(-4)])),
      status: "iterating",
    },
  ];

  const { state, reset, frameTime } = useOptimization(
    initial,
    (x, frameId) => {
      const previousStep = x.at(-1)!;

      const nextIter = previousStep.iter + 1;
      const xNext = gradientDescent(rosenbrock, grad, previousStep.x);
      const funNext = rosenbrock(xNext);

      const gradNext = Math.hypot(...grad(xNext));

      if (nextIter > 1000) {
        cancelAnimationFrame(frameId);
        return [
          ...x,
          {
            iter: nextIter,
            x: xNext,
            fun: funNext,
            gradNorm: gradNext,
            status: "max",
          },
        ];
      }

      if (Math.abs(previousStep.fun.value - funNext.value) < 1e-6) {
        cancelAnimationFrame(frameId);
        return [
          ...x,
          {
            iter: nextIter,
            x: xNext,
            fun: funNext,
            gradNorm: gradNext,
            status: "success",
          },
        ];
      }

      return [
        ...x,
        {
          iter: nextIter,
          x: xNext,
          fun: funNext,
          gradNorm: gradNext,
          status: "iterating",
        },
      ];
    },
    pause
  );

  return {
    state: state.map((s) => ({
      ...s,
      fun: s.fun.value,
      x: s.x.map((xi) => xi.value),
    })),
    reset,
    frameTime,
  };
};
