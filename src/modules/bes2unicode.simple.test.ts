// src/modules/bes2unicode.simple.test.ts
import { describe, it, expect } from 'vitest'
import bes2unicode from './bes2unicode'

const makeBytes = (...dataBytes: number[]): Uint8Array => {
  const headerSize = 1029
  const totalSize = headerSize + dataBytes.length
  const arr = new Uint8Array(totalSize)
  for (let i = 0; i < headerSize; i++) {
    arr[i] = 0
  }
  for (let i = 0; i < dataBytes.length; i++) {
    arr[headerSize + i] = dataBytes[i]
  }
  return arr
}

describe('bes2unicode', () => {
  it('should return an empty string when only the header bytes are present', () => {
    const bytes = makeBytes() // Only header bytes
    expect(bes2unicode(bytes)).toBe('')
  })

  it('should correctly convert a single 0xa1 byte', () => {
    const bytes = makeBytes(0xa1)
    expect(bes2unicode(bytes)).toBe('⠁')
  })

  it('should correctly convert multiple known bytes [0xa1, 0xa3]', () => {
    const bytes = makeBytes(0xa1, 0xa3)
    expect(bes2unicode(bytes)).toBe('⠁⠃')
  })

  it('should skip unknown bytes (e.g., 0x01)', () => {
    const bytes = makeBytes(0x01)
    expect(bes2unicode(bytes)).toBe('')
  })

  it('should handle a mix of known and unknown bytes [0xa1, 0xfe, 0xa3]', () => {
    const bytes = makeBytes(0xa1, 0xfe, 0xa3)
    expect(bes2unicode(bytes)).toBe('⠁@LB@⠃')
  })

  it('should handle sequence starting with a known byte (e.g., 0x0d)', () => {
    const bytes = makeBytes(0x0d)
    expect(bes2unicode(bytes)).toBe('')
  })

  it('should handle sequence containing a null byte (0x00)', () => {
    const bytes = makeBytes(0x00)
    expect(bes2unicode(bytes)).toBe('')
  })
})
