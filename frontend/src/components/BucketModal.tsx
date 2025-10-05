import { useState } from 'react';
import { X } from 'lucide-react';
import { bucketsAPI } from '../api/buckets';
import { Bucket } from '../types';

interface Props {
  bucket?: Bucket;
  onClose: () => void;
  onSave: () => void;
}

const PRESET_COLORS = [
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#6366F1', // indigo
  '#14B8A6', // teal
];

export default function BucketModal({ bucket, onClose, onSave }: Props) {
  const [name, setName] = useState(bucket?.name || '');
  const [color, setColor] = useState(bucket?.color || PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (bucket) {
        await bucketsAPI.update(bucket.id, { name, color });
      } else {
        await bucketsAPI.create({ name, color });
      }
      onSave();
    } catch (error) {
      console.error('Failed to save bucket:', error);
      alert('Failed to save bucket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="card-modern max-w-md w-full m-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {bucket ? 'Edit Bucket' : 'New Bucket'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bucket Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Personal, Work, Health"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Color
            </label>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => setColor(presetColor)}
                  className={`w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 ${
                    color === presetColor ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white/50 scale-105' : ''
                  }`}
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-4 w-full h-12 rounded-xl cursor-pointer bg-gray-800/50 border border-gray-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Saving...' : bucket ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
