import { Acesso } from '../models/acesso.js'
import { Veiculo } from '../models/veiculos.js'
import { Usuario } from '../models/usuario.js'

const capacidadeMaxima = 5

const registrarAcesso = async (req, res) => {
  try {
    const { placa, tipo } = req.body

    if (!placa || !tipo) {
      return res.status(400).send({ mensagem: 'Placa e tipo são obrigatórios' })
    }

    const veiculo = await Veiculo.findOne({
      where: { placa },
      include: Usuario
    })

    if (!veiculo) {
      return res.status(403).send({ mensagem: 'Veículo não autorizado (placa não cadastrada)' })
    }

    if (tipo === 'entrada') {
      const totalEntradas = await Acesso.count({ where: { tipo: 'entrada' } })
      const totalSaidas = await Acesso.count({ where: { tipo: 'saida' } })
      const ocupacaoAtual = totalEntradas - totalSaidas

      if (ocupacaoAtual >= capacidadeMaxima) {
        return res.status(403).send({ mensagem: 'Estacionamento lotado. Aguarde vaga.' })
      }
    }

    if (!['entrada', 'saida'].includes(tipo)) {
      return res.status(400).send({ mensagem: 'Tipo inválido (use "entrada" ou "saida")' })
    }

    const acesso = await Acesso.create({
      tipo,
      veiculoId: veiculo.id,
      usuarioId: veiculo.id_usuario
    })

    return res.status(201).send({
      mensagem: `Acesso de ${tipo} registrado para a placa ${placa}.`,
      acesso
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send({ mensagem: 'Erro ao registrar acesso' })
  }
}

const listarAcessos = async (req, res) => {
  try {
    const usuarioId = req.id_usuario

    const acessos = await Acesso.findAll({
      where: { usuarioId },
      include: [{ model: Veiculo }],
      order: [['horario', 'DESC']]
    })

    return res.status(200).send(acessos)
  } catch (error) {
    console.error(error)
    return res.status(500).send({ mensagem: 'Erro ao buscar acessos' })
  }
}

const contagemDeVagas = async (req, res) => {
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
}
const relatorioAcessos = async (req, res) => {
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
}

export { registrarAcesso, listarAcessos, contagemDeVagas, relatorioAcessos }