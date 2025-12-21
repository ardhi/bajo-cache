async function setById (model, id, record) {
  return await this.set.call({ model, id, record })
}

export default setById
