import { gradientDescent } from "@/core/gradient-descent";
import { rosenbrock } from "@/core/test-functions/rosenbrock";
import { gradient, normalize } from "@/core/utils";
import { Var } from "@/core/variable";
import { useOptimizationAlgorithm } from "@/hooks/useOptimizationAlgorithm";

export const useGradientDescent = () => {
  const x0 = [new Var(-4), new Var(-4)];
  const grad = gradient(rosenbrock);
  const initial = {
    step: 0,
    x: x0,
    objective: rosenbrock(x0).value,
    gradienNorm: Math.hypot(...grad(x0)),
    status: "pending",
    searchDirection: normalize(grad(x0).map((v) => -1 * v)),
  } as const;

  return useOptimizationAlgorithm(
    initial,
    (previousIterationArray, frameId) => {
      const previousStep = previousIterationArray.at(-1)!;

      const direction = normalize(grad(previousStep.x).map((v) => -1 * v));
      const nextIter = previousStep.step + 1;
      const xNext = gradientDescent(rosenbrock, grad, previousStep.x);
      const funNext = rosenbrock(xNext);
      const gradNext = Math.hypot(...grad(xNext));

      if (nextIter > 499) {
        cancelAnimationFrame(frameId);
        return [
          ...previousIterationArray,
          {
            step: nextIter,
            x: xNext,
            objective: funNext.value,
            gradienNorm: gradNext,
            status: "failed",
            searchDirection: direction,
          },
        ];
      }

      if (Math.abs(previousStep.objective - funNext.value) < 1e-6) {
        cancelAnimationFrame(frameId);
        return [
          ...previousIterationArray,
          {
            step: nextIter,
            x: xNext,
            objective: funNext.value,
            gradienNorm: gradNext,
            status: "success",
            searchDirection: direction,
          },
        ];
      }

      return [
        ...previousIterationArray,
        {
          step: nextIter,
          x: xNext,
          objective: funNext.value,
          gradienNorm: gradNext,
          status: "pending",
          searchDirection: direction,
        },
      ];
    }
  );
};
