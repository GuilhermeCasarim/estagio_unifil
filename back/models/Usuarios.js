const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Usuarios = sequelize.define('Usuarios', { 
        login: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo_login: {
            type: DataTypes.ENUM('administrador', 'profissional', 'secretaria'),
            allowNull: false
        },
    }, {
        hooks: {
            //hash automatico da senha antes de salvar
            beforeSave: async (usuario) => {
                if (usuario.changed('senha')) {
                    usuario.senha = await bcrypt.hash(usuario.senha, 10);
                }
            }
        }
    });

    Usuarios.associate = (models) => {
        Usuarios.hasOne(models.Profissionais, {
            foreignKey: 'usuario_id',
            as: 'Profissional'
        });
    };

    return Usuarios;
};