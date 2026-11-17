import { Avatar, AvatarFallback, AvatarImage } from "@lw/ui/components/avatar"
import { cn } from "@lw/ui/lib/utils"

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

/** Small round avatar of a member in the activity timeline. */
export const ActorAvatar = ({ name, image, className }: { name: string; image: string | null; className?: string }) => (
  <Avatar className={cn("size-5 shrink-0", className)}>
    {image ? <AvatarImage src={image} alt="" /> : null}
    <AvatarFallback className={cn("text-[0.5625rem] font-medium")}>{initials(name)}</AvatarFallback>
  </Avatar>
)
