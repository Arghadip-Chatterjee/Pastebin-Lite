import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-panel p-8 sm:p-12 rounded-2xl shadow-2xl max-w-lg w-full text-center space-y-6 animate-fade-in-up hover:shadow-red-500/10 transition-shadow duration-500">
                <div className="relative inline-block">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Paste Unavailable</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                    The paste you are looking for has either <span className="font-semibold text-red-500">expired</span>,
                    reached its <span className="font-semibold text-amber-600">view limit</span>, or
                    never existed.
                </p>

                <div className="pt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Create New Paste <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
