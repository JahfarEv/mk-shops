export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-black flex justify-center">
      <div className="w-full max-w-[430px] bg-[var(--color-dark)] text-white">
        {children}
      </div>
    </div>
  );
}
