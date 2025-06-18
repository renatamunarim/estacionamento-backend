import { Veiculo } from "../models/veiculos.js"

const registrarVeiculo = async (req, res) => {
  try {
    const { placa, modelo, cor } = req.body
    const id_usuario = req.id_usuario

    if (!placa || !modelo || !cor) {
      return res.status(400).send({ mensagem: 'Dados incompletos' })
    }

    const placaExistente = await Veiculo.findOne({ where: { placa } })
    if (placaExistente) {
      return res.status(400).send({ mensagem: 'Veículo com esta placa já está cadastrado' })
    }

    await Veiculo.create({
      placa,
      modelo,
      cor,
      id_usuario
    })

    return res.status(201).send({ mensagem: 'Veículo cadastrado com sucesso' })
  } catch (erro) {
    console.error(erro)
    return res.status(500).send({ mensagem: 'Erro ao cadastrar o veículo' })
  }
}


const listarVeiculosDoUsuario = async (req, res) => {
  try {
    const id_usuario = req.id_usuario

    const veiculos = await Veiculo.findAll({
      where: { id_usuario }
    })

    return res.status(200).send(veiculos)
  } catch (erro) {
    console.error(erro)
    return res.status(500).send({ mensagem: 'Erro ao buscar os veículos' })
  }
}

const editarVeiculo = async (req, res) => {
  try {
    const { id } = req.params
    const { placa, modelo, cor } = req.body
    const id_usuario = req.id_usuario

    const veiculo = await Veiculo.findOne({ where: { id, id_usuario } })

    if (!veiculo) {
      return res.status(404).send({ mensagem: 'Veículo não encontrado ou não pertence a você' })
    }

    if (placa) veiculo.placa = placa
    if (modelo) veiculo.modelo = modelo
    if (cor) veiculo.cor = cor

    await veiculo.save()

    return res.status(200).send({ mensagem: 'Veículo atualizado com sucesso', veiculo })
  } catch (erro) {
    console.error(erro)
    return res.status(500).send({ mensagem: 'Erro ao editar veículo' })
  }
}

const excluirVeiculo = async (req, res) => {
  try {
    const { id } = req.params
    const id_usuario = req.id_usuario

    const veiculo = await Veiculo.findOne({ where: { id, id_usuario } })

    if (!veiculo) {
      return res.status(404).send({ mensagem: 'Veículo não encontrado ou não pertence a você' })
    }

    await veiculo.destroy()

    return res.status(200).send({ mensagem: 'Veículo excluído com sucesso' })
  } catch (erro) {
    console.error(erro)
    return res.status(500).send({ mensagem: 'Erro ao excluir o veículo' })
  }
}

export { registrarVeiculo, listarVeiculosDoUsuario, editarVeiculo, excluirVeiculo } 