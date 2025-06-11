/// <reference types="chai" />

declare global {
  namespace Chai {
    interface Assertion {
      /** Compares byte arrays on per-element basis. */
      equalBytes(expected: chaiBytes.BufferType): Assertion
    }

    interface Assert {
      /** Compares byte arrays on per-element basis. */
      equalBytes(actual: ArrayBufferView, expected: chaiBytes.BufferType, message?: string): void
    }
  }
}

export function chaiBytes(chai: Chai.ChaiStatic): void {
  chai.Assertion.addMethod('equalBytes', function (expected: chaiBytes.BufferType) {
    if (!isArrayBufferView(this._obj)) throw new Error('Assertion requires a ArrayBufferView')
    const act = toUint8Array(this._obj)
    const exp = toUint8Array(expected)
    const matched = 'expected #{act} to equal #{exp}'
    const unmatched = 'expected #{act} to not equal #{exp}'
    const showDiff = chai.config.showDiff
    this.assert(equals(act, exp), matched, unmatched, toHexString(exp), toHexString(act), showDiff)
  })
  chai.assert.equalBytes = function (actual, expected, message) {
    new chai.Assertion(actual, message, chai.assert.equalBytes, true).to.equalBytes(expected)
  }
}

export namespace chaiBytes {
  export type BufferType = string | Iterable<number> | ArrayLike<number> | ArrayBufferLike | ArrayBufferView
}

function toUint8Array(buf: chaiBytes.BufferType): Uint8Array {
  if (buf == null) throw new TypeError('expected value is not defined')
  if (typeof buf === 'string') return fromHexString(buf)
  if (isUint8Array(buf)) return Uint8Array.from(buf)
  if (isArrayBufferView(buf)) return new Uint8Array(buf.buffer)
  if (isArrayBufferLike(buf)) return new Uint8Array(buf)
  if (isArrayLike(buf) && isUint8ArrayLike(buf)) return Uint8Array.from(buf)
  if (isIterable(buf)) return Uint8Array.from(buf)
  throw new TypeError('expected value type is not supported')
}

// #region utilities

function isArrayBufferLike(buf: unknown): buf is ArrayBufferLike {
  if (typeof buf !== 'object' || buf === null) return false
  if (!('byteLength' in buf) || typeof buf.byteLength !== 'number') return false
  if (!(Symbol.toStringTag in buf)) return false
  const tag = buf[Symbol.toStringTag]
  return tag === 'ArrayBuffer' || tag === 'SharedArrayBuffer'
}

function isArrayBufferView(buf: unknown): buf is ArrayBufferView {
  if (typeof buf !== 'object' || buf === null) return false
  if (!('byteLength' in buf) || typeof buf.byteLength !== 'number') return false
  if (!('byteOffset' in buf) || typeof buf.byteOffset !== 'number') return false
  return 'buffer' in buf && isArrayBufferLike(buf.buffer)
}

function isUint8Array(buf: unknown): buf is Uint8Array {
  if (typeof buf !== 'object' || buf === null) return false
  if (!('byteLength' in buf) || typeof buf.byteLength !== 'number') return false
  return Symbol.toStringTag in buf && buf[Symbol.toStringTag] === 'Uint8Array'
}

function isIterable<T>(iter: unknown): iter is Iterable<T> {
  if (typeof iter !== 'object' || iter === null) return false
  return Symbol.iterator in iter && typeof iter[Symbol.iterator] === 'function'
}

function isArrayLike<T>(arr: unknown): arr is ArrayLike<T> {
  if (Array.isArray(arr)) return true
  if (typeof arr !== 'object' || arr === null) return false
  return 'length' in arr && typeof arr.length === 'number'
}

function isUint8ArrayLike(array: ArrayLike<unknown>): array is ArrayLike<number> {
  for (let index = 0, b; index < array.length; index++) {
    b = array[index]
    if (typeof b !== 'number') return false
    if (b < 0 || b > 255) return false
  }
  return false
}

function equals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function fromHexString(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error('Hex string must have an even length')
  const buf = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    buf[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return buf
}

function toHexString(buf: Uint8Array): string {
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// #endregion
