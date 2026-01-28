import { notFound } from 'next/navigation';
import { getPaste } from '@/lib/pastes';
import { headers } from 'next/headers';

export default async function ViewPaste({ params }: { params: { id: string } }) {
    const headerList = headers();
    const testTimeHeader = headerList.get('x-test-now-ms');
    let now = Date.now();

    if (process.env.TEST_MODE === '1' && testTimeHeader) {
        const parsed = parseInt(testTimeHeader, 10);
        if (!isNaN(parsed)) now = parsed;
    }

    const paste = await getPaste(params.id, now);

    if (!paste) {
        notFound();
    }

    return (
        <main className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
            <div className="w-full max-w-4xl space-y-6 animate-fade-in-up">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-slate-600 font-mono text-sm tracking-wider uppercase">Secure View</span>
                    </div>
                    <a
                        href="/"
                        className="group flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-700 text-sm font-medium transition-all"
                    >
                        <span className="transform transition-transform group-hover:-translate-x-1">&larr;</span> New Paste
                    </a>
                </div>

                <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[70vh]">
                    <div className="bg-slate-50/50 border-b border-slate-200/50 p-4 flex items-center justify-between">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        </div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            Read Only
                        </div>
                    </div>

                    <div className="relative flex-1 overflow-auto bg-white/50">
                        <pre className="p-6 whitespace-pre-wrap font-mono text-sm sm:text-base text-slate-800 leading-relaxed font-norma">
                            {paste.content}
                        </pre>
                    </div>

                    <div className="bg-slate-50/80 border-t border-slate-200/60 p-4 flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                        {paste.remaining_views !== null && (
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md shadow-sm border border-slate-100">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                <span>{paste.remaining_views} views remaining</span>
                            </div>
                        )}
                        {paste.expires_at && (
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md shadow-sm border border-slate-100">
                                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Expires: {new Date(paste.expires_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', timeZoneName: 'short' })}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
