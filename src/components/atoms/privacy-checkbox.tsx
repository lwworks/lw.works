import Link from "next/link"
import { Checkbox } from "../ui/checkbox"

export const PrivacyCheckbox = () => {
  return (
    <label htmlFor="booking-privacy" className="flex items-start gap-2 cursor-pointer">
      <Checkbox id="booking-privacy" name="privacy" required className="mt-0.5 shrink-0" />
      <span className="text-sm text-muted-foreground">
        Ich habe die <Link href="/datenschutz" target="_blank" className="text-black dark:text-white underline hover:opacity-80">Datenschutzerklärung</Link> gelesen und bin mit der Verarbeitung meiner Daten einverstanden.
      </span>
    </label>
  )
}