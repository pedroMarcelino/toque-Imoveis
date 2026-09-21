export default function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center text-slate-500">
      {text}
    </div>
  );
}