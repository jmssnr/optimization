import { gradientDescent } from "@/core/gradient-descent";
import { rosenbrock } from "@/core/test-functions/rosenbrock";
import { gradient } from "@/core/utils";
import { Var } from "@/core/variable";
import { useAnimation } from "@/hooks/useAnimate";

export const useSolveRosenbrock = (initial: number[], pause: boolean) => {
  const x0 = initial.map((x) => new Var(x));

  const grad = gradient(rosenbrock);
  const { state, iteration, reset } = useAnimation(
    [x0],
    (x) => {
      const next = gradientDescent(rosenbrock, grad, x.at(-1)!);
      return [...x, next];
    },
    pause
  );

  const x = state.map((v) => v.map((vv) => vv.value));

  return { x, iteration, reset };
};
