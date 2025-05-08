"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import {
  ColorPreferences,
  DEFAULT_COLORS,
  saveOrganizationColors,
} from "@/app/utils/organizationColors";
import HexColors from "@/app/components/common/color-picker/HexColorsAndIframeHeight";
import Link from "next/link";

function OrganizationColorsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorPreferences>({ ...DEFAULT_COLORS });
  const [originalColors, setOriginalColors] = useState<ColorPreferences>({
    ...DEFAULT_COLORS,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [organizationName, setOrganizationName] = useState<string>("");
  const [organizations, setOrganizations] = useState<
    { id: number; name: string }[]
  >([]);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Get organizations for admin to select
  const fetchOrganizations = async (userId: string) => {
    try {
      // First check if user is admin
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (userError || userData?.role !== "admin") {
        router.push("/dashboard");
        return [];
      }

      // Get organizations
      const { data, error } = await supabase
        .from("organizations")
        .select("id, name")
        .order("name");

      if (error) {
        throw error;
      }

      setOrganizations(data || []);
      return data || [];
    } catch (err) {
      console.error("Error fetching organizations:", err);
      setError("Failed to load organizations");
      return [];
    }
  };

  // Load organization colors
  const loadOrganizationColors = async (orgId: number) => {
    try {
      // Get organization name
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("name")
        .eq("id", orgId)
        .single();

      if (!orgError && orgData) {
        setOrganizationName(orgData.name);
      }

      // Get current colors
      const { data: colorData, error: colorError } = await supabase
        .from("organization_preferences")
        .select("colors")
        .eq("organization_id", orgId)
        .single();

      console.log("Raw color data from DB:", colorData?.colors);
      setDebugInfo(
        (prev) =>
          `${prev || ""}Raw colors: ${JSON.stringify(
            colorData?.colors || {}
          )}\n`
      );

      if (!colorError && colorData?.colors) {
        try {
          // Ensure we have valid color data
          const loadedColors = { ...DEFAULT_COLORS };
          const colorsObj = colorData.colors;

          // Copy properties that exist
          if (colorsObj.headerTextColor)
            loadedColors.headerTextColor = colorsObj.headerTextColor;
          if (colorsObj.backgroundColor)
            loadedColors.backgroundColor = colorsObj.backgroundColor;
          if (colorsObj.textColor) loadedColors.textColor = colorsObj.textColor;
          if (colorsObj.tableBackgroundColor)
            loadedColors.tableBackgroundColor = colorsObj.tableBackgroundColor;
          if (colorsObj.nameTextColor)
            loadedColors.nameTextColor = colorsObj.nameTextColor;

          console.log("Normalized colors:", loadedColors);
          setDebugInfo(
            (prev) =>
              `${prev || ""}Normalized: ${JSON.stringify(loadedColors)}\n`
          );

          setColors(loadedColors);
          setOriginalColors(loadedColors);
        } catch (parseError) {
          console.error("Error parsing color data:", parseError);
          setDebugInfo(
            (prev) => `${prev || ""}Error parsing: ${String(parseError)}\n`
          );

          // Fallback to defaults
          setColors({ ...DEFAULT_COLORS });
          setOriginalColors({ ...DEFAULT_COLORS });
        }
      } else {
        // If not found, set defaults
        console.log("No color preferences found, using defaults");
        setDebugInfo((prev) => `${prev || ""}Using defaults (no data found)\n`);
        setColors({ ...DEFAULT_COLORS });
        setOriginalColors({ ...DEFAULT_COLORS });
      }
    } catch (err) {
      console.error("Error loading organization colors:", err);
      setError("Failed to load organization colors");
    }
  };

  // Initialize page and fetch data
  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo(null);

        // Check authentication
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        setDebugInfo(`User ID: ${user.id}\n`);

        // Fetch available organizations
        const orgs = await fetchOrganizations(user.id);

        // Check for organization ID in URL params
        const paramOrgId = searchParams.get("organizationId");

        // If org ID is provided in URL and it's valid, use it
        if (paramOrgId && orgs.some((org) => org.id === parseInt(paramOrgId))) {
          const orgId = parseInt(paramOrgId);
          setOrganizationId(orgId);
          setDebugInfo(
            (prev) => `${prev || ""}Loading org from URL param: ${orgId}\n`
          );
          await loadOrganizationColors(orgId);
        }
        // Otherwise get admin's organization
        else {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("organization_id")
            .eq("id", user.id)
            .single();

          if (!userError && userData?.organization_id) {
            setOrganizationId(userData.organization_id);
            setDebugInfo(
              (prev) =>
                `${prev || ""}Loading user's org: ${userData.organization_id}\n`
            );
            await loadOrganizationColors(userData.organization_id);
          }
        }
      } catch (err) {
        console.error("Error initializing page:", err);
        setError("An error occurred while loading the page");
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router, supabase, searchParams]);

  // Handle organization change
  const handleOrganizationChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newOrgId = parseInt(e.target.value);
    if (newOrgId) {
      setOrganizationId(newOrgId);
      setLoading(true);
      setDebugInfo(`Loading org: ${newOrgId} from dropdown change\n`);
      await loadOrganizationColors(newOrgId);
      setLoading(false);

      // Update URL without reload
      router.push(`/admin/organization-colors?organizationId=${newOrgId}`, {
        scroll: false,
      });
    }
  };

  // Save colors
  const handleSave = async () => {
    if (!organizationId) {
      setError("Please select an organization first");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Make sure all required color properties exist
      const completeColors: ColorPreferences = {
        headerTextColor:
          colors.headerTextColor || DEFAULT_COLORS.headerTextColor,
        backgroundColor:
          colors.backgroundColor || DEFAULT_COLORS.backgroundColor,
        textColor: colors.textColor || DEFAULT_COLORS.textColor,
        tableBackgroundColor:
          colors.tableBackgroundColor || DEFAULT_COLORS.tableBackgroundColor,
        nameTextColor: colors.nameTextColor || DEFAULT_COLORS.nameTextColor,
      };

      console.log("Saving colors:", completeColors);
      setDebugInfo(
        (prev) => `${prev || ""}Saving: ${JSON.stringify(completeColors)}\n`
      );

      const success = await saveOrganizationColors(
        organizationId,
        completeColors
      );

      if (success) {
        setSuccess(true);
        setOriginalColors({ ...completeColors });
        setTimeout(() => setSuccess(false), 3000);

        // Refresh colors from DB to confirm save
        await loadOrganizationColors(organizationId);
      } else {
        setError("Failed to save colors. Please try again.");
      }
    } catch (err) {
      console.error("Error saving colors:", err);
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    return JSON.stringify(colors) !== JSON.stringify(originalColors);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Organization Theme Settings</h1>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <Link
          href="/admin"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Organization Theme Settings</h1>
        <p className="text-gray-600 mb-4">
          Customize the default colors for all widgets in your organization
        </p>

        <div className="mb-4 max-w-md">
          <label
            htmlFor="organization"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Organization:
          </label>
          <select
            id="organization"
            value={organizationId || ""}
            onChange={handleOrganizationChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select an organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Colors saved successfully!
        </div>
      )}

      {debugInfo && (
        <details className="mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded">
          <summary className="cursor-pointer text-sm font-medium">
            Debug Information
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {debugInfo}
          </pre>
        </details>
      )}

      {organizationId ? (
        <>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">
                Theme Colors for {organizationName}
              </h2>
              <p className="text-gray-600 mb-4">
                These colors will be the default for all widgets created by
                users in your organization.
              </p>

              <HexColors customColors={colors} setCustomColors={setColors} />
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges()}
                className={`px-4 py-2 rounded font-medium text-white ${
                  saving || !hasChanges()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving ? "Saving..." : "Save Theme"}
              </button>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.backgroundColor }}
            >
              <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                <h2
                  className="text-lg font-bold"
                  style={{ color: colors.headerTextColor }}
                >
                  Team Widget
                </h2>
              </div>

              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: colors.tableBackgroundColor }}
              >
                <div className="mb-2">
                  <div
                    className="grid grid-cols-4 gap-4 mb-2 font-semibold text-sm"
                    style={{ color: colors.textColor }}
                  >
                    <div>Player</div>
                    <div>Position</div>
                    <div>Team</div>
                    <div>Status</div>
                  </div>
                  <div className="border-t border-gray-200"></div>
                </div>

                <div
                  className="grid grid-cols-4 gap-4 py-2 text-sm"
                  style={{ color: colors.textColor }}
                >
                  <div style={{ color: colors.nameTextColor }}>John Smith</div>
                  <div>Forward</div>
                  <div>Chicago</div>
                  <div>Active</div>
                </div>

                <div
                  className="grid grid-cols-4 gap-4 py-2 text-sm border-t border-gray-100"
                  style={{ color: colors.textColor }}
                >
                  <div style={{ color: colors.nameTextColor }}>
                    Emma Johnson
                  </div>
                  <div>Defense</div>
                  <div>New York</div>
                  <div>Injured</div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded">
          Please select an organization to customize its colors.
        </div>
      )}
    </div>
  );
}

export default function OrgColorsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrganizationColorsContent />
    </Suspense>
  );
}
