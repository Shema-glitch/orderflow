
"use client";

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

interface LoginScreenProps {
  onSignIn: () => void;
}

export default function LoginScreen({ onSignIn }: LoginScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-primary">OrderFlow</h1>
        <p className="text-muted-foreground mt-2">Your personal shift assistant.</p>
      </div>
      <Button
        size="lg"
        onClick={onSignIn}
        className="w-full max-w-xs py-8 text-2xl rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Chrome className="mr-4 h-8 w-8" />
        Sign In with Google
      </Button>
    </div>
  );
}
