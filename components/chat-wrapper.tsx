'use client';

import dynamic from 'next/dynamic';
const ChatAssistant = dynamic(() => import('./chat-assistant').then(m => m.ChatAssistant), { ssr: false });

export default function ChatWrapper() {
  return <ChatAssistant />;
}
