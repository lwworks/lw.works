export const getNodeText = (node: React.ReactNode): string => {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return node.toString()
  if (node instanceof Array) return node.map(getNodeText).join('')
  if (typeof node === 'object' && (node as any)?.props?.children) return getNodeText((node as any).props.children)
  return ''
}

export const sluggifyTitle = (node: React.ReactNode): string => {
  const re = /[^\w\s]/g
  const title = getNodeText(node)
  return title.trim().toLowerCase().replace(re, '').replace(/\s+/g, '-')
}
