async function get (opts = {}) {
  const { isEmpty } = this.app.lib._
  const result = await this.instance.get(opts.key)
  return isEmpty(result) ? false : result
}

export default get
