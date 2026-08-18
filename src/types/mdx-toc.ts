export type MdxTocEntry = {
  depth: number
  value: string
  attributes: Record<string, string>
  children: MdxTocEntry[]
}

export type MdxTocItem = {
  id: string
  title: string
  depth: number
}
