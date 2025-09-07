import { supabase, updateUserProfile as supabaseUpdateUserProfile } from './supabase.js';

// --- Dashboard & Profile ---
export async function getUserDashboardData(userId) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, avatar_url, user_subscriptions(*, subscription_plans(*))')
    .eq('id', userId)
    .single();

  if (profileError) throw profileError;

  // Calculate balance from transactions
  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (transactionsError) throw transactionsError;

  const balance = transactions.reduce((acc, t) => {
    if (['deposit', 'earning', 'referral_commission'].includes(t.type)) {
      return acc + t.amount;
    } else if (['withdrawal', 'subscription_payment'].includes(t.type)) {
      return acc - t.amount;
    }
    return acc;
  }, 0);

  profile.balance = balance;

  return profile;
}

export async function updateUserProfile(userId, updates) {
  return await supabaseUpdateUserProfile(userId, updates);
}

export async function uploadProfilePicture(userId, file) {
    const { uploadFile } = await import('./supabase.js');
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const avatarUrl = await uploadFile('avatars', filePath, file);

    // Update profile with new avatar URL
    const updatedProfile = await updateUserProfile(userId, { avatar_url: avatarUrl });
    return updatedProfile;
}

// --- Content (Trivia & Articles) ---
export async function getAvailableArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getArticleById(id) {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
}

export async function getAvailableTriviaCategories() {
    const { data, error } = await supabase
        .from('trivia_categories')
        .select(`
            *,
            trivia_questions(count)
        `)
        .order('name');
    
    if (error) throw error;
    return data;
}

export async function getTriviaQuestions(categoryId, limit = 5) {
    let query = supabase.from('trivia_questions').select('*').limit(limit);
    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }
    // Add randomization in a real app, e.g., using a view or function
    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function logEarning(userId, amount, description) {
    const { data, error } = await supabase.from('transactions').insert({
        user_id: userId,
        amount: amount,
        type: 'earning',
        status: 'completed',
        description: description,
    });
    if (error) throw error;
    return data;
}


// --- Subscriptions ---
export async function getSubscriptionPlans() {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function getPlanById(id) {
    const { data, error } = await supabase.from('subscription_plans').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
}

export async function createSubscriptionPayment(userId, plan) {
    const { data, error } = await supabase.from('transactions').insert({
        user_id: userId,
        amount: plan.price,
        type: 'subscription_payment',
        status: 'pending',
        description: `Payment for ${plan.name} plan`,
        metadata: { plan_id: plan.id }
    }).select().single();
    if (error) throw error;
    return data;
}

// --- Transactions & Bank Details ---
export async function getUserTransactions(userId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getBankDetails() {
    const { data, error } = await supabase.from('site_settings').select('bank_details').eq('id', 1).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data?.bank_details || {};
}

export async function requestWithdrawal(userId, amount, details) {
    const { data, error } = await supabase.from('transactions').insert({
        user_id: userId,
        amount: amount,
        type: 'withdrawal',
        status: 'pending',
        description: `Withdrawal request. Details: ${details}`,
    }).select().single();
    if (error) throw error;
    return data;
}
