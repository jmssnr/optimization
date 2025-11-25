import { ColorScale, LinearScale } from "@/core/types";
import { Var } from "@/core/variable";

import { range } from "d3-array";
import { contours } from "d3-contour";
import { geoPath } from "d3-geo";

const ObjectiveContour = (props: {
  xScale: LinearScale;
  yScale: LinearScale;
  colorScale: ColorScale;
  fun: (x: Var[]) => Var;
}) => {
  const { xScale, yScale, colorScale, fun } = props;

  const innerWidth = xScale.range()[1];
  const innerHeight = yScale.range()[0];

  const q = 2;
  const x0 = -q / 2,
    x1 = innerWidth + 28 + q;
  const y0 = -q / 2,
    y1 = innerHeight + q;
  const n = Math.ceil((x1 - x0) / q);
  const m = Math.ceil((y1 - y0) / q);
  const grid = new Array(n * m);
  for (let j = 0; j < m; ++j) {
    for (let i = 0; i < n; ++i) {
      grid[j * n + i] = fun([
        new Var(xScale.invert(i * q + x0)),
        new Var(yScale.invert(j * q + y0)),
      ]).value;
    }
  }

  const thresholds = range(1, 20).map((i) => Math.pow(2, i));

  const contour = contours()
    .size([n, m])
    .thresholds(thresholds)(grid)
    .map(({ type, value, coordinates }) => {
      return {
        type,
        value,
        coordinates: coordinates.map((rings) =>
          rings.map((points) =>
            points.map((point) => [-q + q * point[0], -q + q * point[1]])
          )
        ),
      };
    });

  return (
    <g>
      <rect
        width={innerWidth}
        height={innerHeight}
        fill="white"
        fillOpacity={0.5}
      />
      {contour.map((line, i) => (
        <path
          key={`contour-line-${i}`}
          d={geoPath()(line) || ""}
          stroke={colorScale(line.value)}
          fill={colorScale(line.value)}
          fillOpacity={0.5}
          opacity={0.5}
        />
      ))}
    </g>
  );
};

export default ObjectiveContour;
