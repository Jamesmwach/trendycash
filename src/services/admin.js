import { supabase } from './supabase.js';

// --- Dashboard ---
export async function getDashboardStats() {
  const [
    { count: totalUsers },
    { data: totalRevenueData },
    { data: pendingWithdrawalsData },
    { count: activeSubscriptions }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('transactions').select('amount').eq('type', 'subscription_payment').eq('status', 'completed'),
    supabase.from('transactions').select('amount').eq('type', 'withdrawal').eq('status', 'pending'),
    supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
  ]);

  const totalRevenue = totalRevenueData?.reduce((sum, t) => sum + t.amount, 0) || 0;
  const pendingWithdrawals = pendingWithdrawalsData?.reduce((sum, t) => sum + t.amount, 0) || 0;

  return { totalUsers, totalRevenue, pendingWithdrawals, activeSubscriptions };
}


// --- User Management ---
export async function getAllUsers(page = 1, limit = 10) {
  const { data, error, count } = await supabase
    .from('profiles')
    .select('*, user_subscriptions(status, subscription_plans(name))', { count: 'exact' })
    .range((page - 1) * limit, page * limit - 1)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return { users: data, count };
}

// --- Trivia Management ---
export async function getTrivia() {
  const { data, error } = await supabase.from('trivia_questions').select('*, trivia_categories(name)').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getTriviaById(id) {
    const { data, error } = await supabase.from('trivia_questions').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
}

export async function getTriviaCategories() {
    const { data, error } = await supabase.from('trivia_categories').select('*');
    if (error) throw error;
    return data;
}

export async function createTrivia(questionData) {
  const { data, error } = await supabase.from('trivia_questions').insert(questionData).select().single();
  if (error) throw error;
  return data;
}

export async function updateTrivia(id, questionData) {
    const { data, error } = await supabase.from('trivia_questions').update(questionData).eq('id', id).select().single();
    if (error) throw error;
    return data;
}

export async function deleteTrivia(id) {
    const { error } = await supabase.from('trivia_questions').delete().eq('id', id);
    if (error) throw error;
}

// --- Article Management ---
export async function getAdminArticles() {
  const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getArticleById(id) {
    const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
}

export async function createArticle(articleData) {
    const { data, error } = await supabase.from('articles').insert(articleData).select().single();
    if (error) throw error;
    return data;
}

export async function updateArticle(id, articleData) {
    const { data, error } = await supabase.from('articles').update(articleData).eq('id', id).select().single();
    if (error) throw error;
    return data;
}

export async function deleteArticle(id) {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw error;
}

// --- Transaction Management ---
export async function getTransactions(status = 'all') {
  let query = supabase.from('transactions').select('*, profiles(full_name, email)');
  if (status !== 'all') {
    query = query.eq('status', status);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateTransactionStatus(transactionId, newStatus) {
  const { data, error } = await supabase
    .from('transactions')
    .update({ status: newStatus, updated_at: new Date() })
    .eq('id', transactionId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// --- Subscription Plan Management ---
export async function getSubscriptionPlansAdmin() {
    const { data, error } = await supabase.from('subscription_plans').select('*').order('price');
    if (error) throw error;
    return data;
}

export async function getPlanById(id) {
    const { data, error } = await supabase.from('subscription_plans').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
}

export async function createPlan(planData) {
    const { data, error } = await supabase.from('subscription_plans').insert(planData).select().single();
    if (error) throw error;
    return data;
}

export async function updatePlan(id, planData) {
    const { data, error } = await supabase.from('subscription_plans').update(planData).eq('id', id).select().single();
    if (error) throw error;
    return data;
}

export async function deletePlan(id) {
    const { error } = await supabase.from('subscription_plans').delete().eq('id', id);
    if (error) throw error;
}

// --- Referrals Management ---
export async function getReferralStats() {
    const { count, error } = await supabase.from('referrals').select('*', { count: 'exact', head: true });
    if(error) throw error;
    // Placeholder for commission
    return { totalReferrals: count || 0, totalCommission: 12500 }; 
}

// --- Settings Management ---
export async function getSiteSettings() {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (error && error.code !== 'PGRST116') throw error; // Ignore if no settings row exists yet
    return data;
}

export async function updateSiteSettings(settingsData) {
    // Upsert ensures a row is created if it doesn't exist
    const { data, error } = await supabase.from('site_settings').upsert({ ...settingsData, id: 1 }).select().single();
    if (error) throw error;
    return data;
}
