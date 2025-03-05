async function init () {
  this.fnCache = []
  if (!this.app.dobo) return
  const models = this.app.dobo.schemas.filter(s => s.connection === 'memory').map(m => m.name)
  this.config.doboModel.disabled.push('CacheStorage', ...models)
}

export default init
