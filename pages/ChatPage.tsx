
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { startFinancialChat } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      const user = api.getCurrentUser();
      if (!user) return;
      const tx = api.getTransactions(user.id);
      const session = await startFinancialChat(tx);
      setChatSession(session);
      setMessages([{ role: 'model', parts: [{ text: "Hi! I'm your R2R Assistant. I've analyzed your recent spending. Ask me anything, like 'How much did I spend on groceries this month?' or 'Can I afford a new gadget?'" }] }]);
    };
    initChat();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSession || loading) return;

    const userMsg: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: input });
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: result.text || "I couldn't process that. Try again?" }] }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Connection lost. Please refresh." }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-10rem)]">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-slate-900">AI Financial Chat</h2>
          <p className="text-slate-500">Ask questions about your spending and budgets.</p>
        </div>

        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-5 py-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}>
                  <p className="text-sm font-medium leading-relaxed">{msg.parts[0].text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 px-5 py-3 rounded-2xl rounded-bl-none animate-pulse">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={handleSend} className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
            <input
              type="text"
              className="flex-1 px-5 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 bg-white text-slate-900 font-medium"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
