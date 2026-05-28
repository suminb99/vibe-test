export default function RainbowBar() {
  return (
    <div
      aria-hidden="true"
      className="fixed bottom-0 left-0 right-0 z-50 h-1"
      style={{ background: 'var(--rainbow-gradient)' }}
    />
  );
}
