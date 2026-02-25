export type ProductCategory = 'peripherals' | 'laptops' | 'workstations' | 'monitors' | 'networking' | 'storage' | 'components' | 'accessories';

export interface Product {
    id: string;
    slug: string;
    name: string;
    brand: string;
    price: number;
    comparePrice?: number;
    description: string;
    category: ProductCategory;
    images: string[]; // Array of images
    specs: Record<string, string>; // More structured specs
    stock: number;
    rating: number;
    reviewCount: number;
    isNew?: boolean;
    featured?: boolean;
    tags: string[];
}

export type CartItem = Product & {
    quantity: number;
};

export interface Address {
    id?: string;
    label?: string;
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface Order {
    id: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    total: number;
    items: CartItem[];
    createdAt: string;
    address: Address;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    shipmentEvents?: {
        id: string;
        details: string;
        location: string;
        date: string;
        status: 'ordered' | 'shipped' | 'in-transit' | 'out-for-delivery' | 'delivered';
    }[];
}
