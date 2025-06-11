# @nice-labs/chai-bytes

A [Chai](https://chaijs.com) plugin providing `equalBytes` assertions for comparing byte arrays (such as `Uint8Array`).

Forked from <https://github.com/slowli/chai-bytes>

## Usage

```typescript
import { expect, assert, use } from 'chai'
import { chaiBytes } from 'chai-bytes'

use(chaiBytes)

const bytes = Uint8Array.of(0x01, 0x02, 0x03, 0x04, 0x05)

// BDD style
expect(bytes).to.equalBytes('0102030405')

// Assert style
assert.equalBytes(bytes, [0x01, 0x02, 0x03, 0x04, 0x05], 'should match bytes')
```

## Supported Expected Values

The `equalBytes` assertion accepts:

- **Hex strings**: e.g., `'C0FFEE'`
- **Arrays**: e.g., `[1, 2, 3]`
- **Array-like objects**: Any object with a `length` property and numeric indices (including `Uint8Array`)

If the expected value is not one of these, a `TypeError` is thrown.

## LICENSE

[MIT](LICENSE.txt) LICENSE
