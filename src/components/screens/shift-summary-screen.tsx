
"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Clock, Calendar, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Shift } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface ShiftSummaryScreenProps {
  shift: Shift;
  onCloseShift: () => void;
}

export default function ShiftSummaryScreen({ shift, onCloseShift }: ShiftSummaryScreenProps) {
  const [elapsedTime, setElapsedTime] = useState("");

  useEffect(() => {
    if (!shift.startTimestamp) return;

    const timer = setInterval(() => {
      const now = new Date();
      const start = new Date(shift.startTimestamp!);
      const diff = now.getTime() - start.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [shift.startTimestamp]);

  const getStartDate = () => {
    if (!shift.startTimestamp) return "N/A";
    return new Date(shift.startTimestamp).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const getStartTime = () => {
    if (!shift.startTimestamp) return "N/A";
    return new Date(shift.startTimestamp).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
  }

  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Current Shift</h1>
        <p className="text-muted-foreground">Review your active shift details.</p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>Shift Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center">
                <Calendar className="mr-3 h-5 w-5 text-primary"/>
                <div>
                    <p className="font-semibold">{getStartDate()}</p>
                    <p className="text-sm text-muted-foreground">Shift Started at {getStartTime()}</p>
                </div>
            </div>
            <div className="flex items-center">
                <Clock className="mr-3 h-5 w-5 text-primary"/>
                 <div>
                    <p className="font-semibold tabular-nums">{elapsedTime}</p>
                    <p className="text-sm text-muted-foreground">Elapsed Time</p>
                </div>
            </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size="lg"
                    variant="destructive"
                    className="w-full py-6 text-lg rounded-full shadow-lg"
                >
                    <LogOut className="mr-3 h-6 w-6" />
                    Close Shift
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center">
                        <AlertTriangle className="mr-2 text-destructive" />
                        Are you sure you want to end your shift?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Closing the shift will clear all current orders and sales data. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onCloseShift} className="bg-destructive hover:bg-destructive/90">
                        Yes, Close Shift
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>

    </div>
  );
}
