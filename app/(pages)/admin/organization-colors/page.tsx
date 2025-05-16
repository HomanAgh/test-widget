import { AdminPageWrapper, PageTitle} from "@/app/components/common/style";
import Header from "@/app/components/Header";
import ClientOrganizationColorsPage from "@/app/components/admin/ClientOrganizationColorsPage";

export default function OrganizationColorsPage() {
  return (
    <AdminPageWrapper>
      <Header currentPath="/admin/organization-colors" />
      <PageTitle title="Organization Colors" />
      <ClientOrganizationColorsPage />
    </AdminPageWrapper>
  );
}
