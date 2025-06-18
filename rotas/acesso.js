import express from 'express'
import { validarToken } from '../middlewares/validarToken.js'
import { verificarAdmin } from '../middlewares/verificarAdmin.js'
import {  registrarAcesso, listarAcessos, contagemDeVagas, relatorioAcessos } from '../controllers/acesso.js'
import { Acesso } from '../models/acesso.js'

const router = express.Router()

router.post('/acessos', validarToken, verificarAdmin, registrarAcesso)
router.get('/acessos', validarToken, verificarAdmin, listarAcessos)
router.get('/vagas-disponiveis', validarToken, verificarAdmin, contagemDeVagas )
router.get('/relatorio-acessos', validarToken, verificarAdmin, relatorioAcessos)

export { router as routerAcesso }