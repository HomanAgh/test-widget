"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/app/utils/client";
import UsersTab from "./UsersTab";
import OrganizationsTab from "./OrganizationsTab";
import AdminMessages from "./AdminMessages";
import AdminTabNavigation from "./AdminTabNavigation";

interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  is_approved: boolean;
  organization: string | null;
  organization_id: number | null;
  created_at: string;
}

interface Organization {
  id: number;
  name: string;
}

type SortField = 'email' | 'role' | 'is_approved' | 'organization' | 'created_at';
type SortDirection = 'asc' | 'desc';
type OrgSortField = 'id' | 'name' | 'members';
type TabType = 'users' | 'organizations';

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // User sorting state
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Organization sorting state
  const [orgSortField, setOrgSortField] = useState<OrgSortField>('id');
  const [orgSortDirection, setOrgSortDirection] = useState<SortDirection>('asc');
  
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('users');
  
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
    fetchOrganizations();
  }, []);

  // Sort users whenever the sort parameters change
  useEffect(() => {
    if (users.length) {
      sortUsers();
    }
  }, [sortField, sortDirection]);

  const sortUsers = () => {
    const sortedUsers = [...users].sort((a, b) => {
      // Handle different field types
      if (sortField === 'email') {
        return sortDirection === 'asc' 
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      } else if (sortField === 'role') {
        return sortDirection === 'asc'
          ? a.role.localeCompare(b.role)
          : b.role.localeCompare(a.role);
      } else if (sortField === 'is_approved') {
        return sortDirection === 'asc'
          ? Number(a.is_approved) - Number(b.is_approved)
          : Number(b.is_approved) - Number(a.is_approved);
      } else if (sortField === 'organization') {
        const orgA = a.organization || '';
        const orgB = b.organization || '';
        return sortDirection === 'asc'
          ? orgA.localeCompare(orgB)
          : orgB.localeCompare(orgA);
      } else if (sortField === 'created_at') {
        return sortDirection === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });
    
    setUsers(sortedUsers);
  };

  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      console.log("Users fetched:", data?.length || 0);

      // Fetch users first, then get organizations separately
      const usersData = data || [];

      // Get all organization IDs from users
      const orgIds = usersData
        .map((user) => user.organization_id)
        .filter((id) => id !== null) as number[];

      console.log("Organization IDs from users:", orgIds);

      // If there are organization IDs, fetch their details
      if (orgIds.length > 0) {
        const { data: orgsData, error: orgsError } = await supabase
          .from("organizations")
          .select("*")
          .in("id", [...new Set(orgIds)]);

        if (orgsError) {
          console.error("Error fetching related organizations:", orgsError);
          throw orgsError;
        }

        console.log("Related organizations:", orgsData);

        // Map organization names to users
        const mappedData = usersData.map((user) => {
          if (user.organization_id) {
            const org = orgsData?.find((o) => o.id === user.organization_id);
            return {
              ...user,
              organization: org?.name || null,
            };
          }
          return user;
        });

        setUsers(mappedData);
      } else {
        setUsers(usersData);
      }
    } catch (err: any) {
      console.error("Error in fetchUsers():", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      console.log("Fetching organizations...");
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching organizations:", error);
        throw error;
      }

      console.log("Organizations fetched:", data?.length || 0);
      setOrganizations(data || []);
    } catch (err: any) {
      console.error("Error in fetchOrganizations():", err);
      setError(err.message);
    }
  };

  // Message handlers
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleSuccess = (successMsg: string) => {
    setSuccessMessage(successMsg);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccessMessage(null);

  if (loading)
    return (
      <div className="w-full flex justify-center items-center h-[300px]">
        <div className="animate-pulse text-lg">Loading user data...</div>
      </div>
    );

  return (
    <div className="w-full -mx-6">
      <AdminMessages
        error={error}
        successMessage={successMessage}
        onClearError={clearError}
        onClearSuccess={clearSuccess}
      />

      <AdminTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <UsersTab
          users={users}
          organizations={organizations}
          onRefreshUsers={fetchUsers}
          onError={handleError}
          actionLoading={actionLoading}
          setActionLoading={setActionLoading}
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />
      )}

      {/* Organizations Tab Content */}
      {activeTab === 'organizations' && (
        <OrganizationsTab
          users={users}
          organizations={organizations}
          onRefreshOrganizations={fetchOrganizations}
          onRefreshUsers={fetchUsers}
          onError={handleError}
          onSuccess={handleSuccess}
          actionLoading={actionLoading}
          setActionLoading={setActionLoading}
          orgSortField={orgSortField}
          setOrgSortField={setOrgSortField}
          orgSortDirection={orgSortDirection}
          setOrgSortDirection={setOrgSortDirection}
        />
      )}
    </div>
  );
};

export default AdminDashboard; 