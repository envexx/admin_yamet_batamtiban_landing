import React, { useState } from 'react';

export default function ChatbotBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setMessages(msgs => [...msgs, { from: 'user', text: input }]);
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(msgs => [...msgs, { from: 'bot', text: data.reply }]);
      } else if (data.error) {
        setMessages(msgs => [...msgs, { from: 'bot', text: 'Maaf, terjadi kesalahan. Silakan coba lagi.' }]);
        setError(data.error);
      } else {
        setMessages(msgs => [...msgs, { from: 'bot', text: 'Maaf, tidak ada balasan dari server.' }]);
      }
    } catch (e) {
      setMessages(msgs => [...msgs, { from: 'bot', text: 'Maaf, tidak dapat terhubung ke server.' }]);
      setError('Network error');
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Bubble Button */}
      {!open && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl focus:outline-none"
          aria-label="Buka Chatbot"
          onClick={() => setOpen(true)}
        >
          <span>💬</span>
        </button>
      )}
      {/* Chatbox */}
      {open && (
        <div className="w-80 max-w-xs sm:max-w-sm bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <span className="font-semibold">Chatbot Gemini</span>
            <button
              className="text-white hover:text-gray-200 text-xl ml-2"
              aria-label="Tutup Chatbot"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 px-3 py-2 overflow-y-auto space-y-2 text-sm" style={{ maxHeight: 320 }}>
            {messages.length === 0 && (
              <div className="text-gray-400 text-center mt-8">Tanyakan apapun tentang data Anda!</div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.from === 'user'
                    ? 'text-right'
                    : 'text-left'
                }
              >
                <span
                  className={
                    msg.from === 'user'
                      ? 'inline-block bg-blue-100 text-blue-800 rounded-lg px-3 py-1 my-1'
                      : 'inline-block bg-gray-100 text-gray-800 rounded-lg px-3 py-1 my-1'
                  }
                >
                  <b>{msg.from === 'user' ? 'Anda' : 'Bot'}:</b> {msg.text}
                </span>
              </div>
            ))}
          </div>
          {/* Input */}
          <div className="border-t px-3 py-2 bg-gray-50 flex items-center gap-2">
            <input
              type="text"
              className="flex-1 rounded border px-2 py-1 focus:outline-none focus:ring focus:border-blue-400 text-sm"
              placeholder="Ketik pertanyaan..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
              disabled={loading}
              aria-label="Ketik pertanyaan"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 text-sm font-semibold disabled:opacity-50"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? '...' : 'Kirim'}
            </button>
          </div>
          {/* Error message */}
          {error && (
            <div className="text-xs text-red-500 px-3 pb-2">{error}</div>
          )}
        </div>
      )}
    </div>
  );
} 