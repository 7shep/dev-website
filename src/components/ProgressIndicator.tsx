export default function ProgressIndicator() {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
      <div className="w-1 h-1 bg-secondary rounded-full" />
      <div className="w-1 h-8 bg-surface-container-highest rounded-full overflow-hidden">
        <div className="w-full h-1/4 bg-primary" />
      </div>
      <div className="w-1 h-1 bg-surface-container-highest rounded-full" />
      <div className="w-1 h-1 bg-surface-container-highest rounded-full" />
    </div>
  );
}
