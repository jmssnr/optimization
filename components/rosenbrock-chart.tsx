"use client";

import ObjectiveContour from "@/components/chart/objective-contour";
import { rosenbrock } from "@/core/test-functions/rosenbrock";
import { extent, range } from "d3-array";
import { scaleLinear, scaleSequentialLog } from "d3-scale";
import { interpolateYlGnBu } from "d3-scale-chromatic";
import { line } from "d3-shape";

const RosenbrockChart = (props: {
  width: number;
  height: number;
  x: number[][];
  handleChangeInitial: (x: number, y: number) => void;
  handleMoveInitial: (x: number, y: number) => void;
}) => {
  const { width, height, x, handleChangeInitial, handleMoveInitial } = props;
  const xScale = scaleLinear().domain([-5, 5]).range([0, width]);
  const yScale = scaleLinear().domain([-5, 5]).range([height, 0]);

  const thresholds = range(1, 20).map((i) => Math.pow(2, i));

  const colorScale = scaleSequentialLog(
    extent(thresholds) as [number, number],
    interpolateYlGnBu
  );

  const path = line<number[]>()
    .x((d, i) => xScale(d[0]))
    .y((d) => yScale(d[1]));
  return (
    <svg
      width={width}
      height={height}
      className="border rounded-md"
      onMouseMove={(event) => {
        const { left, top } = event.currentTarget.getBoundingClientRect();
        const x = xScale.invert(event.clientX - left);
        const y = yScale.invert(event.clientY - top);
        handleMoveInitial(x, y);
      }}
      onClick={(event) => {
        const { left, top } = event.currentTarget.getBoundingClientRect();
        const x = xScale.invert(event.clientX - left);
        const y = yScale.invert(event.clientY - top);
        handleChangeInitial(x, y);
      }}
    >
      <ObjectiveContour
        xScale={xScale}
        yScale={yScale}
        colorScale={colorScale}
        fun={rosenbrock}
      />
      <path
        d={path(x) ?? ""}
        className={"fill-none stroke-amber-500 stroke-2 opacity-40"}
      />
      <circle
        cx={xScale(x.at(-1)![0])}
        cy={yScale(x.at(-1)![1])}
        r={8}
        className="fill-amber-500 stroke-amber-700"
      />
    </svg>
  );
};

export default RosenbrockChart;
