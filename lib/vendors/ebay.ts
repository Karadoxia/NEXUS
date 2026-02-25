// eBay Browse API — free tier, requires eBay developer account
// Sign up: https://developer.ebay.com  →  Create App  →  get Client ID + Secret
import type { VendorProduct } from './types';

const EBAY_TOKEN_URL = 'https://api.ebay.com/identity/v1/oauth2/token';
const EBAY_SEARCH_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search';
const EBAY_SCOPE = 'https://api.ebay.com/oauth/api_scope';

// Token is cached in memory for the lifetime of the process
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;

  const clientId     = process.env.EBAY_CLIENT_ID!;
  const clientSecret = process.env.EBAY_CLIENT_SECRET!;
  const credentials  = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(EBAY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization:  `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&scope=${encodeURIComponent(EBAY_SCOPE)}`,
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`eBay auth failed: ${res.status}`);
  const data = await res.json();

  cachedToken = {
    value:     data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

const KNOWN_BRANDS = [
  'Apple','Samsung','Sony','Dell','HP','Lenovo','ASUS','Acer',
  'Microsoft','LG','Razer','Logitech','Corsair','Intel','AMD','NVIDIA',
];

function extractBrand(title: string): string {
  for (const b of KNOWN_BRANDS) {
    if (title.toLowerCase().includes(b.toLowerCase())) return b;
  }
  return 'Unknown';
}

function mapCategory(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes('laptop') || c.includes('notebook'))           return 'laptops';
  if (c.includes('monitor') || c.includes('display'))           return 'monitors';
  if (c.includes('keyboard') || c.includes('mouse') || c.includes('headphone') || c.includes('headset')) return 'peripherals';
  if (c.includes('router') || c.includes('switch') || c.includes('network')) return 'networking';
  if (c.includes('ssd') || c.includes('hdd') || c.includes('storage') || c.includes('drive')) return 'storage';
  if (c.includes('workstation') || c.includes('desktop'))       return 'workstations';
  if (c.includes('gpu') || c.includes('cpu') || c.includes('ram') || c.includes('processor')) return 'components';
  return 'components';
}

export async function fetchEbayProducts(query = 'tech electronics'): Promise<VendorProduct[]> {
  if (!process.env.EBAY_CLIENT_ID || !process.env.EBAY_CLIENT_SECRET) {
    console.warn('[ebay] EBAY_CLIENT_ID or EBAY_CLIENT_SECRET not set — skipping');
    return [];
  }

  const token = await getAccessToken();
  const url   = `${EBAY_SEARCH_URL}?q=${encodeURIComponent(query)}&limit=40&filter=conditionIds:{1000|1500|2000}`;

  const res = await fetch(url, {
    headers: {
      Authorization:             `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'Content-Type':            'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`eBay search failed: ${res.status}`);
  const data = await res.json();

  if (!data.itemSummaries?.length) return [];

  return data.itemSummaries.map((item: any) => {
    const categoryName = item.categories?.[0]?.categoryName ?? '';
    return {
      externalId:  item.itemId,
      source:      'ebay',
      name:        item.title,
      brand:       item.brand ?? extractBrand(item.title),
      description: item.shortDescription ?? item.title,
      price:       parseFloat(item.price?.value ?? '0'),
      category:    mapCategory(categoryName),
      image:       item.image?.imageUrl ?? '',
      images:      [
        item.image?.imageUrl,
        ...(item.additionalImages?.map((i: any) => i.imageUrl) ?? []),
      ].filter(Boolean),
      specs: {
        condition: item.condition ?? 'Used',
        location:  item.itemLocation?.country ?? '',
        category:  categoryName,
      },
      stock:       item.estimatedAvailabilities?.[0]?.estimatedAvailableQuantity ?? 10,
      rating:      parseFloat(item.sellerFeedbackScore ?? '0'),
      reviewCount: parseInt(item.feedbackPercentage ?? '0', 10),
      tags:        ['ebay', categoryName].filter(Boolean),
    };
  });
}
