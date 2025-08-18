"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, StopCircle } from "lucide-react";

interface ShiftScreenProps {
  isShiftOpen: boolean;
  onOpenShift: () => void;
  onCloseShift: () => void;
}

export default function ShiftScreen({ isShiftOpen, onOpenShift, onCloseShift }: ShiftScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold font-headline">OrderFlow Lite</CardTitle>
            <CardDescription className="text-md">
              Manage your work shift and start taking orders.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 p-6">
            <Button
              size="lg"
              onClick={onOpenShift}
              disabled={isShiftOpen}
              className="w-full py-6 text-lg"
            >
              <PlayCircle className="mr-2 h-6 w-6" />
              Open Shift
            </Button>
            <Button
              size="lg"
              variant="destructive"
              onClick={onCloseShift}
              disabled={!isShiftOpen}
              className="w-full py-6 text-lg"
            >
              <StopCircle className="mr-2 h-6 w-6" />
              Close Shift
            </Button>
          </CardContent>
        </Card>
    </div>
  );
}
