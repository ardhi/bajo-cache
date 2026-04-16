import { handler } from './dobo@after-update-record.js'

async function afterRemoveRecord (name, id, result, opts) {
  if (!this.app.bajoCache) return
  await handler.call(this, name, id)
}

export default afterRemoveRecord
