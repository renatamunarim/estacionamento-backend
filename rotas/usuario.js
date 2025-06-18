import express from 'express'
import { registrarUsuario, editarUsuario, excluirUsuario } from '../controllers/usuario.js'
import { autenticarUsuario } from '../controllers/login.js'
import { validarToken} from '../middlewares/validarToken.js'

const router = express.Router()

router.post('/usuario', registrarUsuario)
router.post('/login', autenticarUsuario)
router.put('/usuario/:id', validarToken, editarUsuario)
router.delete('/usuario/:id', validarToken, excluirUsuario)


export { router }