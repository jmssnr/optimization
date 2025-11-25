"use client";

import ObjectiveContour from "@/components/chart/objective-contour";
import { rosenbrock } from "@/core/test-functions/rosenbrock";
import { Var } from "@/core/variable";
import { extent, range } from "d3-array";
import { scaleLinear, scaleSequentialLog } from "d3-scale";
import { interpolateYlGnBu } from "d3-scale-chromatic";
import { line } from "d3-shape";
import { useState } from "react";

const ContourChart = (props: {
  width: number;
  height: number;
  x: number[][];
  handleUpdateInitial: (x: Var[]) => void;
}) => {
  const { width, height, x, handleUpdateInitial } = props;
  const [hover, setHover] = useState<null | { x: number; y: number }>(null);
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
    <div className="flex flex-col gap-2">
      <svg
        width={width}
        height={height}
        onMouseEnter={(event) => {
          const { left, top } = event.currentTarget.getBoundingClientRect();
          const x = event.clientX - left;
          const y = event.clientY - top;
          setHover({ x, y });
        }}
        onMouseLeave={(event) => {
          setHover(null);
        }}
        onMouseMove={(event) => {
          const { left, top } = event.currentTarget.getBoundingClientRect();
          const x = event.clientX - left;
          const y = event.clientY - top;
          setHover({ x, y });
        }}
        onClick={(event) => {
          const { left, top } = event.currentTarget.getBoundingClientRect();
          const x = xScale.invert(event.clientX - left);
          const y = yScale.invert(event.clientY - top);
          handleUpdateInitial([new Var(x), new Var(y)]);
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
          className={"fill-none stroke-chart-1 stroke-2 opacity-40"}
        />

        <circle
          cx={xScale(1)}
          cy={yScale(1)}
          r={5}
          className="fill-chart-2 stroke-chart-2"
          fillOpacity={0.5}
        />
        <circle
          cx={xScale(x.at(0)![0])}
          cy={yScale(x.at(0)![1])}
          r={5}
          className="fill-chart-1 stroke-amber-500"
          fillOpacity={0.7}
        />

        {hover !== null && (
          <g>
            <circle
              cx={hover.x}
              cy={hover.y}
              r={4}
              className="fill-neutral-600"
            />
            <line
              x1={xScale(-5)}
              x2={xScale(5)}
              y1={hover.y}
              y2={hover.y}
              className="stroke-neutral-600"
            />

            <line
              x1={hover.x}
              x2={hover.x}
              y1={yScale(-5)}
              y2={yScale(5)}
              className="stroke-neutral-600"
            />
          </g>
        )}
        <circle
          cx={xScale(x.at(-1)![0])}
          cy={yScale(x.at(-1)![1])}
          r={10}
          fillOpacity={0.5}
          className="fill-chart-1 stroke-chart-1"
        />
        <circle
          cx={xScale(x.at(-1)![0])}
          cy={yScale(x.at(-1)![1])}
          r={5}
          className="fill-chart-1"
        />
        <rect
          rx={3}
          width={65}
          height={17}
          x={xScale(x.at(-1)![0]) + 12}
          y={yScale(x.at(-1)![1]) + 3}
          fillOpacity={0.6}
          className="fill-chart-1 text-xs stroke-chart-1"
        />
        <text
          dx={15}
          dy={15}
          x={xScale(x.at(-1)![0])}
          y={yScale(x.at(-1)![1])}
          className="fill-white text-xs"
        >
          {`(${x.at(-1)![0].toFixed(2)},${x.at(-1)![1].toFixed(2)})`}
        </text>
      </svg>
    </div>
  );
};

export default ContourChart;
