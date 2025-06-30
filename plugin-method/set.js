import setRs from '../lib/result-set/set.js'
import setGeneric from '../lib/generic/set.js'
import setFn from '../lib/function/set.js'

async function set (opts = {}) {
  if (opts.model && (opts.filter || opts.id)) return await setRs.call(this, opts)
  if (opts.key.startsWith('fn:')) return await setFn.call(this, opts)
  return await setGeneric.call(this, opts)
}

export default set
