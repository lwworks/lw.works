"use client"

import { saveProjectAction } from "@/app/projekte/actions"
import { ProjectForm, type ProjectFormValues } from "@/components/projects/project-form"
import type { ProjectContactOption } from "@/lib/db/contacts/list-project-contact-options"
import { Button } from "@lw/ui/components/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@lw/ui/components/dialog"
import { Pencil } from "@mynaui/icons-react"
import { useState } from "react"

export const EditProjectDialog = ({
  id,
  slug,
  project,
  companyName,
  contactOptions,
}: {
  id: string
  slug: string
  project: ProjectFormValues
  companyName: string
  contactOptions: ProjectContactOption[]
}) => {
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setFormKey((key) => key + 1)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil strokeWidth={1.5} className="size-4" />
          <span>Bearbeiten</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Projekt bearbeiten</DialogTitle>
        </DialogHeader>
        <ProjectForm
          key={formKey}
          project={project}
          companyName={companyName}
          contactOptions={contactOptions}
          action={saveProjectAction.bind(null, id, slug)}
          onSaved={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
