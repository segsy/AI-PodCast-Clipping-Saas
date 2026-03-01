"use client";

import { 
  getSession as nextAuthGetSession, 
  signIn as nextAuthSignIn, 
  signOut as nextAuthSignOut,
  useSession as nextAuthUseSession
} from "next-auth/react";

// Helper functions for client-side auth using NextAuth
export const signIn = async (provider?: string, options?: { callbackUrl?: string }) => {
  await nextAuthSignIn(provider, { callbackUrl: options?.callbackUrl || "/dashboard" });
};

export const signInWithGoogle = async () => {
  await nextAuthSignIn("google", { callbackUrl: "/dashboard" });
};

export const signInWithGitHub = async () => {
  await nextAuthSignIn("github", { callbackUrl: "/dashboard" });
};

export const signOut = async () => {
  await nextAuthSignOut({ callbackUrl: "/" });
};

export const useSession = () => {
  return nextAuthUseSession();
};

export const getSession = async () => {
  return await nextAuthGetSession();
};

// Email/password sign-in (for credentials provider if needed)
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await nextAuthSignIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      // Parse the error from NextAuth
      return { error: { message: result.error || "Invalid email or password" }, success: false };
    }
    
    return { error: null, success: true };
  } catch (error: any) {
    // Handle the thrown error from credentials provider
    const errorMessage = error.message || "Failed to sign in";
    return { error: { message: errorMessage }, success: false };
  }
};

// Sign up (creates user with email/password via credentials)
export const signUp = async (email: string, password: string, name?: string) => {
  try {
    const response = await fetch("/api/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || "Failed to sign up";
      const errorDetails = data.details || "No details provided";
      console.error("[SIGNUP CLIENT] Error response:", { status: response.status, error: errorMessage, details: errorDetails });
      return { error: { message: `${errorMessage}: ${errorDetails}` }, success: false };
    }

    // After successful sign up, automatically sign in
    return await signInWithEmail(email, password);
  } catch (error: any) {
    return { error: { message: error.message || "Failed to sign up" }, success: false };
  }
};
