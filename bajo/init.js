async function init () {
  if (!this.bajoDb) return
  const mcoll = this.bajoDb.schemas.filter(s => s.connection === 'memory').map(m => m.name)
  this.bajoCache.config.collection.disabled.push('CacheStorage', ...mcoll)
}

export default init
