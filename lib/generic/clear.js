async function clear (opts) {
  if (!this.instance) return
  this.instance.clear()
}

export default clear
