async function handler (name, filter, result, options) {
  const { getModel } = this.app.dobo
  const model = getModel(name)
  if (model.cache.ttlDur === 0 || options.noCache || !options.cFilter) return
  await this.set({ model, filter: options.cFilter, result, options })
}

const afterFindRecord = {
  level: 1000,
  handler
}

export default afterFindRecord
