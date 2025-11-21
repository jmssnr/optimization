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
