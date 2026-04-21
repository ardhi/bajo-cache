async function handler (name, id, result, options) {
  const { getModel } = this.app.dobo
  const model = getModel(name)
  if (model.cache.ttlDur === 0 || options.noCache) return
  await this.set({ model, id, result, options })
}

const afterGetRecord = {
  level: 1000,
  handler
}

export default afterGetRecord
