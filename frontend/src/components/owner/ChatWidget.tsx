'use client';

import { useState } from 'react';
import { Send, Bot, X } from 'lucide-react';
import { chatAPI } from '@/services/api';

type Message = {
  id: number;
  from: 'user' | 'ai';
  text: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: 'ai',
      text: 'Xin chào! Tôi là VNU Pet AI Assistant 🐾. Bạn có thể hỏi tôi về sức khỏe, dinh dưỡng, tiêm phòng, hành vi của thú cưng.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      from: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatAPI.askPetAI({ message: trimmed });
      const replyText = res.data?.reply ?? 'Xin lỗi, hiện tôi không thể trả lời.';

      const aiMessage: Message = {
        id: Date.now() + 1,
        from: 'ai',
        text: replyText,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          from: 'ai',
          text: 'Có lỗi xảy ra khi gọi AI. Vui lòng thử lại sau.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Nút nổi góc phải */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 shadow-xl text-white w-14 h-14 flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X size={22} /> : <Bot size={26} />}
      </button>

      {/* Panel chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-80 max-h-[70vh] bg-white shadow-2xl rounded-2xl border border-orange-100 flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-gradient-to-r from-orange-50 to-pink-50 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white">
                <Bot size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  VNU Pet AI Assistant
                </p>
                <p className="text-[11px] text-gray-500">
                  Trả lời câu hỏi về thú cưng 24/7
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm bg-orange-50/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.from === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                    m.from === 'user'
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-orange-100 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl bg-white border border-orange-100 text-gray-500 text-xs">
                  Đang suy nghĩ...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t px-3 py-2 bg-white rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi về thú cưng..."
                className="flex-1 text-sm px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-300 text-gray-800"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="p-2 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white disabled:opacity-60"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="mt-1 text-[10px] text-gray-400">
              ⚠️ AI chỉ hỗ trợ tham khảo, không thay thế chẩn đoán của bác sĩ thú y.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
