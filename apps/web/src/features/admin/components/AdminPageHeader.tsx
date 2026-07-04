type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function AdminPageHeader({ eyebrow, title, description }: AdminPageHeaderProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-pink">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-text-secondary">{description}</p>
    </div>
  );
}
