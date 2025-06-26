import { Acesso } from '../models/acesso.js'
import { Veiculo } from '../models/veiculos.js'
import { Usuario } from '../models/usuario.js'
import { Op } from "sequelize"

const capacidadeMaxima = 10

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

    const totalAcessosDoVeiculo = await Acesso.count({
      where: { veiculoId: veiculo.id }
    })

    const estaDentro = totalAcessosDoVeiculo % 2 === 1
    if (tipo === 'entrada') {
      if (estaDentro) {
        return res.status(403).send({ mensagem: 'Este veículo já está no estacionamento.' })
      }

      const totalEntradas = await Acesso.count({ where: { tipo: 'entrada' } })
      const totalSaidas = await Acesso.count({ where: { tipo: 'saida' } })
      const ocupacaoAtual = totalEntradas - totalSaidas

      if (ocupacaoAtual >= capacidadeMaxima) {
        return res.status(403).send({ mensagem: 'Estacionamento lotado. Aguarde vaga.' })
      }
    }

    if (tipo === 'saida') {
      if (!estaDentro) {
        return res.status(403).send({ mensagem: 'Este veículo não esta estacionado.' })
      }
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
      include: [{ model: Veiculo, attributes: ['placa'],}],
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
      vagasDisponiveis,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ mensagem: 'Erro ao obter informações das vagas' })
  }
}
const relatorioAcessos = async (req, res) => {
  try {
    const { usuario, placa } = req.query

    const whereVeiculo = {}
    const whereUsuario = {}

    if (placa) {
      whereVeiculo.placa = { [Op.iLike]: `%${placa}%` }
    }

    if (usuario) {
      whereUsuario.nome = { [Op.iLike]: `%${usuario}%` }
    }

    const acessos = await Acesso.findAll({
      include: [
        {
          association: 'veiculo',
          attributes: ['placa'],
          where: whereVeiculo,
          include: {
            association: 'usuario',
            attributes: ['nome'],
            where: whereUsuario
          }
        }
      ],
      order: [['horario', 'DESC']]
    })

    return res.status(200).send(acessos)
  } catch (error) {
    console.error(error)
    res.status(500).send({ mensagem: 'Erro ao gerar relatório de acessos' })
  }
}

export { registrarAcesso, listarAcessos, contagemDeVagas, relatorioAcessos }