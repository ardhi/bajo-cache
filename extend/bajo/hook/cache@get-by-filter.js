async function getByFilter (model, filter) {
  return await this.get({ model, filter })
}

export default getByFilter
