import { COMPARE_STORAGE_KEY, readJson, writeJson } from '../lib/storage.js'

export const MAX_COMPARE_ITEMS = 3

export function readStoredCompareIds() {
  const parsed = readJson(COMPARE_STORAGE_KEY, [])
  if (!Array.isArray(parsed)) return []
  return parsed.filter((id) => typeof id === 'string').slice(0, MAX_COMPARE_ITEMS)
}

export function writeStoredCompareIds(ids) {
  return writeJson(COMPARE_STORAGE_KEY, ids.slice(0, MAX_COMPARE_ITEMS))
}
