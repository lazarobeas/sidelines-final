import React from 'react';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmailAuth from "@/app/login/components/emailAuth";

interface UrlMessageCode {
    error?: string;
    message?: string;
}

export default async function LoginPage({
                                            urlMessageCode = {},
                                        }: {
    urlMessageCode?: UrlMessageCode;
} = {}): Promise<React.ReactNode> {

    // Creating connection to supabase server client
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // If already logged in, redirect to dashboard
    if (session) {
        redirect('/feed');
    }

    // HTML for whenever we use this function
    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative z-50">
            <Card className="w-full max-w-md relative z-50">
                <CardHeader className="text-center space-y-3">
                    <CardTitle className="text-3xl font-bold tracking-tight">
                        Join Sideliness
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600">
                        Sign in to become part of the growing sports community!
                    </CardDescription>

                    {/* Show error message if present in URL */}
                    {urlMessageCode?.error ? (
                        <div className="p-3 bg-red-100 text-red-800 rounded text-sm">
                            {urlMessageCode.error === 'auth_failed'
                                ? 'Authentication failed. Please try again.'
                                : urlMessageCode.error === 'profile_failed'
                                    ? 'Failed to update profile. Please try again.'
                                    : urlMessageCode.error === 'no_code'
                                        ? 'Please use the sign in form below.'
                                        : urlMessageCode.error}
                        </div>
                    ) : null}

                    {/* Show success message if present in URL */}
                    {urlMessageCode?.message ? (
                        <div className="p-3 bg-green-100 text-green-800 rounded text-sm">
                            {urlMessageCode.message}
                        </div>
                    ) : null}
                </CardHeader>
                <EmailAuth />
            </Card>
        </div>
    );
}