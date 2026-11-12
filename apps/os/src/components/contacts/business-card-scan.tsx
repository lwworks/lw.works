"use client"

import { readBusinessCardAction } from "@/app/kontakte/actions"
import { downscaleImage } from "@/lib/business-card/downscale-image"
import type { ContactPrefill } from "@/lib/business-card/to-contact-prefill"
import { Button } from "@lw/ui/components/button"
import { cn } from "@lw/ui/lib/utils"
import { Image as ImageIcon, Sparkles, X } from "@mynaui/icons-react"
import { useEffect, useState, useTransition } from "react"

type Side = "front" | "back"
type Photo = { file: File; url: string }

const sides: { key: Side; label: string }[] = [
  { key: "front", label: "Vorderseite" },
  { key: "back", label: "Rückseite" },
]

export const BusinessCardScan = ({ onRead }: { onRead: (prefill: ContactPrefill) => void }) => {
  const [photos, setPhotos] = useState<Record<Side, Photo | null>>({ front: null, back: null })

  const setPhoto = (side: Side, file: File | null) => {
    setPhotos((current) => ({ ...current, [side]: file ? { file, url: URL.createObjectURL(file) } : null }))
  }
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null)
  const [pending, startTransition] = useTransition()

  const read = () => {
    setMessage(null)
    startTransition(async () => {
      const formData = new FormData()
      try {
        for (const { key } of sides) {
          const photo = photos[key]
          if (photo) formData.set(key, await downscaleImage(photo.file))
        }
      } catch {
        setMessage({ tone: "error", text: "Das Bild konnte nicht gelesen werden." })
        return
      }
      const result = await readBusinessCardAction(formData)
      if (!result.ok) {
        setMessage({ tone: "error", text: result.message })
        return
      }
      onRead(result.value)
      setMessage({ tone: "success", text: "Formular ausgefüllt – bitte prüfen und ergänzen." })
    })
  }

  return (
    <section className={cn("flex max-w-lg flex-col gap-3")}>
      <div className={cn("flex flex-col gap-0.5")}>
        <h2 className={cn("text-sm font-medium text-black dark:text-white")}>Visitenkarte scannen</h2>
        <p className={cn("text-sm text-muted-foreground")}>Fotos von Vorder- und Rückseite hochladen, um das Formular vorauszufüllen.</p>
      </div>
      <div className={cn("grid grid-cols-2 gap-3")}>
        {sides.map(({ key, label }) => (
          <CardSlot
            key={key}
            label={label}
            photo={photos[key]}
            disabled={pending}
            onChange={(file) => setPhoto(key, file)}
          />
        ))}
      </div>
      {message ? (
        <p className={cn("text-sm", message.tone === "error" ? "text-destructive" : "text-muted-foreground")}>{message.text}</p>
      ) : null}
      <div className={cn("flex justify-end")}>
        <Button type="button" variant="outline" onClick={read} disabled={pending || (!photos.front && !photos.back)}>
          <Sparkles strokeWidth={1.5} className={cn("size-4")} />
          <span>{pending ? "Liest aus …" : "Auslesen"}</span>
        </Button>
      </div>
    </section>
  )
}

const CardSlot = ({ label, photo, disabled, onChange }: { label: string; photo: Photo | null; disabled: boolean; onChange: (file: File | null) => void }) => {
  // Frees the preview URL when the photo is replaced or the slot unmounts.
  useEffect(() => (photo ? () => URL.revokeObjectURL(photo.url) : undefined), [photo])

  return (
    <div className={cn("relative")}>
      <label
        className={cn(
          "flex aspect-[85/55] cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-dashed border-input text-sm text-muted-foreground hover:border-ring",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
          <img src={photo.url} alt={label} className={cn("size-full object-cover")} />
        ) : (
          <>
            <ImageIcon strokeWidth={1.5} className={cn("size-5")} />
            <span>{label}</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className={cn("sr-only")}
          disabled={disabled}
          onChange={(event) => {
            onChange(event.target.files?.[0] ?? null)
            event.target.value = ""
          }}
        />
      </label>
      {photo ? (
        <button
          type="button"
          aria-label={`${label} entfernen`}
          disabled={disabled}
          onClick={() => onChange(null)}
          className={cn("absolute top-1.5 right-1.5 rounded-full bg-background/90 p-1 text-black shadow-sm dark:text-white")}
        >
          <X strokeWidth={1.5} className={cn("size-3.5")} />
        </button>
      ) : null}
    </div>
  )
}
