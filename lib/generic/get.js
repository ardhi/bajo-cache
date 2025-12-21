async function get (opts = {}) {
  if (!this.instance) return
  const { isEmpty } = this.app.lib._
  const result = await this.instance.get(opts.key)
  return isEmpty(result) ? false : result
}

export default get
