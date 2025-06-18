import { Usuario } from './usuario.js'
import { Veiculo } from './veiculos.js'
import { Acesso } from './acesso.js'

export function aplicarRelacionamentos() {
    Usuario.hasMany(Veiculo, {
        foreignKey: 'id_usuario'
    })

    Veiculo.belongsTo(Usuario, {
        foreignKey: 'id_usuario'
    })

    Acesso.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' })

    Acesso.belongsTo(Veiculo, { foreignKey: 'veiculoId', as: 'veiculo' })
}