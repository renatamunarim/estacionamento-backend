import express from 'express'
import { validarToken } from '../middlewares/validarToken.js'
import { verificarAdmin } from '../middlewares/verificarAdmin.js'
import {  registrarAcesso, listarAcessos, contagemDeVagas, relatorioAcessos } from '../controllers/acesso.js'


const router = express.Router()

router.post('/acessos-adm', validarToken, verificarAdmin, registrarAcesso)
router.get('/acessos', validarToken, listarAcessos)
router.get('/vagas-disponiveis', validarToken, contagemDeVagas )
router.get('/relatorio-acessos', validarToken, verificarAdmin, relatorioAcessos)

export { router as routerAcesso }