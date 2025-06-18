import express from 'express'
import { registrarVeiculo, listarVeiculosDoUsuario, editarVeiculo, excluirVeiculo } from '../controllers/veiculos.js'
import { validarToken } from '../middlewares/validarToken.js'



const router  = express.Router()

router.post('/veiculos', validarToken, registrarVeiculo)
router.get('/veiculos', validarToken, listarVeiculosDoUsuario)
router.put('/veiculos/:id', validarToken, editarVeiculo)
router.delete('/veiculos/:id', validarToken, excluirVeiculo)

export { router as routerVeiculos }