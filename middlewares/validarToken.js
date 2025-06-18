import jwt from 'jsonwebtoken'

const segredoJwt = process.env.SEGREDO_JWT

const validarToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
      return res.status(401).send({ mensagem: 'Acesso negado: token não fornecido' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).send({ mensagem: 'Acesso negado: token inválido' })
    }

    const conteudoDoToken = jwt.verify(token, segredoJwt)

    req.id_usuario = conteudoDoToken.idUsuario
    req.tipo_usuario = conteudoDoToken.tipo

    next()
  } catch (erro) {
    return res.status(401).send({ mensagem: 'Acesso negado' })
  }
}

export { validarToken }