import express from 'express'
import { registrarVeiculo, listarVeiculosDoUsuario, editarVeiculo, excluirVeiculo } from '../controllers/veiculos.js'
import { validarToken } from '../middlewares/validarToken.js'
import {  registrarAcesso, listarAcessos } from '../controllers/acesso.js'


const router  = express.Router()

router.post('/', validarToken, registrarVeiculo)
router.get('/', validarToken, listarVeiculosDoUsuario)
router.put('/:id', validarToken, editarVeiculo)
router.delete('/:id', validarToken, excluirVeiculo)
router.post('/acessos', validarToken, registrarAcesso)
router.get('/acessos', validarToken, listarAcessos)
export { router as routerVeiculos }