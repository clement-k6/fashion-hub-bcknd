import { supabase } from './supabaseClient';

export async function fetchRecommendations(preferences: {
  category?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  let query = supabase.from('fashionhub').select('*');

  if (preferences.category && preferences.category !== 'All') {
    query = query.eq('Category', preferences.category);
  }
  if (preferences.gender) {
    query = query.eq('Gender', preferences.gender);
  }
  if (preferences.minPrice) {
    query = query.gte('Price', preferences.minPrice);
  }
  if (preferences.maxPrice) {
    query = query.lte('Price', preferences.maxPrice);
  }

  const { data, error } = await query.limit(4);
  if (error) throw error;
  return data;
}