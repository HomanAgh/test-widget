"use client";

import React from "react";
import { createClient } from "@/app/utils/client";
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

interface UsersTabProps {
  users: User[];
  organizations: Organization[];
  onRefreshUsers: () => Promise<void>;
  onError: (error: string) => void;
  actionLoading: string | null;
  setActionLoading: (loading: string | null) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({
  users,
  organizations,
  onRefreshUsers,
  onError,
  actionLoading,
  setActionLoading,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
}) => {
  const supabase = createClient();

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
      await onRefreshUsers(); // Refresh the list
    } catch (err: any) {
      console.error("Error in handleToggleApproval():", err);
      onError(err.message);
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
      await onRefreshUsers(); // Refresh the list
    } catch (err: any) {
      console.error("Error in handleChangeOrganization():", err);
      onError(err.message);
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
      await onRefreshUsers(); // Refresh the list
    } catch (err: any) {
      console.error("Error in handleChangeRole():", err);
      onError(err.message);
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
      await onRefreshUsers(); // Refresh the list
    } catch (err: any) {
      console.error("Error in handleDeleteUser():", err);
      onError(`Failed to delete user: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
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
  );
};

export default UsersTab; 