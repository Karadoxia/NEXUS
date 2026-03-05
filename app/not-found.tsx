import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-cyan-400 mb-4">404</h1>
        <p className="text-xl text-white mb-2">Page Not Found</p>
        <p className="text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
