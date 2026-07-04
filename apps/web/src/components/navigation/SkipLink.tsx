export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only z-[100] rounded-full bg-white px-5 py-3 text-sm font-semibold text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to main content
    </a>
  );
}
