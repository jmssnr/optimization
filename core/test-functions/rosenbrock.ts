import { Var } from "@/core/variable";

export const rosenbrock = (x: Var[], a = 1, b = 5) => {
  const x1 = x[0];
  const x2 = x[1];
  return new Var(a)
    .subtract(x1)
    .power(2)
    .add(new Var(b).multiply(x2.subtract(x1.power(2)).power(2)));
};
