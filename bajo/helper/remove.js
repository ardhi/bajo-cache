import removeRs from '../../lib/result-set/remove.js'
import removeGeneric from '../../lib/generic/remove.js'

async function remove (opts = {}) {
  if (opts.coll && (opts.filter || opts.id)) return await removeRs.call(this, opts)
  return await removeGeneric.call(this, opts)
}

export default remove
