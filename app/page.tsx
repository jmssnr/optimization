"use client";

import RosenbrockChart from "@/components/rosenbrock-chart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSolveRosenbrock } from "@/hooks/useSolveRosenbrock";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [pause, setPause] = useState(false);
  const width = 400;
  const height = 300;

  const initial = [-4, -3];

  const { x, iteration } = useSolveRosenbrock(initial, pause);

  return (
    <main className="w-screen h-screen grid place-content-center">
      <div className="flex flex-col gap-2">
        <div className="flex gap-5 items-center">
          <Button size={"icon"} onClick={() => setPause(!pause)}>
            {pause ? <PlayIcon /> : <PauseIcon />}
          </Button>
          <p>Iteration</p>
          <p className="text-secondary">{iteration}</p>
        </div>
        <Separator />
        <div className="flex gap-2">
          <RosenbrockChart width={width} height={height} x={x} />
        </div>
      </div>
    </main>
  );
}
