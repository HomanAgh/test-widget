-- Delete user function
-- This function deletes a user from both auth.users and public.users tables
-- Security check ensures only admins or users themselves can delete accounts
CREATE OR REPLACE FUNCTION delete_user(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  success BOOLEAN := FALSE;
  v_role TEXT;
  v_current_user_id UUID;
BEGIN
  -- Get the current authenticated user's ID
  v_current_user_id := auth.uid();
  
  -- Check if authenticated user exists
  IF v_current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Get the role of the current authenticated user
  SELECT role INTO v_role FROM public.users WHERE id = v_current_user_id;
  
  -- Security check: only allow if current user is admin or deleting their own account
  IF NOT (v_role = 'admin' OR v_current_user_id = p_user_id) THEN
    RAISE EXCEPTION 'Permission denied: Only admins or users themselves can delete accounts';
  END IF;
  
  -- Delete the user from auth.users using admin API
  PERFORM supabase_admin.delete_user(p_user_id);
  
  -- Delete from public.users table
  DELETE FROM public.users
  WHERE id = p_user_id;
  
  success := TRUE;
  RETURN success;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error deleting user: %', SQLERRM;
END;
$$; 