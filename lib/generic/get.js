async function get (opts = {}) {
  const { importPkg } = this.bajo.helper
  const { isEmpty } = await importPkg('lodash-es')
  const result = await this.bajoCache.instance.get(opts.key)
  return isEmpty(result) ? false : result
}

export default get
