import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Check if Supabase credentials are properly configured
export const isSupabaseConfigured =
  typeof supabaseUrl === 'string' &&
  supabaseUrl.startsWith('https://') &&
  typeof supabaseKey === 'string' &&
  supabaseKey.length > 10;

// Only create the client if credentials exist, otherwise use a dummy fallback
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Helper functions for products
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data;
};

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  return data;
};

export const addProduct = async (product) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();
  
  if (error) {
    console.error('Error adding product:', error);
    return null;
  }
  
  return data[0];
};

export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating product:', error);
    return null;
  }
  
  return data[0];
};

export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  
  return true;
};

// Orders
export const createOrder = async (order) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select();
  
  if (error) {
    console.error('Error creating order:', error);
    return null;
  }
  
  return data[0];
};

export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating order:', error);
    return null;
  }
  
  return data[0];
};
