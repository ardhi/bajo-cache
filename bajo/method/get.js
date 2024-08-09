import getRs from '../../lib/result-set/get.js'
import getGeneric from '../../lib/generic/get.js'

async function get (opts = {}) {
  if (opts.coll && (opts.filter || opts.id)) return await getRs.call(this, opts)
  return await getGeneric.call(this, opts)
}

export default get
