async function handler (name, id, options) {
  const { getModel } = this.app.dobo
  const model = getModel(name)
  if (model.cache.ttlDur === 0 || options.noCache) return
  const result = await this.get({ model, id, options })
  if (result) {
    result.cached = true
    throw this.error('_cached', { code: 'cachedResult', data: options.dataOnly ? result.data : result })
  }
}

const beforeGetRecord = {
  level: 0,
  handler
}

export default beforeGetRecord
