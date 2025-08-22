
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Chrome, Mail, Lock } from "lucide-react";
import { signInWithGoogle, signUpWithEmailPassword, signInWithEmailPassword } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginScreenProps {
  onSignIn?: () => void; // Kept for simplicity, though direct calls are used
}

export default function LoginScreen({ onSignIn }: LoginScreenProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign-in Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailPassword(email, password);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Sign-in Failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUpWithEmailPassword(email, password);
      toast({
        title: "Account Created!",
        description: "You have been successfully signed up.",
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Sign-up Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center h-[90vh] text-center p-4">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-primary">OrderFlow</h1>
        <p className="text-muted-foreground mt-2">Your personal shift assistant.</p>
      </div>
      
      <Tabs defaultValue="google" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="google">
            <Chrome className="mr-2 h-4 w-4"/> Google
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4"/> Email
          </TabsTrigger>
        </TabsList>
        <TabsContent value="google">
          <Card>
            <CardHeader>
              <CardTitle>Sign in with Google</CardTitle>
              <CardDescription>
                Use your Google account for a quick sign-in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                onClick={handleGoogleSignIn}
                className="w-full py-6 text-xl rounded-lg shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={loading}
              >
                <Chrome className="mr-4 h-6 w-6" />
                {loading ? 'Signing in...' : 'Sign In with Google'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="email">
            <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <form onSubmit={handleEmailSignIn}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Sign In with Email</CardTitle>
                                <CardDescription>Enter your credentials to access your account.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-left">
                                <Label htmlFor="email-signin">Email</Label>
                                <Input id="email-signin" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="space-y-2 text-left">
                                <Label htmlFor="password-signin">Password</Label>
                                <Input id="password-signin" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                 <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
                            </CardContent>
                        </Card>
                    </form>
                </TabsContent>
                 <TabsContent value="signup">
                    <form onSubmit={handleEmailSignUp}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Create an Account</CardTitle>
                                <CardDescription>Sign up with your email and a password.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-left">
                                <Label htmlFor="email-signup">Email</Label>
                                <Input id="email-signup" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="space-y-2 text-left">
                                <Label htmlFor="password-signup">Password</Label>
                                <Input id="password-signup" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Sign Up'}</Button>
                            </CardContent>
                        </Card>
                    </form>
                </TabsContent>
            </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
