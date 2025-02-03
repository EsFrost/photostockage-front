// components/OfflineFallback.tsx
export default function OfflineFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">You&apos;re offline</h2>
        <p>Please check your internet connection and try again.</p>
      </div>
    </div>
  );
}
