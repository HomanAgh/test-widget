"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import PageWrapper from "@/app/components/common/style/PageWrapper";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email...");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const code = searchParams?.get("code");

        if (!code) {
          setStatus("error");
          setMessage("Invalid verification link. No code provided.");
          return;
        }

        const supabase = createClient();

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Verification error:", error);
          setStatus("error");
          setMessage(error.message);
          return;
        }

        // Success!
        setStatus("success");
        setMessage("Your email has been verified! You can now log in.");

        // Redirect to login after a delay
        setTimeout(() => {
          router.push("/auth");
        }, 3000);
      } catch (error) {
        console.error("Error during verification:", error);
        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <PageWrapper>
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>

        {status === "loading" && (
          <div className="text-gray-700">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-green-600">
            <svg
              className="h-12 w-12 text-green-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p>{message}</p>
            <p className="mt-4 text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-red-600">
            <svg
              className="h-12 w-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p>{message}</p>
            <button
              onClick={() => router.push("/auth")}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
