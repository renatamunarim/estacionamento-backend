import { DataTypes } from 'sequelize'
import { database } from '../database.js'
import { Usuario } from './usuario.js'


const Veiculo = database.define('Veiculo', {
  placa: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'id'
    }
  }
  
})
Veiculo.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
})


export { Veiculo }