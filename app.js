import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { router } from './rotas/usuario.js'
import { routerVeiculos  } from './rotas/veiculos.js'
import { database } from './database.js'
import { routerAcesso } from './rotas/acesso.js'


import { aplicarRelacionamentos } from './models/relacionamentos.js'
aplicarRelacionamentos()

const app = express()

app.use(cors({ origin: '*' }))   
app.use(express.json())          
app.use('/', router)          
app.use('/', routerVeiculos)  
app.use('/', routerAcesso)

 

await database.sync()

app.listen(3000, () => console.log('servidor rodando'))