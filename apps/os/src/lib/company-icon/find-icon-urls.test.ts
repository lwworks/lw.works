import { describe, expect, it } from 'vitest'
import { findIconUrls } from './find-icon-urls'

const page = new URL('https://www.example.com/de/start')

describe('findIconUrls', () => {
  it('falls back to /favicon.ico', () => {
    expect(findIconUrls('<html></html>', page)).toEqual(['https://www.example.com/favicon.ico'])
  })

  it('ranks svg, then larger icons, then touch icons', () => {
    const html = `
      <link rel="apple-touch-icon" href="/touch.png">
      <link rel="icon" sizes="16x16" href="/16.png">
      <link rel="shortcut icon" href="/favicon.ico">
      <link rel="icon" type="image/png" sizes="32x32" href="/32.png">
      <link rel="mask-icon" href="/mask.svg">
      <link href="/icon.svg" rel="icon" type="image/svg+xml">
      <link rel="stylesheet" href="/style.css">`
    expect(findIconUrls(html, page)).toEqual([
      'https://www.example.com/icon.svg',
      'https://www.example.com/32.png',
      'https://www.example.com/16.png',
      'https://www.example.com/favicon.ico',
      'https://www.example.com/touch.png',
    ])
  })

  it('resolves relative and absolute hrefs and decodes entities', () => {
    const html = `<LINK REL='icon' HREF='assets/i.png?v=1&amp;x=2'><link rel=icon href=https://cdn.example.net/f.png sizes=64x64>`
    expect(findIconUrls(html, page)).toEqual([
      'https://cdn.example.net/f.png',
      'https://www.example.com/de/assets/i.png?v=1&x=2',
      'https://www.example.com/favicon.ico',
    ])
  })

  it('puts dark-mode variants after light ones', () => {
    const html = `<link rel="icon" href="/dark.png" media="(prefers-color-scheme: dark)"><link rel="icon" href="/light.png" media="(prefers-color-scheme: light)">`
    expect(findIconUrls(html, page).slice(0, 2)).toEqual(['https://www.example.com/light.png', 'https://www.example.com/dark.png'])
  })

  it('ignores non-http hrefs', () => {
    expect(findIconUrls('<link rel="icon" href="data:image/png;base64,AAAA">', page)).toEqual(['https://www.example.com/favicon.ico'])
  })
})
