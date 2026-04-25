import { createHash } from 'crypto'
import { clear as clearCache } from '../lib/generic.js'

export function buildKey ({ model, filter = {}, id = '', options = {} } = {}) {
  const { fmt, noResultSanitizer, refs } = options
  const { merge } = this.app.lib._
  let extra = merge({}, filter, { fmt, noResultSanitizer, refs })
  extra = createHash('md5').update(JSON.stringify(extra)).digest('hex')
  const key = `dobo|${model.name}|${options.action}|${id}|${extra}`
  return key
}

export async function clear (opts = {}) {
  if (!this.instance) return
  await clearCache.call(this, opts)
}

export async function get (opts = {}) {
  if (!this.instance) return
  const { isEmpty } = this.app.lib._
  if (opts.options.noCache || opts.model.cache.ttlDur === 0) return false
  const key = buildKey.call(this, opts)
  const result = await this.instance.get(key)
  return isEmpty(result) ? false : result
}

export async function remove (opts = {}) {
  if (!this.instance) return
  if (opts.options.noCache || opts.model.cache.ttlDur === 0) return
  const key = buildKey.call(this, opts)
  await this.instance.delete(key)
}

export async function set (opts = {}) {
  if (!this.instance) return
  if (opts.options.noCache || opts.model.cache.ttlDur === 0) return
  let ttl = opts.ttl ?? opts.model.cache.ttlDur
  if (ttl <= 0) ttl = 1
  const key = buildKey.call(this, opts)
  const value = opts.result
  await this.instance.set(key, value, ttl)
}
