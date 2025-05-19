"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/app/utils/client";
import Link from "next/link";
import { HiMiniChevronUp, HiMiniChevronDown } from "react-icons/hi2";

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

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
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

  const handleSort = (field: SortField) => {
    // If clicking the same field, toggle direction
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    
    return (
      <span className="ml-1 inline-block">
        {sortDirection === 'asc' 
          ? <HiMiniChevronUp className="inline h-4 w-4 text-black" />
          : <HiMiniChevronDown className="inline h-4 w-4 text-black" />
        }
      </span>
    );
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

  const handleToggleApproval = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      setActionLoading(`approve-${userId}`);
      console.log(
        `${currentStatus ? "Unapproving" : "Approving"} user:`,
        userId
      );

      const { data, error } = await supabase
        .from("users")
        .update({ is_approved: !currentStatus })
        .eq("id", userId)
        .select();

      if (error) {
        console.error("Error toggling approval status:", error);
        throw error;
      }

      console.log("User approval status updated:", data);
      await fetchUsers(); // Refresh the list
    } catch (err: any) {
      console.error("Error in handleToggleApproval():", err);
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeOrganization = async (
    userId: string,
    organizationId: number | null
  ) => {
    try {
      setActionLoading(`org-${userId}`);
      console.log(
        "Changing organization for user:",
        userId,
        "to:",
        organizationId
      );

      const { data, error } = await supabase
        .from("users")
        .update({ organization_id: organizationId })
        .eq("id", userId)
        .select();

      if (error) {
        console.error("Error changing organization:", error);
        throw error;
      }

      console.log("Organization changed:", data);
      await fetchUsers(); // Refresh the list
    } catch (err: any) {
      console.error("Error in handleChangeOrganization():", err);
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (userId: string, role: "user" | "admin") => {
    try {
      setActionLoading(`role-${userId}`);
      console.log("Changing role for user:", userId, "to:", role);

      // Call the API endpoint to update both the database and auth metadata
      const response = await fetch("/api/admin/update-user-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error updating user role:", result.error);
        throw new Error(result.error);
      }

      console.log("Role changed successfully:", result);
      await fetchUsers(); // Refresh the list
    } catch (err: any) {
      console.error("Error in handleChangeRole():", err);
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setActionLoading(`delete-${userId}`);
      console.log("Deleting user:", userId);

      // First try to delete directly from auth.users using admin API
      try {
        // NOTE: For this to work, you need service_role key setup with admin access,
        // and you need to have proper admin permissions on your user account
        console.log("Attempting to delete auth user with admin API...");
        const { error: authError } = await fetch("/api/admin/delete-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }).then((res) => res.json());

        if (authError) {
          console.error("Error deleting user with admin API:", authError);
          throw new Error(authError);
        }

        console.log("User deleted from auth successfully with admin API");
      } catch (authError) {
        console.error("Admin API delete failed:", authError);
        // Fallback: Try to delete from public.users which might cascade
        console.log("Falling back to deleting from public.users...");
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("id", userId);

        if (error) {
          console.error("Error deleting user from public.users:", error);
          throw error;
        }
      }

      console.log("User deletion process completed");
      await fetchUsers(); // Refresh the list
    } catch (err: any) {
      console.error("Error in handleDeleteUser():", err);
      setError(`Failed to delete user: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const addOrganization = async () => {
    const name = prompt("Enter organization name:");
    if (!name) return;

    try {
      setActionLoading("add-org");
      console.log("Adding organization:", name);

      const { data, error } = await supabase
        .from("organizations")
        .insert([{ name }])
        .select();

      if (error) {
        console.error("Error adding organization:", error);
        throw error;
      }

      console.log("Organization added:", data);
      await fetchOrganizations(); // Refresh the list
    } catch (err: any) {
      console.error("Error in addOrganization():", err);
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Function to clear error messages
  const clearError = () => setError(null);

  if (loading)
    return (
      <div className="w-full flex justify-center items-center h-[300px]">
        <div className="animate-pulse text-lg">Loading user data...</div>
      </div>
    );

  return (
    <div className="w-full -mx-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-6">
          <span className="block sm:inline">{error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={clearError}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}

      <div className="flex justify-between mb-8 mx-6">
        <div className="flex gap-4">
          <Link href="/admin/organization-colors">
            <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
              Organization Colors
            </button>
          </Link>
        </div>

        <button
          onClick={addOrganization}
          disabled={actionLoading === "add-org"}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {actionLoading === "add-org" ? "Adding..." : "Add Organization"}
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                style={{ width: "25%", maxWidth: "300px" }}
                onClick={() => handleSort('email')}
              >
                Email {renderSortIndicator('email')}
              </th>
              <th
                className="px-3 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                style={{ minWidth: "100px", width: "12%" }}
                onClick={() => handleSort('role')}
              >
                Role {renderSortIndicator('role')}
              </th>
              <th
                className="px-3 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                style={{ minWidth: "100px", width: "13%" }}
                onClick={() => handleSort('is_approved')}
              >
                Status {renderSortIndicator('is_approved')}
              </th>
              <th
                className="px-3 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                style={{ minWidth: "180px", width: "20%" }}
                onClick={() => handleSort('organization')}
              >
                Organization {renderSortIndicator('organization')}
              </th>
              <th
                className="px-3 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                style={{ minWidth: "100px", width: "15%" }}
                onClick={() => handleSort('created_at')}
              >
                Created {renderSortIndicator('created_at')}
              </th>
              <th
                className="px-3 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                style={{ minWidth: "150px", width: "15%" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td
                  className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 truncate"
                  style={{ maxWidth: "300px" }}
                >
                  {user.email}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleChangeRole(
                        user.id,
                        e.target.value as "user" | "admin"
                      )
                    }
                    disabled={actionLoading === `role-${user.id}`}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.is_approved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.is_approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                  <select
                    value={user.organization_id || ""}
                    onChange={(e) =>
                      handleChangeOrganization(
                        user.id,
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    disabled={actionLoading === `org-${user.id}`}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
                  >
                    <option value="">Select Organization</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() =>
                      handleToggleApproval(user.id, user.is_approved)
                    }
                    disabled={actionLoading === `approve-${user.id}`}
                    className={`mr-2 disabled:opacity-50 ${
                      user.is_approved
                        ? "text-yellow-600 hover:text-yellow-900"
                        : "text-green-600 hover:text-green-900"
                    }`}
                  >
                    {actionLoading === `approve-${user.id}`
                      ? "Updating..."
                      : user.is_approved
                      ? "Unapprove"
                      : "Approve"}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={actionLoading === `delete-${user.id}`}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {actionLoading === `delete-${user.id}`
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
