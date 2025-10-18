import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader, Sparkles } from 'lucide-react';
import { aiAPI } from '../api/ai';

interface Props {
  onClose: () => void;
}

export default function AIAssistant({ onClose }: Props) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ message: string; response: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [assistantName, setAssistantName] = useState('AI Assistant');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
    loadSettings();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const history = await aiAPI.getChatHistory();
      setMessages(history.slice(0, 10).reverse());
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await aiAPI.getSettings();
      setAssistantName(settings.assistantName);
    } catch (error) {
      console.error('Failed to load AI settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    const userQuestion = question;
    setQuestion('');

    try {
      const result = await aiAPI.ask(userQuestion);
      setMessages((prev) => [...prev, { message: userQuestion, response: result.answer }]);
    } catch (error) {
      console.error('Failed to get answer:', error);
      setMessages((prev) => [
        ...prev,
        { message: userQuestion, response: 'Sorry, I could not process your question.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "What's due today?",
    "What's due this week?",
    "Show me high-priority tasks",
    "How many tasks do I have?",
    "Do I have overdue tasks?",
  ];

  return (
    <div className="h-full flex flex-col card-modern rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <h3 className="font-bold text-white text-lg">{assistantName}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-300"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
              <Sparkles className="text-white" size={32} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Hi, I'm {assistantName}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6 px-4">
              I'll help you keep everything under control and get things done!
            </p>
            <div className="space-y-3 max-w-md mx-auto">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuestion(q)}
                  className="block w-full text-left px-5 py-3 text-sm bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] text-gray-700 dark:text-gray-300"
                >
                  <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs flex items-center justify-center mr-3 align-middle">
                    {i + 1}
                  </span>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="space-y-3 animate-fadeIn">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-lg">
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>
              {/* AI response */}
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-5 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm whitespace-pre-line leading-relaxed">{msg.response}</p>
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 px-5 py-3 rounded-2xl rounded-tl-sm shadow-lg border border-gray-200 dark:border-gray-700">
              <Loader className="animate-spin text-blue-600" size={20} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
