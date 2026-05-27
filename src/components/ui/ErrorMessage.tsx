interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-start gap-3 rounded-[8px] border border-ctp-red bg-[rgba(237,135,150,0.10)] px-4 py-3">
      <span className="text-ctp-red mt-0.5">⚠</span>
      <p className="text-sm text-ctp-red">{message}</p>
    </div>
  );
}
