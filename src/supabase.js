import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')

// Upload image to wall-images bucket
export async function uploadWallImage(file, wallId) {
  const ext = file.name.split('.').pop()
  const path = `${wallId}/${Date.now()}.${ext}`
  const { data, error } = await supabase.storage.from('wall-images').upload(path, file)
  if (error) throw error
  const { data: urlData } = supabase.storage.from('wall-images').getPublicUrl(path)
  return { path, url: urlData.publicUrl }
}
