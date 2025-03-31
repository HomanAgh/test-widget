'use server'

import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log(email, password);
  console.log(supabase);

  

  if (error) {
    return { error: error.message }
  }
  
  redirect('/home')
}