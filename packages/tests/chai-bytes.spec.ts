import 'mocha'
import { assert, expect, use } from 'chai'
import { chaiBytes } from 'chai-bytes'

use(chaiBytes)

describe('chai-bytes', () => {
  it('Check `expect` behavior', () => {
    const buffer = Uint8Array.of(0x01, 0x02, 0x03)

    expect(buffer).to.equalBytes([0x01, 0x02, 0x03])
    expect(buffer).to.equalBytes(Buffer.from('010203', 'hex'))
    expect(buffer).to.equalBytes(Uint8Array.of(0x01, 0x02, 0x03))
    // Check chaining
    expect(buffer).to.not.equalBytes('0102')
    expect(buffer).to.not.equalBytes(Buffer.from('0102', 'hex'))
    buffer[2] += 1
    expect(buffer).to.have.lengthOf(3).and.equalBytes([0x01, 0x02, 0x04])
    buffer[2] -= 1
  })

  it('Check `assert` behavior', () => {
    const buffer = Uint8Array.of(0x01, 0x02, 0x03)

    assert.equalBytes(buffer, [0x01, 0x02, 0x03], 'some message')
    assert.equalBytes(buffer, '010203')
    assert.equalBytes(buffer, Buffer.from('010203', 'hex'))
    assert.equalBytes(buffer, Uint8Array.from([0x01, 0x02, 0x03]))
  })
})
