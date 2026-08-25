export default function RootLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-frsc-crimson-500" />
        <p className="text-xs text-frsc-text-300">Memuat...</p>
      </div>
    </div>
  )
}
