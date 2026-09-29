import type { AuditEvent } from '../types/rbac'

export const GENESIS_AUDIT_HASH = '0'.repeat(64)

type HashableAuditEvent = Omit<AuditEvent, 'previousEventHash' | 'payloadHash' | 'eventHash' | 'chainIndex'>

const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]

function rotateRight(value: number, amount: number) {
  return (value >>> amount) | (value << (32 - amount))
}

export function sha256Hex(input: string) {
  const bytes = Array.from(new TextEncoder().encode(input))
  const bitLength = bytes.length * 8
  bytes.push(0x80)
  while (bytes.length % 64 !== 56) bytes.push(0)

  const high = Math.floor(bitLength / 0x100000000)
  const low = bitLength >>> 0
  for (let shift = 24; shift >= 0; shift -= 8) bytes.push((high >>> shift) & 0xff)
  for (let shift = 24; shift >= 0; shift -= 8) bytes.push((low >>> shift) & 0xff)

  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ]
  const words = new Array<number>(64)

  for (let offset = 0; offset < bytes.length; offset += 64) {
    for (let i = 0; i < 16; i++) {
      const j = offset + i * 4
      words[i] = ((bytes[j] << 24) | (bytes[j + 1] << 16) | (bytes[j + 2] << 8) | bytes[j + 3]) >>> 0
    }
    for (let i = 16; i < 64; i++) {
      const s0 = (rotateRight(words[i - 15], 7) ^ rotateRight(words[i - 15], 18) ^ (words[i - 15] >>> 3)) >>> 0
      const s1 = (rotateRight(words[i - 2], 17) ^ rotateRight(words[i - 2], 19) ^ (words[i - 2] >>> 10)) >>> 0
      words[i] = (words[i - 16] + s0 + words[i - 7] + s1) >>> 0
    }

    let [a, b, c, d, e, f, g, h] = hash
    for (let i = 0; i < 64; i++) {
      const s1 = (rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25)) >>> 0
      const ch = ((e & f) ^ (~e & g)) >>> 0
      const temp1 = (h + s1 + ch + K[i] + words[i]) >>> 0
      const s0 = (rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22)) >>> 0
      const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0
      const temp2 = (s0 + maj) >>> 0

      h = g
      g = f
      f = e
      e = (d + temp1) >>> 0
      d = c
      c = b
      b = a
      a = (temp1 + temp2) >>> 0
    }

    hash[0] = (hash[0] + a) >>> 0
    hash[1] = (hash[1] + b) >>> 0
    hash[2] = (hash[2] + c) >>> 0
    hash[3] = (hash[3] + d) >>> 0
    hash[4] = (hash[4] + e) >>> 0
    hash[5] = (hash[5] + f) >>> 0
    hash[6] = (hash[6] + g) >>> 0
    hash[7] = (hash[7] + h) >>> 0
  }

  return hash.map(part => part.toString(16).padStart(8, '0')).join('')
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize)
  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce((record, key) => {
        const child = (value as Record<string, unknown>)[key]
        if (child !== undefined) record[key] = canonicalize(child)
        return record
      }, {} as Record<string, unknown>)
  }
  return value
}

export function stableStringify(value: unknown) {
  return JSON.stringify(canonicalize(value))
}

function payloadFor(event: HashableAuditEvent) {
  return {
    actorId: event.actorId,
    createdAt: event.createdAt,
    id: event.id,
    message: event.message,
    metadata: event.metadata || {},
    targetId: event.targetId || null,
    type: event.type
  }
}

export function chainAuditEvent(event: HashableAuditEvent, previousEvent?: AuditEvent): AuditEvent {
  const previousEventHash = previousEvent?.eventHash || GENESIS_AUDIT_HASH
  const chainIndex = Number.isFinite(previousEvent?.chainIndex) ? Number(previousEvent?.chainIndex) + 1 : 1
  const payloadHash = sha256Hex(stableStringify(payloadFor(event)))
  const eventHash = sha256Hex(stableStringify({ chainIndex, payloadHash, previousEventHash }))
  return { ...event, chainIndex, previousEventHash, payloadHash, eventHash }
}

export function verifyAuditChain(events: AuditEvent[]) {
  const chronological = [...events].sort((a, b) => (a.chainIndex || 0) - (b.chainIndex || 0))
  let previousHash = GENESIS_AUDIT_HASH
  for (const event of chronological) {
    if (!event.eventHash || !event.payloadHash || !event.chainIndex) {
      return { valid: false, failedEventId: event.id, reason: 'Event is missing hash-chain fields.' }
    }
    const payloadHash = sha256Hex(stableStringify(payloadFor(event)))
    const eventHash = sha256Hex(stableStringify({
      chainIndex: event.chainIndex,
      payloadHash,
      previousEventHash: previousHash
    }))
    if (event.previousEventHash !== previousHash || event.payloadHash !== payloadHash || event.eventHash !== eventHash) {
      return { valid: false, failedEventId: event.id, reason: 'Event hash does not match its payload or predecessor.' }
    }
    previousHash = event.eventHash
  }
  return { valid: true, terminalHash: previousHash, eventCount: chronological.length }
}
