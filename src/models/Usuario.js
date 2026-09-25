module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    nome: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    login: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    perfil: {
      type: DataTypes.ENUM('recepcao', 'mecanico', 'gestor'),
      allowNull: false
    }
  }, {
    tableName: 'usuarios',
    timestamps: false
  });

  return Usuario;
};
