import { ActorAvatar } from "@/components/activity/actor-avatar"
import { RelativeTime } from "@/components/activity/relative-time"
import { NoteItem } from "@/components/notes/note-item"
import type { TimelineEvent, TimelineItem } from "@/lib/contacts/build-contact-timeline"
import { cn } from "@lw/ui/lib/utils"
import { Edit, Plus, Refresh } from "@mynaui/icons-react"
import type { ReactNode } from "react"

/**
 * Linear-style activity feed without cards: every entry starts with an avatar or icon on a vertical line that runs
 * through them; notes add their content below, indented past the avatar (half of the 20px avatar).
 */
export type TimelineSubject = "Kontakt" | "Unternehmen" | "Projekt"

export const Timeline = ({ items, subject }: { items: TimelineItem[]; subject: TimelineSubject }) => (
  <ol className={cn("relative flex flex-col gap-4")}>
    <span aria-hidden className={cn("absolute top-3 bottom-3 left-2.5 w-px -translate-x-1/2 bg-neutral-200 dark:bg-neutral-800")} />
    {items.map((item) => (
      <li key={`${item.kind}-${item.id}`} className={cn("relative")}>
        {item.kind === "note" ? <NoteItem note={item.note} /> : <EventRow event={item} subject={subject} />}
      </li>
    ))}
  </ol>
)

const EventRow = ({ event, subject }: { event: TimelineEvent; subject: TimelineSubject }) => {
  const { icon, text } = describe(event, subject)
  return (
    <div className={cn("flex min-h-7 items-center gap-2 text-sm text-neutral-500")}>
      {icon}
      <p className={cn("min-w-0")}>
        {text}
        <span className={cn("mx-1.5")}>·</span>
        <RelativeTime date={event.at} />
      </p>
    </div>
  )
}

const IconDot = ({ children }: { children: ReactNode }) => (
  <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full bg-background text-neutral-500 ring-1 ring-neutral-200 dark:ring-neutral-800")}>
    {children}
  </span>
)

const describe = (event: TimelineEvent, subject: TimelineSubject): { icon: ReactNode; text: ReactNode } => {
  switch (event.type) {
    case "created":
      if (!event.actor) {
        return {
          icon: (
            <IconDot>
              <Plus strokeWidth={1.5} className={cn("size-3")} />
            </IconDot>
          ),
          text: `${subject} angelegt`,
        }
      }
      return {
        icon: <ActorAvatar name={event.actor.name} image={event.actor.image} className={cn("ring-2 ring-background")} />,
        text: (
          <>
            <span className={cn("font-medium text-black dark:text-white")}>{event.actor.name}</span> hat {subject === "Kontakt" ? "den" : "das"} {subject} angelegt
          </>
        ),
      }
    case "edited":
      return {
        icon: (
          <IconDot>
            <Edit strokeWidth={1.5} className={cn("size-3")} />
          </IconDot>
        ),
        text: `${subject} zuletzt bearbeitet`,
      }
    case "google_update":
      return {
        icon: (
          <IconDot>
            <Refresh strokeWidth={1.5} className={cn("size-3")} />
          </IconDot>
        ),
        text: "Aus Google Kontakte aktualisiert",
      }
  }
}
