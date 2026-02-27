export type AiIntent = 'NAVIGATE' | 'SEARCH' | 'SUPPORT' | 'CHAT' | 'CHECK_ORDER';

export interface AiResponse {
    text: string;
    intent: AiIntent;
    data?: string; // URL to navigate to, or search query
}

const KNOWLEDGE_BASE = {
    shipping: "We offer free EU shipping on orders over €99. Standard delivery takes 3-5 business days.",
    returns: "You have 30 days to return any item in its original condition. We cover the return shipping.",
    warranty: "All NEXUS products come with a comprehensive 2-year manufacturer warranty.",
    contact: "You can reach our human support team at support@nexus.dev or +33 1 23 45 67 89.",
    about: "NEXUS is the premier destination for next-gen neural interfaces and quantum hardware.",
};

export async function processAiMessage(input: string): Promise<AiResponse> {
    const lower = input.toLowerCase();

    // simulate network delay (typing effect)
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

    // 1. Navigation Intents
    if (lower.includes('home')) return { text: "Navigating to homepage...", intent: 'NAVIGATE', data: '/' };
    if (lower.includes('store') || lower.includes('shop') || lower.includes('catalog')) return { text: "Opening the catalog...", intent: 'NAVIGATE', data: '/store' };
    if (lower.includes('cart') || lower.includes('checkout')) return { text: "Taking you to your cart.", intent: 'NAVIGATE', data: '/store?cart=open' }; // We'll handle 'cart=open' in layout or just assume user clicks drawer
    if (lower.includes('account') || lower.includes('profile')) return { text: "Opening your account dashboard.", intent: 'NAVIGATE', data: '/account' };
    if (lower.includes('track') || lower.includes('order')) return { text: "Let's check your orders.", intent: 'NAVIGATE', data: '/account' };

    // 2. Search Intents ("show me laptops", "find neural link", "looking for monitors")
    // Match the trigger phrase and capture everything that follows it as the query.
    // The old approach (replace individual words) corrupted words that contained
    // trigger substrings, e.g. "show me gaming monitors" → "  gaming nitors".
    const searchMatch = input.match(
      /(?:show\s+me|find|search\s+(?:for)?|looking\s+for)\s+(.+)/i
    );
    if (searchMatch) {
        const query = searchMatch[1].trim();
        return {
            text: `Searching for "${query}"...`,
            intent: 'SEARCH',
            data: query,
        };
    }

    // 3. Knowledge Base
    if (lower.includes('shipping') || lower.includes('deliver')) return { text: KNOWLEDGE_BASE.shipping, intent: 'SUPPORT' };
    if (lower.includes('return') || lower.includes('refund')) return { text: KNOWLEDGE_BASE.returns, intent: 'SUPPORT' };
    if (lower.includes('warranty') || lower.includes('guarantee')) return { text: KNOWLEDGE_BASE.warranty, intent: 'SUPPORT' };
    if (lower.includes('contact') || lower.includes('support') || lower.includes('help')) return { text: KNOWLEDGE_BASE.contact, intent: 'SUPPORT' };
    if (lower.includes('who are you') || lower.includes('what is nexus')) return { text: KNOWLEDGE_BASE.about, intent: 'CHAT' };

    // 4. Fallback / chit-chat
    const fallbacks = [
        "I can help you find products, track orders, or answer shipping questions.",
        "System online. How can I assist you with your neural upgrade today?",
        "I'm optimized for product discovery. Try asking 'Show me neural links'.",
    ];

    return {
        text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
        intent: 'CHAT'
    };
}
