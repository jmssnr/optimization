import { Var } from "@/core/variable";
import { ScalarFn } from "@/core/types";

export const gradient = (fun: ScalarFn) => {
  return (x: Var[]) => {
    const grad = [];
    for (let i = 0; i < x.length; i++) {
      const partial = fun(
        x.map((xi, index) => {
          if (index === i) {
            xi.derivative = 1.0;
          } else {
            xi.derivative = 0.0;
          }
          return xi;
        })
      ).derivative;

      grad.push(partial);
    }
    return grad;
  };
};

export const normalize = (a: number[]) => {
  const norm = Math.hypot(...a);
  return a.map((v) => v / norm);
};

export const add = (a: Var[], b: number[], c: number) => {
  return a.map((v, i) => new Var(v.value + c * b[i]));
};

export const dot = (a: number[], b: number[]) =>
  a.reduce((s, v, i) => s + v * b[i], 0);
