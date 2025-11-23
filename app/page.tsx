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
import { CheckCircle, CircleX, RotateCcw } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ParentSize } from "@visx/responsive";
import ContourChart from "@/components/contour-chart";
import { Var } from "@/core/variable";
import { rosenbrock } from "@/core/test-functions/rosenbrock";
import { gradient } from "@/core/utils";

export default function Home() {
  const { state, reset } = useMinimizeRosenbrock();
  const bottomRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "instant",
      block: "nearest",
    });
  }, [state.length]);

  const handleUpdateInitial = (x0: Var[]) => {
    const grad = gradient(rosenbrock);
    reset([
      {
        iter: 0,
        x: x0,
        fun: rosenbrock(x0),
        gradNorm: Math.hypot(...grad(x0)),
        status: "iterating",
      },
    ]);
  };

  const successMessage = (
    <span className="flex gap-2 items-center p-2">
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

  return (
    <main className="w-screen h-screen overflow-hidden">
      <section className="flex flex-col w-full h-full">
        <div className="flex-2 min-h-0 min-w-0 p-5">
          <ParentSize>
            {({ width, height }) => {
              if (width === 0 || height === 0) return;

              return (
                <ContourChart
                  width={width}
                  height={height}
                  x={state.map((xi) => xi.x)}
                  handleUpdateInitial={handleUpdateInitial}
                />
              );
            }}
          </ParentSize>
        </div>
        <Separator />
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex justify-between items-center  bg-neutral-900 p-1">
            {state.at(-1)!.status === "max"
              ? maxMessage
              : state.at(-1)!.status === "success"
              ? successMessage
              : ongoingMessage}
            <Button size="icon" variant={"outline"} onClick={() => reset()}>
              <RotateCcw />
            </Button>
          </div>
          <Separator />
          <ScrollArea className="h-full min-h-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Iteration</TableHead>
                  <TableHead>Objective Function</TableHead>
                  <TableHead>Gradient Norm</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.map((xi, index) => (
                  <TableRow
                    key={index}
                    ref={index === state.length - 1 ? bottomRef : undefined}
                    className="text-left"
                  >
                    <TableCell>{index}</TableCell>
                    <TableCell>{xi.fun.toPrecision(1)}</TableCell>
                    <TableCell>{xi.gradNorm.toPrecision(1)}</TableCell>
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
