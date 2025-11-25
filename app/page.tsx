"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMinimizeRosenbrock } from "@/hooks/useMinimizeRosenbrock";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import {
  CheckCircle,
  CircleX,
  InfoIcon,
  RotateCcw,
  TrashIcon,
} from "lucide-react";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ParentSize } from "@visx/responsive";
import ContourChart from "@/components/contour-chart";
import { Var } from "@/core/variable";
import { rosenbrock } from "@/core/test-functions/rosenbrock";
import { gradient, normalize } from "@/core/utils";
import SearchDirectionChart from "@/components/search-direction-chart";
import { useGradientDescent } from "@/hooks/useGradientDescent";

export default function Home() {
  const { runs, iterations, startNewRun, removeRun, loadPreviousRun } =
    useGradientDescent();
  const bottomRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "instant",
      block: "nearest",
    });
  }, [iterations.length]);

  const handleUpdateInitial = (x0: Var[]) => {
    const grad = gradient(rosenbrock);
    startNewRun({
      step: 0,
      x: x0,
      objective: rosenbrock(x0).value,
      gradienNorm: Math.hypot(...grad(x0)),
      status: "pending",
      searchDirection: normalize(
        grad([new Var(-4), new Var(-4)]).map((v) => -1 * v)
      ),
    });
  };

  const successMessage = (
    <span className="truncate flex gap-2 items-center p-2">
      <CheckCircle className="size-3 stroke-green-500 stroke-2" />
      <p>Local Optimum Found</p>
    </span>
  );

  const maxMessage = (
    <span className="flex gap-2 items-center p-2">
      <CircleX className="size-3 stroke-yellow-500 stroke-2" />
      <p>Maximum Iterations Reached</p>
    </span>
  );

  const ongoingMessage = (
    <span className="flex gap-2 items-center p-2">
      <Spinner className="size-3 stroke-blue-500" />
      <p>Iterating...</p>
    </span>
  );

  console.log(runs);

  return (
    <main className="w-screen h-screen overflow-hidden">
      <section className="flex flex-col w-full h-full">
        <div className="flex-2 min-h-0 min-w-0 flex">
          <div className="flex-1 flex flex-col">
            <div className=" bg-neutral-900 p-2 ">
              <p>Run History</p>
            </div>
            <ScrollArea className="h-full min-h-0">
              <ul>
                {runs.length > 0 ? (
                  runs.map((run, index) => (
                    <li
                      key={run.id}
                      className="hover:bg-muted/50 flex transition-colors justify-between items-center text-sm p-2 border border-t-0 border-x-0"
                    >
                      <div className="flex flex-col">
                        <p>
                          Run {index + 1} -{" "}
                          <span className="text-neutral-600">
                            {run.iterations.length - 1} iterations
                          </span>
                        </p>

                        {run.result === "success" ? successMessage : maxMessage}
                      </div>

                      <div>
                        <Button
                          variant="ghost"
                          size={"icon"}
                          onClick={() => {
                            removeRun(run.id);
                          }}
                        >
                          <TrashIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size={"icon"}
                          onClick={() => {
                            loadPreviousRun(run.id);
                          }}
                        >
                          <RotateCcw />
                        </Button>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="flex items-center pt-2 gap-2 justify-center">
                    <InfoIcon className="size-4" />
                    <p className="text-neutral-500 text-center text-sm">
                      Completed runs will be shown here
                    </p>
                  </div>
                )}
              </ul>
            </ScrollArea>
          </div>
          <Separator orientation="vertical" />
          <div className="min-h-0 min-w-0 flex-2">
            <ParentSize>
              {({ width, height }) => {
                if (width === 0 || height === 0) return;

                return (
                  <ContourChart
                    width={width}
                    height={height}
                    x={iterations.map((xi) => xi.x.map((xii) => xii.value))}
                    handleUpdateInitial={handleUpdateInitial}
                  />
                );
              }}
            </ParentSize>
          </div>
        </div>
        <Separator />
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex justify-between items-center  bg-neutral-900 p-1 pl-2">
            <p>Run Logs</p>
            {iterations.at(-1)!.status === "failed"
              ? maxMessage
              : iterations.at(-1)!.status === "success"
              ? successMessage
              : ongoingMessage}
          </div>
          <ScrollArea className="h-full min-h-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Iteration</TableHead>
                  <TableHead>Objective Function</TableHead>
                  <TableHead>Gradient Norm</TableHead>
                  <TableHead>Search Direction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {iterations.map((xi, index) => (
                  <TableRow
                    key={index}
                    ref={
                      index === iterations.length - 1 ? bottomRef : undefined
                    }
                    className="text-left"
                  >
                    <TableCell>{index}</TableCell>
                    <TableCell>{xi.objective.toPrecision(1)}</TableCell>
                    <TableCell>{xi.gradienNorm.toPrecision(1)}</TableCell>
                    <TableCell>
                      <SearchDirectionChart
                        direction={xi.searchDirection}
                        width={30}
                        height={30}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </section>
    </main>
  );
}
