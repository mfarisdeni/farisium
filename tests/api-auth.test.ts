import { test } from 'node:test'
import assert from 'node:assert/strict'
import { extractBearerToken, ApiError, errorResponse, toErrorMessage } from '../lib/api.ts'

test('extractBearerToken returns the token for a valid header', () => {
  assert.equal(extractBearerToken('Bearer abc.def.ghi'), 'abc.def.ghi')
  assert.equal(extractBearerToken('Bearer   spaced.token '), 'spaced.token')
})

test('extractBearerToken returns null for missing or malformed headers', () => {
  assert.equal(extractBearerToken(null), null)
  assert.equal(extractBearerToken(undefined), null)
  assert.equal(extractBearerToken(''), null)
  assert.equal(extractBearerToken('Basic abc'), null)
  assert.equal(extractBearerToken('Bearer   '), null)
})

test('ApiError carries status, code, and fieldErrors', () => {
  const err = new ApiError('Batas harian tercapai.', {
    status: 429,
    code: 'daily_limit_reached',
  })
  assert.equal(err.status, 429)
  assert.equal(err.code, 'daily_limit_reached')
  assert.equal(toErrorMessage(err), 'Batas harian tercapai.')
})

test('errorResponse maps ApiError to its status/code without leaking internals', async () => {
  const res = errorResponse(new ApiError('Teriak saja.', { status: 400, code: 'bad_request' }))
  assert.equal(res.status, 400)
  const body = await res.json()
  assert.equal(body.error, 'Teriak saja.')
  assert.equal(body.code, 'bad_request')
  assert.ok(!('stack' in body))
})

test('errorResponse sanitizes unexpected errors to a generic 500', async () => {
  const res = errorResponse(new Error('Environment FIREBASE_PRIVATE_KEY=super-secret'))
  assert.equal(res.status, 500)
  const body = await res.json()
  assert.equal(body.code, 'internal_error')
  assert.ok(!JSON.stringify(body).includes('FIREBASE_PRIVATE_KEY'))
  assert.ok(!JSON.stringify(body).includes('super-secret'))
})