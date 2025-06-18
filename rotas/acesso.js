import express from 'express'
import { validarToken } from '../middlewares/validarToken.js'
import { verificarAdmin } from '../middlewares/verificarAdmin.js'
import { Acesso } from '../models/acesso.js'

const router = express.Router()

router.get('/perfil', validarToken, (req, res) => {
    res.send({ mensagem: `Usuário autenticado: ID ${req.id_usuario}` })
})
router.get('/admin/usuarios', validarToken, verificarAdmin, (req, res) => {
    res.send({ mensagem: 'Acesso liberado apenas para administradores' })
})
router.get('/vagas-disponiveis', validarToken, verificarAdmin, async (req, res) => {
    try {
        const capacidadeMaxima = 10
        const totalEntradas = await Acesso.count({ where: { tipo: 'entrada' } })
        const totalSaidas = await Acesso.count({ where: { tipo: 'saida' } })

        const ocupacaoAtual = totalEntradas - totalSaidas
        const vagasDisponiveis = capacidadeMaxima - ocupacaoAtual

        return res.status(200).send({
            capacidadeMaxima,
            ocupacaoAtual,
            vagasDisponiveis
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({ mensagem: 'Erro ao obter informações das vagas' })
    }
})
router.get('/relatorio-acessos', validarToken, verificarAdmin, async (req, res) => {
  try {
    const acessos = await Acesso.findAll({
      include: [
        {
          association: 'usuario', // Certifique-se que esteja associado com esse alias
          attributes: ['nome', 'tipo']
        },
        {
          association: 'veiculo',
          attributes: ['placa', 'modelo']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    return res.status(200).send(acessos)
  } catch (error) {
    console.error(error)
    res.status(500).send({ mensagem: 'Erro ao gerar relatório de acessos' })
  }
})

export { router as routerAcesso }