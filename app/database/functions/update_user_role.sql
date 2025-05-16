-- Update user role function
-- This function updates a user's role in both the auth.users metadata and the public.users table
-- Security check ensures only admins can change user roles
CREATE OR REPLACE FUNCTION update_user_role(p_user_id UUID, p_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
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
  
  -- Security check: only allow if current user is admin
  IF v_role != 'admin' THEN
    RAISE EXCEPTION 'Permission denied: Only admins can update user roles';
  END IF;

  -- Verify that the role is valid
  IF p_role NOT IN ('user', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: %', p_role;
  END IF;

  -- Update the auth.users metadata
  UPDATE auth.users
  SET raw_app_meta_data = 
    CASE 
      WHEN raw_app_meta_data IS NULL THEN 
        jsonb_build_object('role', p_role)
      ELSE
        jsonb_set(raw_app_meta_data, '{role}', to_jsonb(p_role))
    END
  WHERE id = p_user_id;

  -- Also update the public.users table to keep them in sync
  UPDATE public.users
  SET role = p_role
  WHERE id = p_user_id;

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$; 