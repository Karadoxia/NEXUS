export interface VendorProduct {
  externalId: string;
  source: 'fakestore' | 'ebay' | 'serpapi';
  name: string;
  brand: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  image: string;
  images: string[];
  specs: Record<string, string>;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
}
