async function getHandler (req, reply) {
  const key = `${this.config.externalPrefix}:${req.params.id}`
  const cached = await this.get({ key })
  return cached === false ? '' : cached.contents.join('\n')
}

export default {
  method: ['GET'],
  handler: async function (req, reply) {
    const { importPkg } = this.app.bajo
    const mime = await importPkg('waibu:mime')
    reply.header('Content-Type', mime.getType(req.params.format))
    reply.header('Content-Language', req.lang)
    if (req.method === 'GET') return await getHandler.call(this, req, reply)
  }
}
