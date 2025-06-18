
const verificarAdmin = (req, res, next) => {
  if (req.tipo_usuario !== 'admin') {
    return res.status(403).send({ mensagem: 'Acesso permitido somente para administradores' })
  }

  next()
}

export { verificarAdmin }