type UrgencyNoteProps = {
  children: React.ReactNode
}

export const UrgencyNote = ({ children }: UrgencyNoteProps) => {
  return (
    <div className="flex items-center gap-1.5 text-sm ml-2">
      <span className="shrink-0 size-3 relative flex items-center justify-center">
        <span className="absolute inset-0 bg-amber-500/20 dark:bg-amber-400/20 rounded-full" />
        <span className="absolute inset-0 bg-amber-500/20 dark:bg-amber-400/20 rounded-full animate-ping" />
        <span className="size-1.5 shrink-0 bg-amber-500 dark:bg-amber-400 rounded-full" />
      </span>
      <span>{children}</span>
    </div>
  )
}