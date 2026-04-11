async function storage () {
  return {
    common: {
      formatValue: {
        exp: (val, data, { req } = {}) => {
          const dt = new Date(data.exp)
          return req.format(dt, 'datetime')
        }
      }
    }
  }
}

export default storage
