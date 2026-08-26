'use server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_PIN = "2026";

// Cria o client de forma segura no servidor
const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Credenciais do Supabase ausentes.");
  return createClient(url, key, { auth: { persistSession: false } });
};

export async function getProductsServer() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('products').select('*');
    if (error) return [];
    return data || [];
  } catch (err) {
    return [];
  }
}

export async function addProductServer(productData: any, pin: string) {
  if (pin !== ADMIN_PIN) throw new Error("Acesso negado: PIN inválido.");
  
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { success: true, data };
}

export async function updateProductServer(id: number, productData: any, pin: string) {
  if (pin !== ADMIN_PIN) throw new Error("Acesso negado: PIN inválido.");

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { success: true, data };
}

export async function deleteProductServer(id: number, pin: string) {
  if (pin !== ADMIN_PIN) throw new Error("Acesso negado: PIN inválido.");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) throw new Error(error.message);
  return { success: true };
}