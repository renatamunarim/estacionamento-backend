import { Usuario } from "../models/usuario.js"
import bcrypt from "bcrypt"


const registrarUsuario = async (req, res) => {
    try {
        const { nome, cpf, telefone, email, senha, tipo } = req.body
        if (!nome || !cpf || !telefone || !email || !senha || !tipo) {
            return res.status(400).send({ mensagem: 'Dados incompletos' })
        }
        const usuarioExistente = await Usuario.findOne({ where: { email } })
        if (usuarioExistente) {
            return res.status(400).send({ mensagem: 'Usuário já existe' })
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        await Usuario.create({
            nome,
            cpf,
            telefone,
            email,
            senha: senhaCriptografada,
            tipo,
        })
        res.status(201).send({ mensagem: 'Usuario foi criado' })
    } catch (erroDisparado) {
        res.status(500).send({ mensagem: 'Ocorreu um erro inesperado' })
    }
}

const editarUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const { nome, telefone, email } = req.body
    const id_usuario = req.id_usuario
    const tipo_usuario = req.tipo_usuario

    if (tipo_usuario !== 'admin' && parseInt(id) !== id_usuario) {
      return res.status(403).send({ mensagem: 'Acesso negado' })
    }

    const usuario = await Usuario.findByPk(id)
    if (!usuario) {
      return res.status(404).send({ mensagem: 'Usuário não encontrado' })
    }

    if (nome) usuario.nome = nome
    if (telefone) usuario.telefone = telefone
    if (email) usuario.email = email

    await usuario.save()

    return res.status(200).send({ mensagem: 'Usuário atualizado com sucesso', usuario })
  } catch (erro) {
    console.error(erro)
    return res.status(500).send({ mensagem: 'Erro ao editar usuário' })
  }
}

const excluirUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const id_usuario = req.id_usuario
    const tipo_usuario = req.tipo_usuario

    if (tipo_usuario !== 'admin' && parseInt(id) !== id_usuario) {
      return res.status(403).send({ mensagem: 'Acesso negado' })
    }

    const usuario = await Usuario.findByPk(id)
    if (!usuario) {
      return res.status(404).send({ mensagem: 'Usuário não encontrado' })
    }

    await usuario.destroy()

    return res.status(200).send({ mensagem: 'Usuário excluído com sucesso' })
  } catch (erro) {
    console.error(erro)
    return res.status(500).send({ mensagem: 'Erro ao excluir usuário' })
  }
}


export { registrarUsuario, editarUsuario, excluirUsuario }