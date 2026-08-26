import { SupabaseProductRepository } from './supabaseProductRepository';
import { Product } from '@/@types/repository';

export class ProductService {
  constructor(private productRepo: SupabaseProductRepository) {}

  async loadProducts(): Promise<Product[]> {
    return await this.productRepo.getProducts();
  }

  async createProduct(productData: Omit<Product, 'id'>): Promise<boolean> {
    const result = await this.productRepo.addProduct(productData);
    return result !== null;
  }

  async removeProduct(id: number): Promise<boolean> {
    return await this.productRepo.deleteProduct(id);
  }
}

export const productService = new ProductService(new SupabaseProductRepository());