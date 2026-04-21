async function handler (name, filter, options) {
  const { getModel } = this.app.dobo
  const model = getModel(name)
  if (model.cache.ttlDur === 0 || options.noCache) return
  const { cloneDeep } = this.app.lib._
  options.cFilter = cloneDeep(filter)
  const result = await this.get({ model, filter: options.cFilter, options })
  if (result) {
    result.cached = true
    throw this.error('_cached', { code: 'cachedResult', data: options.dataOnly ? result.data : result })
  }
}

const beforeFindRecord = {
  level: 0,
  handler
}

export default beforeFindRecord
