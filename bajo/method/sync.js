async function sync (opts) {
  const item = await this.get(opts)
  if (item) return item
  await this.set(opts)
  return opts.value
}

export default sync
