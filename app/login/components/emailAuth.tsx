'use client'

import * as React from 'react';
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EmailAuth(): React.ReactElement {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    // Check for error or message params
    useEffect(() => {
        const errorParam = searchParams.get('error');
        const messageParam = searchParams.get('message');

        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }

        if (messageParam) {
            setSuccessMessage(decodeURIComponent(messageParam));
        }
    }, [searchParams]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push('/feed');
        } catch (error: any) {
            console.error("Sign in error:", error);
            setError(error.message || 'An error occurred during sign in');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });

            if (error) {
                console.error("Sign up error:", error);

                const errorMsg = error.message.toLowerCase();
                if (errorMsg.includes('already registered') ||
                    errorMsg.includes('already exists') ||
                    errorMsg.includes('email already taken') ||
                    errorMsg.includes('unique constraint') ||
                    errorMsg.includes('duplicate key')) {

                    setError(
                        'An account with this email already exists. ' +
                        'Please sign in instead, or use the "Forgot password" option ' +
                        'if you need to reset your password.'
                    );
                } else {
                    setError(error.message || 'An error occurred during sign up');
                }
                return;
            }

            if (data && data.user) {
                if (!data.user.identities || data.user.identities.length === 0) {
                    setError('This email is already registered. Please sign in or use the forgot password option.');
                    return;
                }

                if (data.session === null) {
                    setSuccessMessage('Please check your email for the confirmation link.');
                } else {
                    router.push('/feed');
                }
            } else {
                setSuccessMessage('Account created successfully. Please check your email for confirmation if required.');
            }
        } catch (error: any) {
            console.error("Sign up error:", error);
            setError(error.message || 'An error occurred during sign up');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!email) {
            setError('Please enter your email address');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;

            setSuccessMessage('Password reset instructions sent to your email');
        } catch (error: any) {
            console.error("Password reset error:", error);
            setError(error.message || 'An error occurred while sending reset instructions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CardContent className="space-y-6">
            {showForgotPassword ? (
                // Forgot Password Form
                <div className="space-y-4">
                    <div className="flex items-center mb-4">
                        <Button
                            variant="ghost"
                            className="p-0 h-auto mr-2"
                            onClick={() => setShowForgotPassword(false)}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h3 className="text-lg font-medium">Reset Password</h3>
                    </div>

                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <Input
                                id="reset-email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pointer-events-auto"
                            />
                        </div>

                        {error ? (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : null}

                        {successMessage ? (
                            <Alert>
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        ) : null}

                        <Button
                            type="submit"
                            className="w-full pointer-events-auto"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Instructions'}
                        </Button>
                    </form>
                </div>
            ) : (
                // Sign In / Sign Up Tabs
                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Create Account</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin" className="space-y-4">
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pointer-events-auto"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pointer-events-auto"
                                />
                            </div>

                            <div className="text-right">
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-sm"
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                >
                                    Forgot password?
                                </Button>
                            </div>

                            {error ? (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            ) : null}

                            {successMessage ? (
                                <Alert>
                                    <AlertDescription>{successMessage}</AlertDescription>
                                </Alert>
                            ) : null}

                            <Button
                                type="submit"
                                className="w-full pointer-events-auto"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4">
                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pointer-events-auto"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input
                                    id="signup-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pointer-events-auto"
                                />
                                <p className="text-xs text-gray-500">
                                    Password must be at least 8 characters long
                                </p>
                            </div>

                            {error ? (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            ) : null}

                            {successMessage ? (
                                <Alert>
                                    <AlertDescription>{successMessage}</AlertDescription>
                                </Alert>
                            ) : null}

                            <Button
                                type="submit"
                                className="w-full pointer-events-auto"
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            )}

            {/* Additional Info */}
            <p className="text-sm text-gray-500 text-center pt-4">
                By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
        </CardContent>
    );
}