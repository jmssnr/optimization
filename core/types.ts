import { Var } from "@/core/variable";
import { ScaleLinear, ScaleSequential } from "d3-scale";

export type ScalarFn = (x: Var[]) => Var;

export type LinearScale = ScaleLinear<number, number>;
export type ColorScale = ScaleSequential<string>;
