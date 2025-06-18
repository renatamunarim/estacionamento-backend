import { Usuario } from "../models/usuario.js"
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

// Segredo usado pra gerar e validar token JWT
const segredoJwt = process.env.SEGREDO_JWT

const autenticarUsuario = async (req, res) => {

    try {
        const { email, senha } = req.body
        if (!email || !senha) {
            return res.status(400).send({ mensagem: 'Dados incompletos' })
        }

        const usuario = await Usuario.findOne({ where: { email } })
        if (!usuario) {
            return res.status(404).send({ mensagem: 'Usuário não encontrado' })
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

        if (!senhaCorreta) {
            return res.status(403).send({ mensagem: "Credenciais inválidas" });
        }
        // Senha correta, precisa gerar token
        const conteudoDoToken = {
            idUsuario: usuario.id,
            tipo: usuario.tipo
        }
        // Usar o metodo sign do jwt para gerar o token
        const token = jwt.sign(conteudoDoToken, segredoJwt, { expiresIn: '1d' })
        return res.status(200).send({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            }
        });
    } catch (erro) {
        console.log(erro)
        res.status(500).send({ mensagem: 'Ocorreu um erro inesperado' })
    }
}

export { autenticarUsuario }