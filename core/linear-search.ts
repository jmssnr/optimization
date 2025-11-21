import { ScalarFn } from "@/core/types";
import { Var } from "@/core/variable";

export const lineSearch = (
  fun: ScalarFn,
  grad: (x: Var[]) => number[],
  x: Var[],
  direction: number[],
  alpha = 10,
  p = 0.5,
  beta = 1e-4
) => {
  const y = fun(x).value;
  const g = grad(x);

  const add = (a: Var[], b: number[], c: number) => {
    return a.map((v, i) => new Var(v.value + c * b[i]));
  };

  const dot = (a: number[], b: number[]) =>
    a.reduce((s, v, i) => s + v * b[i], 0);

  while (true) {
    const xNext = add(x, direction, alpha);

    if (fun(xNext).value <= y + beta * alpha * dot(g, direction)) {
      return alpha;
    }

    alpha *= p;
  }
};
