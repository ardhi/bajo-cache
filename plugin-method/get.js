import getRs from '../lib/result-set/get.js'
import getGeneric from '../lib/generic/get.js'
import getFn from '../lib/function/get.js'

async function get (opts = {}) {
  if (opts.model && (opts.filter || opts.id)) return await getRs.call(this, opts)
  if (opts.key.startsWith('fn:')) return await getFn.call(this, opts)
  return await getGeneric.call(this, opts)
}

export default get
