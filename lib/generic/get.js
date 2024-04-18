async function get (opts = {}) {
  const { isEmpty } = this.bajo.helper._
  const result = await this.bajoCache.instance.get(opts.key)
  return isEmpty(result) ? false : result
}

export default get
