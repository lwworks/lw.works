"use client"

import { applyWebsiteFaviconAction, uploadCompanyLogoAction } from "@/app/unternehmen/actions"
import { CompanyIcon } from "@/components/atoms/company-icon"
import { downscaleLogo } from "@/lib/company-logo/downscale-logo"
import { Button } from "@lw/ui/components/button"
import { Label } from "@lw/ui/components/label"
import { toast } from "@lw/ui/components/sonner"
import { cn } from "@lw/ui/lib/utils"
import { Globe, Upload } from "@mynaui/icons-react"
import { useRef, useTransition } from "react"

/** Logo of an existing company: replace it with an upload or with the website's current favicon. Saves immediately. */
export const CompanyLogoField = ({ companyId, logoKey, hasWebsite }: { companyId: string; logoKey: string | null; hasWebsite: boolean }) => {
  const input = useRef<HTMLInputElement>(null)
  const [pending, startTransition] = useTransition()

  const upload = (file: File) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("logo", await downscaleLogo(file))
      const result = await uploadCompanyLogoAction(companyId, formData)
      if (result.ok) toast.success("Logo gespeichert.")
      else toast.error(result.message)
    })
  }

  const applyFavicon = () => {
    startTransition(async () => {
      const result = await applyWebsiteFaviconAction(companyId)
      if (result.ok) toast.success("Favicon übernommen.")
      else toast.error(result.message)
    })
  }

  return (
    <div className={cn("flex flex-col gap-1.5")}>
      <Label htmlFor="company-logo">Logo</Label>
      <div className={cn("flex flex-wrap items-center gap-2")}>
        <CompanyIcon companyId={companyId} logoKey={logoKey} size={32} className={cn("rounded-md border p-0.5", pending && "opacity-50")} />
        <input
          ref={input}
          id="company-logo"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/x-icon,.ico"
          className={cn("sr-only")}
          disabled={pending}
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ""
            if (file) upload(file)
          }}
        />
        <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => input.current?.click()}>
          <Upload strokeWidth={1.5} className={cn("size-4")} />
          <span>{pending ? "Speichert …" : "Hochladen"}</span>
        </Button>
        {hasWebsite ? (
          <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={applyFavicon}>
            <Globe strokeWidth={1.5} className={cn("size-4")} />
            <span>Favicon der Website</span>
          </Button>
        ) : null}
      </div>
      <p className={cn("text-xs text-muted-foreground")}>Wird beim Anlegen automatisch aus dem Favicon der Website übernommen. PNG, JPEG, WebP, GIF, SVG oder ICO, max. 1 MB.</p>
    </div>
  )
}
