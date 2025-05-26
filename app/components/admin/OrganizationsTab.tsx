"use client";

import React, { useMemo } from "react";
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

type OrgSortField = 'id' | 'name' | 'members';
type SortDirection = 'asc' | 'desc';

interface OrganizationsTabProps {
  users: User[];
  organizations: Organization[];
  onRefreshOrganizations: () => Promise<void>;
  onRefreshUsers: () => Promise<void>;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
  actionLoading: string | null;
  setActionLoading: (loading: string | null) => void;
  orgSortField: OrgSortField;
  setOrgSortField: (field: OrgSortField) => void;
  orgSortDirection: SortDirection;
  setOrgSortDirection: (direction: SortDirection) => void;
}

const OrganizationsTab: React.FC<OrganizationsTabProps> = ({
  users,
  organizations,
  onRefreshOrganizations,
  onRefreshUsers,
  onError,
  onSuccess,
  actionLoading,
  setActionLoading,
  orgSortField,
  setOrgSortField,
  orgSortDirection,
  setOrgSortDirection,
}) => {
  const supabase = createClient();

  const handleOrgSort = (field: OrgSortField) => {
    if (field === orgSortField) {
      setOrgSortDirection(orgSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setOrgSortField(field);
      setOrgSortDirection('asc');
    }
  };

  const renderOrgSortIndicator = (field: OrgSortField) => {
    if (orgSortField !== field) return null;
    
    return (
      <span className="ml-1 inline-block">
        {orgSortDirection === 'asc' 
          ? <HiMiniChevronDown className="inline h-4 w-4 text-black" />
          : <HiMiniChevronUp className="inline h-4 w-4 text-black" />
        }
      </span>
    );
  };

  // Calculate member count for each organization
  const getOrganizationMemberCount = (orgId: number) => {
    return users.filter(user => user.organization_id === orgId).length;
  };

  // Sort organizations based on current sort field and direction
  const sortedOrganizations = useMemo(() => {
    return [...organizations].sort((a, b) => {
      if (orgSortField === 'id') {
        return orgSortDirection === 'asc' ? a.id - b.id : b.id - a.id;
      } else if (orgSortField === 'name') {
        return orgSortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (orgSortField === 'members') {
        const memberCountA = getOrganizationMemberCount(a.id);
        const memberCountB = getOrganizationMemberCount(b.id);
        return orgSortDirection === 'asc' 
          ? memberCountA - memberCountB
          : memberCountB - memberCountA;
      }
      return 0;
    });
  }, [organizations, orgSortField, orgSortDirection, users]);

  const addOrganization = async () => {
    // Get name from the form input or fallback to tempOrgName
    const input = document.getElementById('org-name') as HTMLInputElement;
    const name = input?.value.trim() || (window as any).tempOrgName || prompt("Enter organization name:");
    if (!name) return;

    try {
      setActionLoading("add-org");
      onError(""); // Clear any previous errors
      console.log("Adding organization:", name);

      // First, get the current maximum ID
      const { data: maxIdData, error: maxIdError } = await supabase
        .from("organizations")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      if (maxIdError) {
        console.error("Error getting max ID:", maxIdError);
        throw maxIdError;
      }

      // Calculate the next ID (max + 1, or 1 if no organizations exist)
      const nextId = maxIdData && maxIdData.length > 0 ? maxIdData[0].id + 1 : 1;
      console.log("Next ID will be:", nextId);

      // Insert with explicit ID
      const { data, error } = await supabase
        .from("organizations")
        .insert({ id: nextId, name: name.trim() })
        .select();

      if (error) {
        console.error("Error adding organization:", error);
        throw error;
      }

      console.log("Organization added:", data);
      
      // Refresh both organizations and users to update member counts
      await Promise.all([
        onRefreshOrganizations(),
        onRefreshUsers()
      ]);
      
      // Clear the form input if it exists
      if (input) {
        input.value = '';
      }

      // Show success message
      onSuccess(`Organization "${name}" added successfully!`);
      
    } catch (err: any) {
      console.error("Error in addOrganization():", err);
      onError(`Failed to add organization: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteOrganization = async (orgId: number, orgName: string) => {
    try {
      setActionLoading(`delete-org-${orgId}`);
      onError("");
      console.log("Deleting organization:", orgId);

      // Check if organization has any users assigned to it
      const memberCount = getOrganizationMemberCount(orgId);
      if (memberCount > 0) {
        onError(`Cannot delete "${orgName}" because it has ${memberCount} member(s) assigned to it. Please reassign or remove these members first.`);
        return;
      }

      // Delete the organization
      const { error } = await supabase
        .from("organizations")
        .delete()
        .eq("id", orgId);

      if (error) {
        console.error("Error deleting organization:", error);
        throw error;
      }

      console.log("Organization deleted successfully");
      
      // Refresh the organizations list
      await onRefreshOrganizations();
      
      // Show success message
      onSuccess(`Organization "${orgName}" deleted successfully!`);
      
    } catch (err: any) {
      console.error("Error in handleDeleteOrganization():", err);
      onError(`Failed to delete organization: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      {/* Organizations Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrgSort('id')}
              >
                ID {renderOrgSortIndicator('id')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrgSort('name')}
              >
                Organization Name {renderOrgSortIndicator('name')}
              </th>
              <th 
                className="px-3 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrgSort('members')}
              >
                Members {renderOrgSortIndicator('members')}
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Colors
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOrganizations.map((org) => (
              <tr key={org.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {org.id}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {org.name}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getOrganizationMemberCount(org.id)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/admin/organization-colors?organizationId=${org.id}`}>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      Edit Colors
                    </button>
                  </Link>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${org.name}"?`)) {
                        handleDeleteOrganization(org.id, org.name);
                      }
                    }}
                    disabled={actionLoading === `delete-org-${org.id}`}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {actionLoading === `delete-org-${org.id}` ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Organization Form */}
      <div className="mt-8 mx-6 p-6 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Add New Organization</h3>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label htmlFor="org-name" className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              id="org-name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter organization name..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  const name = input.value.trim();
                  if (name) {
                    addOrganization();
                    input.value = '';
                  }
                }
              }}
            />
          </div>
          <button
            onClick={() => {
              const input = document.getElementById('org-name') as HTMLInputElement;
              const name = input.value.trim();
              if (name) {
                // Temporarily store the name for addOrganization to use
                (window as any).tempOrgName = name;
                addOrganization();
                input.value = '';
                delete (window as any).tempOrgName;
              } else {
                alert('Please enter an organization name');
              }
            }}
            disabled={actionLoading === "add-org"}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === "add-org" ? "Adding..." : "Add Organization"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationsTab; 