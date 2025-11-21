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
}) => {
  const { width, height, x } = props;
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
    <svg width={width} height={height} className="border rounded-md">
      <ObjectiveContour
        xScale={xScale}
        yScale={yScale}
        colorScale={colorScale}
        fun={rosenbrock}
      />
      <path d={path(x) ?? ""} className={"fill-none stroke-blue-500 "} />
      <circle
        cx={xScale(x.at(-1)![0])}
        cy={yScale(x.at(-1)![1])}
        r={5}
        className="fill-blue-500 stroke-blue-700"
      />
    </svg>
  );
};

export default RosenbrockChart;
