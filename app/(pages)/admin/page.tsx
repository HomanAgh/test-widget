import { Suspense } from "react";
import { AdminPageWrapper, PageTitle } from "@/app/components/common/style";
import Header from "@/app/components/Header";
import ClientAdminPage from "@/app/components/admin/ClientAdminPage";

export default function AdminPage() {
  return (
    <AdminPageWrapper>
      <Header currentPath="/admin" />
      <PageTitle title="Admin Dashboard" />
      <Suspense fallback={<div className="flex justify-center items-center h-[300px]">Loading...</div>}>
        <ClientAdminPage />
      </Suspense>
    </AdminPageWrapper>
  );
} 