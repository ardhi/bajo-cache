async function clear (opts = {}) {
  if (!this.instance) return
  const { model, args } = opts
  const { uniq, isPlainObject, get } = this.app.lib._
  const getAllItems = (field, container, source) => {
    let item = get(source, field)
    if (item) container.push(item)
    item = get(source, 'data.' + field)
    if (item) container.push(item)
    item = get(source, 'oldData.' + field)
    if (item) container.push(item)
  }

  if (this.config.doboModel.disabled.includes(model.name)) return
  const clear = this.config.doboModel.clearOnTrigger[model.name] ?? this.config.default.clearOnTrigger
  if (!clear) return
  try {
    const query = { model: model.name }
    if (!isPlainObject(args[0])) {
      query.id = args[0]
    } else {
      let siteIds = []
      let userIds = []
      getAllItems.call(this, 'siteId', siteIds, args[0])
      getAllItems.call(this, 'userId', userIds, args[0])
      getAllItems.call(this, 'siteId', siteIds, args[1])
      getAllItems.call(this, 'userId', userIds, args[1])
      siteIds = uniq(siteIds)
      userIds = uniq(userIds)
      if (siteIds.length > 0) query.siteId = { $in: siteIds }
      if (userIds.length > 0) query.userId = { $in: userIds }
    }
    const opts = { noHook: true, noCache: true, noModelHook: true }
    const storage = this.app.dobo.getModel('CacheStorage')
    const recs = await storage.findAllRecord({ query }, opts)
    for (const rec of recs) {
      await storage.removeRecord(rec.id, opts)
    }
  } catch (err) {}
}

export default clear
