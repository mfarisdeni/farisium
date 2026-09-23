import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  sanitizeFileName,
  buildInputR2Key,
  buildOutputR2Key,
  validateUploadInput,
  isAllowedContentType,
  MAX_FILE_SIZE_BYTES,
} from '../lib/r2/keys.ts'

test('sanitizeFileName strips path separators and traversal', () => {
  assert.equal(sanitizeFileName('../../etc/passwd'), 'passwd')
  assert.equal(sanitizeFileName('etc/passwd'), 'passwd')
  assert.equal(sanitizeFileName('..\\..\\win.ini'), 'win.ini')
  assert.equal(sanitizeFileName('receipt (1).jpg'), 'receipt (1).jpg')
  assert.equal(sanitizeFileName(''), 'file')
})

test('buildInputR2Key produces a safe, content-type-locked key', () => {
  const key = buildInputR2Key('uid123', 'job456', '../../../evil.jpg', 'image/jpeg')
  assert.equal(key, 'users/uid123/jobs/job456/input/evil.jpg')
  // even a malicious .html filename gets an enforced image extension
  const key2 = buildInputR2Key('uid', 'job', 'note.html', 'image/jpeg')
  assert.ok(key2.endsWith('/input/note.jpg'))
})

test('buildOutputR2Key is deterministic per user + job', () => {
  assert.equal(
    buildOutputR2Key('uid', 'jobid'),
    'users/uid/jobs/jobid/output/receipt.xlsx',
  )
})

test('validateUploadInput rejects unsupported content types', () => {
  assert.throws(
    () => validateUploadInput({ fileName: 'a.pdf', contentType: 'application/pdf', fileSize: 1000 }),
    /JPG, PNG, atau WebP/,
  )
})

test('validateUploadInput rejects oversized files', () => {
  assert.throws(
    () =>
      validateUploadInput({
        fileName: 'big.png',
        contentType: 'image/png',
        fileSize: MAX_FILE_SIZE_BYTES + 1,
      }),
    /10 MB/,
  )
})

test('validateUploadInput rejects invalid sizes and empty names', () => {
  assert.throws(() => validateUploadInput({ fileName: '', contentType: 'image/png', fileSize: 1 }))
  assert.throws(() => validateUploadInput({ fileName: 'a.png', contentType: 'image/png', fileSize: 0 }))
  assert.throws(() => validateUploadInput({ fileName: 'a.png', contentType: 'image/png', fileSize: Number.NaN }))
})

test('validateUploadInput accepts valid jpg/png/webp uploads', () => {
  for (const contentType of ['image/jpeg', 'image/png', 'image/webp']) {
    assert.doesNotThrow(() =>
      validateUploadInput({ fileName: 'receipt.jpg', contentType, fileSize: 1024 }),
    )
  }
})

test('isAllowedContentType only accepts images', () => {
  assert.equal(isAllowedContentType('image/jpeg'), true)
  assert.equal(isAllowedContentType('image/png'), true)
  assert.equal(isAllowedContentType('image/webp'), true)
  assert.equal(isAllowedContentType('image/gif'), false)
  assert.equal(isAllowedContentType('text/html'), false)
})