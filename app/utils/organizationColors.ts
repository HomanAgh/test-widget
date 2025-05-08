import { createClient } from "@/app/utils/supabase/client";

export interface ColorPreferences {
  headerTextColor: string;
  backgroundColor: string;
  textColor: string;
  tableBackgroundColor: string;
  nameTextColor: string;
}

// Default colors matching your existing app
export const DEFAULT_COLORS: ColorPreferences = {
  headerTextColor: "#FFFFFF",
  backgroundColor: "#052D41",
  textColor: "#000000",
  tableBackgroundColor: "#FFFFFF",
  nameTextColor: "#0D73A6",
};

// Ensure a complete color preferences object
function normalizeColorData(colors: any): ColorPreferences {
  // If colors is a string, try to parse it
  if (typeof colors === 'string') {
    try {
      colors = JSON.parse(colors);
    } catch (e) {
      console.error("Failed to parse color string:", e);
      return { ...DEFAULT_COLORS };
    }
  }
  
  // Ensure we have an object
  if (!colors || typeof colors !== 'object') {
    return { ...DEFAULT_COLORS };
  }

  // Create a new object with defaults
  const result: ColorPreferences = { 
    headerTextColor: DEFAULT_COLORS.headerTextColor,
    backgroundColor: DEFAULT_COLORS.backgroundColor,
    textColor: DEFAULT_COLORS.textColor,
    tableBackgroundColor: DEFAULT_COLORS.tableBackgroundColor,
    nameTextColor: DEFAULT_COLORS.nameTextColor
  };
  
  // Override with any valid colors from the input
  if (colors.headerTextColor && typeof colors.headerTextColor === 'string') {
    result.headerTextColor = colors.headerTextColor;
  }
  
  if (colors.backgroundColor && typeof colors.backgroundColor === 'string') {
    result.backgroundColor = colors.backgroundColor;
  }
  
  if (colors.textColor && typeof colors.textColor === 'string') {
    result.textColor = colors.textColor;
  }
  
  if (colors.tableBackgroundColor && typeof colors.tableBackgroundColor === 'string') {
    result.tableBackgroundColor = colors.tableBackgroundColor;
  }
  
  if (colors.nameTextColor && typeof colors.nameTextColor === 'string') {
    result.nameTextColor = colors.nameTextColor;
  }
  
  return result;
}

// Fetch organization colors directly from Supabase
export async function getOrganizationColors(organizationId: number): Promise<ColorPreferences> {
  if (!organizationId) {
    return { ...DEFAULT_COLORS };
  }

  const supabase = createClient();

  try {
    // Fetch organization colors directly (no user check needed)
    const { data, error } = await supabase
      .from('organization_preferences')
      .select('colors')
      .eq('organization_id', organizationId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') { 
        // No preferences found, return defaults
        return { ...DEFAULT_COLORS };
      }
      console.error("Error fetching organization colors:", error);
      return { ...DEFAULT_COLORS };
    }

    if (!data || !data.colors) {
      return { ...DEFAULT_COLORS };
    }
    
    // Normalize the returned color data
    return normalizeColorData(data.colors);
  } catch (error) {
    console.error("Unexpected error getting organization colors:", error);
    return { ...DEFAULT_COLORS };
  }
}

// Save organization colors - requires admin access
export async function saveOrganizationColors(
  organizationId: number, 
  colors: ColorPreferences
): Promise<boolean> {
  if (!organizationId) {
    console.error("Cannot save colors: Missing organization ID");
    return false;
  }

  try {
    const supabase = createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("Authentication error:", userError);
      return false;
    }
    
    // Check if user is an admin
    const { data: userRoleData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userData.user.id)
      .single();
      
    if (roleError) {
      console.error("Error checking user role:", roleError);
      return false;
    }
    
    if (userRoleData.role !== 'admin') {
      console.error("User is not an admin");
      return false;
    }
    
    // Make sure colors object has all required fields
    const normalizedColors = normalizeColorData(colors);
    
    // Save to Supabase
    const { error } = await supabase
      .from('organization_preferences')
      .upsert({
        organization_id: organizationId,
        colors: normalizedColors,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'organization_id'
      });
      
    if (error) {
      console.error("Error saving organization colors:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error saving organization colors:", error);
    return false;
  }
} 