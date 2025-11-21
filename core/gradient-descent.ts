import { lineSearch } from "@/core/linear-search";
import { ScalarFn } from "@/core/types";
import { normalize } from "@/core/utils";
import { Var } from "@/core/variable";

export const gradientDescent = (
  fun: ScalarFn,
  grad: (x: Var[]) => number[],
  x: Var[]
) => {
  const direction = normalize(grad(x).map((v) => -1 * v));
  const alpha = lineSearch(fun, grad, x, direction);
  return x.map((v, i) => new Var(v.value + alpha * direction[i]));
};
