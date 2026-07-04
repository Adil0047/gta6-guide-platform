import { Spinner } from '@/components/ui/Spinner';

type LoadingScreenProps = {
  label?: string;
};

export function LoadingScreen({ label = 'Loading GTA VI Guide Platform' }: LoadingScreenProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-background text-text-primary">
      <div className="text-center">
        <Spinner className="justify-center" label={label} />
        <p className="mt-4 text-sm font-semibold text-text-secondary">{label}</p>
      </div>
    </main>
  );
}
