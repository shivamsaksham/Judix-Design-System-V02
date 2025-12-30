import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const UI_DIR = __dirname
const VALID_EXTENSIONS = new Set(['.ts', '.tsx'])
const IGNORED_FILES = new Set(['index.ts'])
const IGNORED_SUFFIXES = ['.test.ts', '.spec.ts', '.d.ts']

const regex = /export\s+\*\s+from\s+['"]\.\/([^'"\n]+)['"]/g

type DiffResult = {
  missingExports: string[]
  staleExports: string[]
}

function getComponentNames(): string[] {
  return readdirSync(UI_DIR)
    .filter((file) => {
      if (IGNORED_FILES.has(file)) return false
      if (IGNORED_SUFFIXES.some((suffix) => file.endsWith(suffix))) return false
      return VALID_EXTENSIONS.has(path.extname(file))
    })
    .map((file) => path.basename(file, path.extname(file)))
    .sort()
}

function getIndexExports(): string[] {
  const indexPath = path.join(UI_DIR, 'index.ts')
  const indexSource = readFileSync(indexPath, 'utf8')
  const exports = new Set<string>()
  let match: RegExpExecArray | null

  // Matches statements like: export * from './button'
  while ((match = regex.exec(indexSource)) !== null) {
    exports.add(match[1])
  }

  return Array.from(exports).sort()
}

function diffSets(expected: string[], actual: string[]): DiffResult {
  const expectedSet = new Set(expected)
  const actualSet = new Set(actual)

  const missingExports = expected.filter((name) => !actualSet.has(name))
  const staleExports = actual.filter((name) => !expectedSet.has(name))

  return { missingExports, staleExports }
}

describe('ui barrel exports', () => {
  it('stay in sync with component files', () => {
    const components = getComponentNames()
    const exports = getIndexExports()
    const { missingExports, staleExports } = diffSets(components, exports)

    expect({ missingExports, staleExports }).toStrictEqual({
      missingExports: [],
      staleExports: [],
    })
  })
})
