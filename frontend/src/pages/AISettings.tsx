import { useState, useEffect } from 'react';
import { aiAPI, AISettings as AISettingsType } from '../api/ai';
import { Sparkles, Save, Bot, MessageCircle } from 'lucide-react';

export default function AISettings() {
  const [assistantName, setAssistantName] = useState('AI Assistant');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'casual'>('professional');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await aiAPI.getSettings();
      setAssistantName(data.assistantName);
      setTone(data.tone);
    } catch (err) {
      console.error('Failed to load AI settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await aiAPI.updateSettings({
        assistantName,
        tone,
      });
      setSuccess(true);
      await loadSettings();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toneOptions = [
    {
      value: 'professional',
      label: 'Professional',
      description: 'Clear, concise, and formal responses',
      icon: <Bot size={20} />,
    },
    {
      value: 'friendly',
      label: 'Friendly',
      description: 'Warm, encouraging, and supportive',
      icon: <MessageCircle size={20} />,
    },
    {
      value: 'casual',
      label: 'Casual',
      description: 'Relaxed, conversational, like a friend',
      icon: <Sparkles size={20} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          AI Assistant Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your AI assistant's personality and behavior
        </p>
      </div>

      <div className="card-modern space-y-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 backdrop-blur-sm">
            <p className="text-sm text-green-700 dark:text-green-400">Settings saved successfully!</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 backdrop-blur-sm">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Assistant Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Assistant Name
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Give your AI assistant a custom name to make it more personal
          </p>
          <input
            type="text"
            value={assistantName}
            onChange={(e) => setAssistantName(e.target.value)}
            placeholder="AI Assistant"
            maxLength={50}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 transition-all"
          />
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {assistantName.length}/50 characters
          </p>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Response Tone
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Choose how your AI assistant should communicate with you
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {toneOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTone(option.value as typeof tone)}
                className={`p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                  tone === option.value
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                    : 'border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      tone === option.value
                        ? 'bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {option.icon}
                  </div>
                  <span
                    className={`font-semibold ${
                      tone === option.value
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    tone === option.value
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/30">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600 dark:text-blue-400" />
            Preview
          </h4>
          <div className="space-y-3">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Assistant name in chat:
              </p>
              <p className="font-semibold text-blue-600 dark:text-blue-400">
                {assistantName || 'AI Assistant'}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Sample response ({tone}):
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {tone === 'professional' &&
                  'You have 3 tasks due today. I recommend prioritizing the high-priority items first.'}
                {tone === 'friendly' &&
                  "Hey! You've got 3 tasks due today. Let's tackle those high-priority ones first - you've got this! 😊"}
                {tone === 'casual' &&
                  "Yo! 3 tasks on your plate today. Hit up the important stuff first and you'll be golden! ✨"}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-dark-border">
          <button
            onClick={handleSave}
            disabled={saving || !assistantName.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
