async function getById (model, id) {
  return await this.get({ model, id })
}

export default getById
