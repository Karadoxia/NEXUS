export type PartType = 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'case' | 'psu';

export interface Part {
    id: string;
    type: PartType;
    name: string;
    price: number;
    image: string;
    specs: Record<string, string>;
    compatibility?: {
        socket?: string;
        power?: number;
    };
}

export const PARTS: Record<PartType, Part[]> = {
    cpu: [
        {
            id: 'cpu-1',
            type: 'cpu',
            name: 'Intel Core Ultra 9 285K',
            price: 589,
            image: '/placeholder.jpg',
            specs: { 'Cores': '24', 'Boost': '5.7 GHz' },
            compatibility: { socket: 'LGA1851', power: 125 }
        },
        {
            id: 'cpu-2',
            type: 'cpu',
            name: 'AMD Ryzen 9 9950X',
            price: 649,
            image: '/placeholder.jpg',
            specs: { 'Cores': '16', 'Boost': '5.7 GHz' },
            compatibility: { socket: 'AM5', power: 170 }
        }
    ],
    gpu: [
        {
            id: 'gpu-1',
            type: 'gpu',
            name: 'NVIDIA RTX 5090',
            price: 1999,
            image: '/placeholder.jpg',
            specs: { 'VRAM': '32GB', 'Clock': '2.9 GHz' },
            compatibility: { power: 600 }
        },
        {
            id: 'gpu-2',
            type: 'gpu',
            name: 'AMD Radeon RX 8900 XTX',
            price: 999,
            image: '/placeholder.jpg',
            specs: { 'VRAM': '24GB', 'Clock': '3.1 GHz' },
            compatibility: { power: 355 }
        }
    ],
    motherboard: [
        {
            id: 'mb-1',
            type: 'motherboard',
            name: 'ASUS ROG MAXIMUS Z890',
            price: 699,
            image: '/placeholder.jpg',
            specs: { 'Format': 'ATX', 'WiFi': '7' },
            compatibility: { socket: 'LGA1851' }
        },
        {
            id: 'mb-2',
            type: 'motherboard',
            name: 'MSI MEG X870E GODLIKE',
            price: 1099,
            image: '/placeholder.jpg',
            specs: { 'Format': 'E-ATX', 'WiFi': '7' },
            compatibility: { socket: 'AM5' }
        }
    ],
    ram: [
        {
            id: 'ram-1',
            type: 'ram',
            name: 'G.SKILL Trident Z5 Royal 64GB',
            price: 299,
            image: '/placeholder.jpg',
            specs: { 'Speed': '8000 MT/s', 'Type': 'DDR5' }
        }
    ],
    storage: [
        {
            id: 'ssd-1',
            type: 'storage',
            name: 'Samsung 990 PRO 4TB',
            price: 349,
            image: '/placeholder.jpg',
            specs: { 'Speed': '7450 MB/s', 'Type': 'NVMe' }
        }
    ],
    case: [
        {
            id: 'case-1',
            type: 'case',
            name: 'HYTE Y70 Touch',
            price: 359,
            image: '/placeholder.jpg',
            specs: { 'Type': 'Mid Tower', 'Color': 'Black' }
        }
    ],
    psu: [
        {
            id: 'psu-1',
            type: 'psu',
            name: 'Corsair AX1600i',
            price: 609,
            image: '/placeholder.jpg',
            specs: { 'Wattage': '1600W', 'Rating': 'Titanium' }
        }
    ]
};
