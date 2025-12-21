async function clear (model, action, ...args) {
  await this.clear({ model, action, args })
}

export default clear
