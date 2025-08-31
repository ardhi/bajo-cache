function removeExpired () {
  const { pullAt } = this.app.lib._
  const deleted = []
  for (const idx in this.fnCache) {
    const item = this.fnCache[idx]
    if (Date.now() > item.exp) deleted.push(idx)
  }
  pullAt(this.fnCache, deleted)
}

export default removeExpired
