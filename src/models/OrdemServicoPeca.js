module.exports = (sequelize, DataTypes) => {
  const OrdemServicoPeca = sequelize.define('OrdemServicoPeca', {
    ordem_servico_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    peca_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    valor_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'ordem_servico_pecas',
    timestamps: false
  });

  OrdemServicoPeca.associate = (models) => {
    OrdemServicoPeca.belongsTo(models.OrdemServico, { foreignKey: 'ordem_servico_id', as: 'ordem_servico' });
    OrdemServicoPeca.belongsTo(models.Peca, { foreignKey: 'peca_id', as: 'peca' });
  };

  return OrdemServicoPeca;
};
