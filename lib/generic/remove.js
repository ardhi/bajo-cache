async function remove (opts = {}) {
  if (!this.instance) return
  await this.instance.delete(opts.key)
}

export default remove
