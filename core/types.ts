import { Var } from "@/core/variable";
import { ScaleLinear, ScaleSequential } from "d3-scale";

export type ScalarFn = (x: Var[]) => Var;

export type LinearScale = ScaleLinear<number, number>;
export type ColorScale = ScaleSequential<string>;

export type Status = "success" | "pending" | "failed";

export type ResultStatus = Exclude<Status, "pending">;

export type Run = {
  id: string;
  iterations: Iteration[];
  result: ResultStatus;
};

export type Iteration = {
  step: number;
  status: Status;
  x: Var[];
  objective: number;
  gradienNorm: number;
  searchDirection: number[];
};
