export async function handler (name, id) {
  const { clear } = this.app.bajoCache
  await clear({ key: `dobo|${name}|getRecord|${id}` })
  await clear({ key: `dobo|${name}|findRecord` })
  await clear({ key: `dobo|${name}|findAllRecord` })
  await clear({ key: `dobo|${name}|findOneRecord` })
}

async function afterUpdateRecord (name, id, input, result, opts) {
  if (!this.app.bajoCache) return
  await handler.call(this, name, id)
}

export default afterUpdateRecord
