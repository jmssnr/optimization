import { scaleLinear } from "d3-scale";

const SearchDirectionChart = (props: {
  width: number;
  height: number;
  direction: number[];
}) => {
  const { width, height, direction } = props;

  const xScale = scaleLinear().domain([-1, 1]).range([0, width]);
  const yScale = scaleLinear().domain([-1, 1]).range([height, 0]);
  return (
    <svg width={width} height={height}>
      <line
        x1={xScale(0)}
        x2={xScale(0)}
        y1={yScale(-1)}
        y2={yScale(1)}
        className="stroke-neutral-600"
      />
      <line
        x1={xScale(-1)}
        x2={xScale(1)}
        y1={yScale(0)}
        y2={yScale(0)}
        className="stroke-neutral-600"
      />
      <circle cx={xScale(0)} cy={yScale(0)} className="fill-blue-500" r={2} />
      <line
        x1={xScale(0)}
        x2={xScale(direction[0])}
        y1={yScale(0)}
        y2={yScale(direction[1])}
        className="stroke-blue-500"
      />
    </svg>
  );
};

export default SearchDirectionChart;
