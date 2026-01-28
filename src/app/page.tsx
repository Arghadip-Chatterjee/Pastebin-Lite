import CreatePasteForm from '@/components/CreatePasteForm';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight">
            Pastebin Lite
          </h1>
          <p className="text-slate-600 mt-2 text-lg font-medium">
            Paste your code and text securely with Temporary links.
          </p>
        </div>

        <CreatePasteForm />
      </div>
    </main>
  );
}
