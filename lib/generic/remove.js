async function remove (opts = {}) {
  await this.bajoCache.instance.delete(opts.key)
}

export default remove
