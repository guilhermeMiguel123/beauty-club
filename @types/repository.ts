export type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  badge?: string | null;
  img: string;
};

// Este é o "Contrato" (Interface). 
// Ele diz: "Quem quiser gerenciar produtos precisa ter esses dois métodos obrigatórios".
export interface IProductRepository {
  getProducts(): Promise<Product[]>;
  saveProducts(products: Product[]): Promise<void>;
}