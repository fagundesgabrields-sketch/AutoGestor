module.exports = (sequelize, DataTypes) => {
  const Veiculo = sequelize.define('Veiculo', {
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    placa: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    marca: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    modelo: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    ano: DataTypes.INTEGER,
    cor: DataTypes.STRING(30)
  }, {
    tableName: 'veiculos',
    timestamps: false
  });

  Veiculo.associate = (models) => {
    Veiculo.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
    Veiculo.hasMany(models.OrdemServico, { foreignKey: 'veiculo_id', as: 'ordens_servico' });
  };

  return Veiculo;
};
