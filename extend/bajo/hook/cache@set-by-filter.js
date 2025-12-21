async function setByFilter (model, filter, record) {
  return await this.set({ model, filter, record })
}

export default setByFilter
