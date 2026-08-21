"use client"

import { Heading } from "@/components/atoms/heading"
import { Link } from "@/components/link"
import { Section } from "@/components/sections"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, CheckCircleSolid, Clock3, Telephone, UserCircle, Video } from "@mynaui/icons-react"
import { useRouter } from "next/navigation"
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs"
import { useEffect } from "react"

export const BookingConfirmationSection = ({ fallback }: { fallback: string }) => {
  const router = useRouter()
  const [{ name, date, time, type, teamMember }] = useQueryStates({
    name: parseAsString.withDefault(""),
    date: parseAsString.withDefault(""),
    time: parseAsString.withDefault(""),
    type: parseAsStringLiteral(["online", "phone"]),
    teamMember: parseAsString.withDefault(""),
  })
  const hasConfirmationParams = Boolean(name && date && time && type && teamMember)

  useEffect(() => {
    if (!hasConfirmationParams) {
      router.replace(fallback)
    }
  }, [hasConfirmationParams, router])

  if (!hasConfirmationParams) return null

  return (
    <Section background="paint-4">
      <div className="flex gap-1.5 sm:gap-3">
        <div className="size-10 sm:size-12 lg:size-15 shrink-0 relative">
          <div className="absolute inset-2 rounded-full bg-black" />
          <CheckCircleSolid className="relative size-10 sm:size-12 lg:size-15 text-lime" />
        </div>
        <Heading as="h1">Termin bestätigt!</Heading>
      </div>
      <p className="mt-8 max-w-xl text-balance"><span className="font-medium text-black dark:text-white">{name}, Dein Termin ist bestätigt!</span> Du erhältst gleich eine Bestätigung sowie eine Kalendereinladung per Email. Hier findest Du auch nochmal alle Details:</p>
      <ul className="mt-8 leading-none space-y-2">
        <li className="flex items-center gap-2">
          <Calendar className="size-4 shrink-0 text-black dark:text-white" />
          <span>{date || "Datum folgt"}</span>
        </li>
        <li className="flex items-center gap-2">
          <Clock3 className="size-4 shrink-0 text-black dark:text-white" />
          <span>{time || "Uhrzeit folgt"}</span>
        </li>
        {type === "online" && (
          <li className="flex items-center gap-2">
            <Video className="size-4 shrink-0 text-black dark:text-white" />
            <span>Online-Meeting</span>
          </li>
        )}
        {type === "phone" && (
          <li className="flex items-center gap-2">
            <Telephone className="size-4 shrink-0 text-black dark:text-white" />
            <span>Telefonat</span>
          </li>
        )}
        <li className="flex items-center gap-2">
          <UserCircle className="size-4 shrink-0 text-black dark:text-white" />
          <span>Mit {teamMember}</span>
        </li>
      </ul>
      <Button asChild className="mt-8">
        <Link href="/">
          <span>Zurück zur Startseite</span>
          <ArrowRight className="size-4 shrink-0 text-black/50" />
        </Link>
      </Button>
    </Section>
  )
}