module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
    nome: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: DataTypes.STRING(120),
    endereco: DataTypes.STRING(200)
  }, {
    tableName: 'clientes',
    underscored: true
  });

  Cliente.associate = (models) => {
    Cliente.hasMany(models.Veiculo, { foreignKey: 'cliente_id', as: 'veiculos' });
  };

  return Cliente;
};
