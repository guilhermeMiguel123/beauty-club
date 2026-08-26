import { createClient } from '@supabase/supabase-js';
import { IProductRepository, Product } from '@/@types/repository';

// Inicializa o Supabase (certifique-se de usar suas variáveis de ambiente)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export class SupabaseProductRepository implements IProductRepository {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Erro ao buscar produtos:', error.message);
      return [];
    }
    return data || [];
  }

  async saveProducts(products: Product[]): Promise<void> {
    // No Supabase real, geralmente salvamos item por item ou fazemos upsert.
    // Aqui mantemos a assinatura compatível com o contrato.
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao adicionar:', error.message);
      return null;
    }
    return data;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Erro ao excluir:', error.message);
      return false;
    }
    return true;
  }
}