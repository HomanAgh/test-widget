"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import EliteProspectsLogo from "@/app/components/common/EliteProspectsLogo";
import { PageWrapper, PageTitle, PoweredBy } from "@/app/components/common/style";
import RegisterForm from "@/app/components/auth/RegisterForm";

const RegisterPageContent = () => {
  return (
    <PageWrapper>
      <div className="flex items-center mb-6">
        <EliteProspectsLogo />
      </div>

      <div className="bg-white p-6 rounded-lg w-[320px] md:w-[768px] pb-[56px]">
        <PageTitle title="Create an Account" />
        
        <div className="mb-4">
          <Link 
            href="/auth" 
            className="text-[#0B9D52] font-semibold hover:underline flex items-center"
          >
            <span className="mr-1">←</span> Back to Login
          </Link>
        </div>
        
        <RegisterForm />
      </div>
      <PoweredBy />
    </PageWrapper>
  );
};

// Main component with Suspense boundary
const RegisterPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
};

export default RegisterPage; 