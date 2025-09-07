import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xdopsuvwxlnhqyqnzuvw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhkb3BzdXZ3eGxuaHF5cW56dXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODYzODAsImV4cCI6MjA3Mjc2MjM4MH0.frPp__CkccWq13TYnbKwDGFXNdKu-ZHimzkQEaoSpy8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createSupabaseClient() {
  return supabase;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signInWithPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
}

export async function signUpWithPassword(email, password, metadata = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/`
    }
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function uploadFile(bucket, path, file) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true, // Overwrite file if it exists
    });

  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getSubscriptionPlans() {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function getUserSubscription(userId) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select(`
      *,
      subscription_plans (*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getTriviaSessions(userId) {
  const { data, error } = await supabase
    .from('trivia_sessions')
    .select(`
      *,
      trivia_questions (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getUserTransactions(userId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getUserReferrals(userId) {
  const { data, error } = await supabase
    .from('referrals')
    .select(`
      *,
      profiles!referrals_referred_user_id_fkey (full_name, email)
    `)
    .eq('referrer_user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
