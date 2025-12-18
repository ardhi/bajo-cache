async function remove (opts = {}) {
  await this.instance.delete(opts.key)
}

export default remove
