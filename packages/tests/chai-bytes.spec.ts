import 'mocha'
import { assert, expect, use } from 'chai'
import { chaiBytes } from 'chai-bytes'

use(chaiBytes)

describe('chai-bytes', () => {
  it('Check `expect` behavior', () => {
    const buffer = Buffer.of(0x01, 0x02, 0x03)

    expect(buffer).to.equalBytes([0x01, 0x02, 0x03])
    expect(buffer).to.equalBytes(Buffer.from('010203', 'hex'))
    expect(buffer).to.equalBytes(Buffer.of(0x01, 0x02, 0x03))
    // Check chaining
    expect(buffer).to.not.equalBytes('0102')
    expect(buffer).to.not.equalBytes(Buffer.from('0102', 'hex'))
    buffer[2] += 1
    expect(buffer).to.have.lengthOf(3).and.equalBytes([0x01, 0x02, 0x04])
    buffer[2] -= 1
  })

  it('Check `assert` behavior', () => {
    const buffer = Buffer.of(0x01, 0x02, 0x03)

    assert.equalBytes(buffer, [0x01, 0x02, 0x03], 'some message')
    assert.equalBytes(buffer, '010203')
    assert.equalBytes(buffer, Buffer.from('010203', 'hex'))
    assert.equalBytes(buffer, Buffer.from([0x01, 0x02, 0x03]))
  })

  it('Check `assert` behavior: TypedArray', () => {
    assert.equalBytes(Buffer.of(1), '01')
    assert.equalBytes(Int8Array.of(1), '01')
    assert.equalBytes(Uint8Array.of(1), '01')
    assert.equalBytes(Uint8ClampedArray.of(1), '01')

    assert.equalBytes(Int32Array.of(1), '01000000')
    assert.equalBytes(Uint32Array.of(1), '01000000')

    assert.equalBytes(Int16Array.of(1), '0100')
    assert.equalBytes(Uint16Array.of(1), '0100')

    assert.equalBytes(BigInt64Array.of(1n), '0100000000000000')
    assert.equalBytes(BigUint64Array.of(1n), '0100000000000000')

    assert.equalBytes(Float32Array.of(1), '0000803f')
    assert.equalBytes(Float64Array.of(1), '000000000000f03f')
  })
})
