-- Update user role function
-- This function updates a user's role in both the auth.users metadata and the public.users table
CREATE OR REPLACE FUNCTION update_user_role(p_user_id UUID, p_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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