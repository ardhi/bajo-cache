import removeRs from '../lib/result-set/remove.js'
import removeGeneric from '../lib/generic/remove.js'
import removeFn from '../lib/function/remove.js'

async function remove (opts = {}) {
  if (opts.model && (opts.filter || opts.id)) return await removeRs.call(this, opts)
  if (opts.key.startsWith('fn:')) return await removeFn.call(this, opts)
  return await removeGeneric.call(this, opts)
}

export default remove
