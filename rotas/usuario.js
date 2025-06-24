import express from 'express'
import { registrarUsuario, editarUsuario, excluirUsuario, Perfil } from '../controllers/usuario.js'
import { autenticarUsuario } from '../controllers/login.js'
import { validarToken} from '../middlewares/validarToken.js'

const router = express.Router()

router.post('/cadastro', registrarUsuario)
router.post('/login', autenticarUsuario)
router.get('/perfil', validarToken, Perfil)
router.put('/usuario/:id', validarToken, editarUsuario)
router.delete('/usuario/:id', validarToken, excluirUsuario)


export { router }