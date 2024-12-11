export const Divider = () => {
  return (
    <div className="relative border-t border-slate-200 dark:border-slate-700">
      <div className="absolute inset-x-0 top-0 h-96 overflow-hidden">
        <div
          className="mx-auto -mt-48 h-96 w-full max-w-screen-xl bg-[#F9FAFB] blur-3xl dark:bg-[#15191F] sm:blur-4xl"
          style={{borderRadius: '50% 50%'}}
        />
      </div>
    </div>
  )
}
