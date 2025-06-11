import { assert, expect, use } from 'chai'
import { chaiBytes } from 'chai-bytes'

use(chaiBytes)

const buffer = Uint8Array.of(0x01, 0x02, 0x03)

// Check `expect` behavior.
expect(buffer).to.equalBytes([0x01, 0x02, 0x03])
expect(buffer).to.equalBytes('010203')
expect(buffer).to.equalBytes(Uint8Array.of(0x01, 0x02, 0x03))
// Check chaining
expect(buffer).to.not.equalBytes('0102')
buffer[2] += 1
expect(buffer).to.have.lengthOf(3).and.equalBytes([0x01, 0x02, 0x04])
buffer[2] -= 1

// Check `assert` behavior.
assert.equalBytes(buffer, [0x01, 0x02, 0x03], 'some message')
assert.equalBytes(buffer, '010203')
assert.equalBytes(buffer, Uint8Array.from([0x01, 0x02, 0x03]))
