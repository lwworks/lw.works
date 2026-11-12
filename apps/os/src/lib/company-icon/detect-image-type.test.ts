import { describe, expect, it } from 'vitest'
import { detectImageType } from './detect-image-type'

const bytes = (...values: number[]) => new Uint8Array(values)
const text = (value: string) => new TextEncoder().encode(value)

describe('detectImageType', () => {
  it('recognizes binary formats by signature', () => {
    expect(detectImageType(bytes(0x00, 0x00, 0x01, 0x00, 0x01))).toBe('image/x-icon')
    expect(detectImageType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d))).toBe('image/png')
    expect(detectImageType(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe('image/jpeg')
    expect(detectImageType(text('GIF89a'))).toBe('image/gif')
    expect(detectImageType(text('RIFF\u0000\u0000\u0000\u0000WEBPVP8 '))).toBe('image/webp')
  })
  it('recognizes svg with or without xml prolog', () => {
    expect(detectImageType(text('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))).toBe('image/svg+xml')
    expect(detectImageType(text('﻿<?xml version="1.0"?>\n<svg></svg>'))).toBe('image/svg+xml')
  })
  it('rejects everything else', () => {
    expect(detectImageType(text('<!doctype html><html></html>'))).toBeNull()
    expect(detectImageType(text('RIFF\u0000\u0000\u0000\u0000WAVE'))).toBeNull()
    expect(detectImageType(bytes())).toBeNull()
  })
})
