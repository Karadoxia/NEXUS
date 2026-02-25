'use client';

import { useEffect, useState, useRef } from 'react';

// very basic floating chat box skeleton
export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{from:'user'|'bot';text:string}[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const send = async () => {
    const text = inputRef.current?.value;
    if (!text) return;
    setMessages(m => [...m, {from:'user', text}]);
    inputRef.current!.value = '';
    // call backend /api/assistant
    const res = await fetch('/api/assistant', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text})});
    const data = await res.json();
    setMessages(m => [...m, {from:'bot', text: data.reply || '...' }]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-64 h-96 bg-slate-900 border border-slate-700 rounded-xl flex flex-col">
          <div className="p-2 bg-slate-800 flex justify-between items-center">
            <span className="font-bold">Neuromancer</span>
            <button onClick={()=>setOpen(false)} className="text-red-400">x</button>
          </div>
          <div className="p-2 flex-1 overflow-y-auto space-y-2">
            {messages.map((m,i)=>(
              <div key={i} className={m.from==='user'?'text-right':'text-left'}><span className="inline-block px-2 py-1 rounded bg-slate-700">{m.text}</span></div>
            ))}
          </div>
          <div className="p-2 border-t border-slate-700 flex gap-2">
            <input ref={inputRef} className="flex-1 bg-slate-800 p-1 rounded" placeholder="Ask..." />
            <button onClick={send} className="bg-cyan-500 px-3 rounded">Send</button>
          </div>
        </div>
      ) : (
        <button onClick={()=>setOpen(true)} className="bg-cyan-600 p-3 rounded-full shadow-lg">💬</button>
      )}
    </div>
  );
}
