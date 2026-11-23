import { Timeline, type TimelineSubject } from "@/components/activity/timeline"
import { NoteComposer, type NoteTarget } from "@/components/notes/note-composer"
import type { TimelineItem } from "@/lib/contacts/build-contact-timeline"
import { cn } from "@lw/ui/lib/utils"

/** Full-width composer with the timeline below it, at the bottom of a contact, company or project page. */
export const NotesSection = ({ target, subject, timeline }: { target: NoteTarget; subject: TimelineSubject; timeline: TimelineItem[] }) => (
  <>
    <div className={cn("border-b border-neutral-200 px-4 py-6 sm:px-8 lg:px-16 dark:border-neutral-800")}>
      <NoteComposer target={target} />
    </div>
    <div className={cn("px-4 py-8 sm:px-8 lg:px-16")}>
      <Timeline items={timeline} subject={subject} />
    </div>
  </>
)
