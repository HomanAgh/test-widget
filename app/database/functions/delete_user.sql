-- Delete user function
-- This function deletes a user from both auth.users and public.users tables
CREATE OR REPLACE FUNCTION delete_user(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  success BOOLEAN := FALSE;
BEGIN
  -- Delete the user from the auth.users table using the admin API
  -- This properly removes the user from Supabase Auth
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