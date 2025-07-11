import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatbotBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Halo! Ada yang bisa saya bantu?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simulasi typing indicator saat menunggu response backend
  const simulateTyping = () => {
    setIsTyping(true);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { from: 'user', text: input, timestamp: new Date() };
    setMessages(msgs => [...msgs, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);
    simulateTyping();
    try {
      const token = localStorage.getItem('token');
      console.debug('[ChatbotBubble] Token:', token);
      // Gunakan NEXT_PUBLIC_API_URL jika ada, fallback ke /api/chatbot
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const chatbotUrl = apiBase
        ? apiBase.replace(/\/$/, '') + '/chatbot'
        : 'https://api.yametbatamtiban.id/api/chatbot';
      const res = await fetch(chatbotUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ message: userMessage.text }),
      });
      console.debug('[ChatbotBubble] Request URL:', chatbotUrl);
      console.debug('[ChatbotBubble] Response status:', res.status);
      let data;
      try {
        data = await res.json();
        console.debug('[ChatbotBubble] Response JSON:', data);
      } catch (jsonErr) {
        console.error('[ChatbotBubble] Failed to parse JSON:', jsonErr);
        setMessages(msgs => [...msgs, { from: 'bot', text: 'Maaf, balasan server tidak valid.', timestamp: new Date() }]);
        setError('Invalid server response');
        setLoading(false);
        setIsTyping(false);
        return;
      }
      if (data.reply) {
        setMessages(msgs => [...msgs, { from: 'bot', text: data.reply, timestamp: new Date() }]);
      } else if (data.error) {
        setMessages(msgs => [...msgs, { from: 'bot', text: 'Maaf, terjadi kesalahan. Silakan coba lagi.', timestamp: new Date() }]);
        setError(data.error);
        console.error('[ChatbotBubble] Error from backend:', data.error);
      } else {
        setMessages(msgs => [...msgs, { from: 'bot', text: 'Maaf, tidak ada balasan dari server.', timestamp: new Date() }]);
        console.warn('[ChatbotBubble] No reply or error in response:', data);
      }
    } catch (e) {
      setMessages(msgs => [...msgs, { from: 'bot', text: 'Maaf, tidak dapat terhubung ke server.', timestamp: new Date() }]);
      setError('Network error');
      console.error('[ChatbotBubble] Network or fetch error:', e);
    }
    setLoading(false);
    setTimeout(() => setIsTyping(false), 800 + Math.random() * 1000); // Simulasi typing selesai setelah response
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Bubble Button */}
      {!open && (
        <button
          className="bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Buka Chatbot"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chatbox */}
      {open && (
        <div className="w-80 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Assistant</h3>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Tutup Chatbot"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-4 overflow-y-auto space-y-3 bg-white" style={{ maxHeight: 380, minHeight: 300 }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs ${msg.from === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${msg.from === 'user'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-900'
                      }`}
                  >
                    {msg.text}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none min-h-[40px] max-h-[120px]"
                placeholder="Ketik pesan..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!loading) sendMessage();
                  }
                }}
                disabled={loading}
                aria-label="Ketik pertanyaan"
                rows={1}
                style={{
                  height: 'auto',
                  minHeight: '40px',
                  maxHeight: '120px',
                  overflowY: input.length > 50 ? 'auto' : 'hidden'
                }}
                onInput={e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <button
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg p-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Hint text */}
            <div className="text-xs text-gray-500 mt-1">
              Tekan Enter untuk kirim, Shift+Enter untuk baris baru
            </div>

            {/* Error message */}
            {error && (
              <div className="text-xs text-red-600 mt-2">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 