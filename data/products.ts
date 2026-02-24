
import { Product } from '@/types';

export const products: Product[] = [
    {
        id: 'p1',
        slug: 'neural-link-v4',
        name: 'Neural Link Interface v4',
        brand: 'NEXUS',
        price: 899,
        description: 'Direct brain-computer interface with sub-1ms latency. Features auto-calibration and wireless charging.',
        category: 'peripherals',
        images: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'],
        specs: {
            'Latency': '< 1ms',
            'Connection': 'Wireless',
            'Interface': 'Brain-Computer I/O',
            'Battery': '12h Active'
        },
        stock: 15,
        rating: 4.9,
        reviewCount: 128,
        isNew: true,
        featured: true,
        tags: ['neural', 'pro', 'nexus']
    },
    {
        id: 'p2',
        slug: 'quantum-core-workstation',
        name: 'Quantum Core Workstation',
        brand: 'NEXUS',
        price: 4500,
        description: 'Liquid-cooled quantum processing unit for heavy simulation loads. Comes with holographic display emitter.',
        category: 'workstations',
        images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80'],
        specs: {
            'CPU': '128 Qubits',
            'Cooling': 'Liquid Helium',
            'Display': 'Holographic',
            'Storage': '64TB NVMe'
        },
        stock: 5,
        rating: 5.0,
        reviewCount: 42,
        featured: true,
        tags: ['quantum', 'workstation', 'enterprise']
    },
    {
        id: 'p3',
        slug: 'cyberdeck-mk2',
        name: 'Cyberdeck Portable MK.II',
        brand: 'NEXUS',
        price: 1100,
        comparePrice: 1250,
        description: 'Ruggedized field terminal with mechanical keys and satellite uplink capability.',
        category: 'laptops',
        images: ['https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=80'],
        specs: {
            'Shell': 'Ruggedized Aluminum',
            'Keys': 'Mechanical (Brown)',
            'Uplink': 'SatGen-7',
            'Rating': 'IP68'
        },
        stock: 24,
        rating: 4.7,
        reviewCount: 356,
        tags: ['rugged', 'portable', 'satellite']
    },
    {
        id: 'p4',
        slug: 'optical-data-node',
        name: 'Optical Data Node',
        brand: 'NEXUS',
        price: 349,
        description: 'Next-gen mesh networking node with 100Gbps throughput and AI-driven traffic shaping.',
        category: 'networking',
        images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'],
        specs: {
            'Throughput': '100Gbps',
            'Mode': 'Mesh',
            'OS': 'Zero-Trust v2.1',
            'Intelligence': 'Self-Healing'
        },
        stock: 50,
        rating: 4.8,
        reviewCount: 89,
        tags: ['network', 'mesh', '100g']
    }
];

export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug);
