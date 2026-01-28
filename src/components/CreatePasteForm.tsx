'use client';

import { useState } from 'react';

export default function CreatePasteForm() {
    const [content, setContent] = useState('');
    const [ttl, setTtl] = useState<number | ''>('');
    const [maxViews, setMaxViews] = useState<number | ''>('');
    const [result, setResult] = useState<{ id: string, url: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch('/api/pastes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    ttl_seconds: ttl === '' ? undefined : Number(ttl),
                    max_views: maxViews === '' ? undefined : Number(maxViews),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create paste');
            }

            setResult(data);
            setContent('');
            setTtl('');
            setMaxViews('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-indigo-500/20">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        New Paste
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={12}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-mono text-sm text-slate-800 placeholder:text-slate-400 resize-none hover:bg-white"
                        placeholder="Type or paste your content here..."
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">
                            Auto-Expire (Seconds)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={ttl}
                                onChange={(e) => setTtl(e.target.value === '' ? '' : parseInt(e.target.value))}
                                min="1"
                                placeholder="e.g. 3600"
                                className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">
                            View Limit
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={maxViews}
                                onChange={(e) => setMaxViews(e.target.value === '' ? '' : parseInt(e.target.value))}
                                min="1"
                                placeholder="e.g. 5"
                                className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        'Create Secure Link'
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center gap-3 animate-pulse">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-8 p-6 bg-emerald-50 border border-emerald-100 rounded-xl animate-fade-in text-center shadow-inner">
                    <p className="text-emerald-800 font-bold text-lg mb-2">🎉 Paste Ready!</p>
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-4">
                        <input
                            readOnly
                            value={result.url}
                            className="w-full sm:w-auto flex-1 p-3 text-sm bg-white border border-emerald-200 rounded-lg text-slate-600 font-mono shadow-sm"
                            onClick={(e) => e.currentTarget.select()}
                        />
                        <a
                            href={result.url}
                            target="_blank"
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition-colors flex items-center gap-2"
                        >
                            Visit <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
