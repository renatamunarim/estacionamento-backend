import { DataTypes } from 'sequelize'
import { database } from '../database.js'
import { Veiculo } from './veiculos.js'
import { Usuario } from './usuario.js'

const Acesso = database.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.ENUM('entrada', 'saida'),
    allowNull: false
  },
  horario: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
})

Acesso.belongsTo(Veiculo, {
  foreignKey: 'veiculoId'
})

Acesso.belongsTo(Usuario, {
  foreignKey: 'usuarioId'
})


export { Acesso }