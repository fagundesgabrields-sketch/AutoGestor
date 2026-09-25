module.exports = (sequelize, DataTypes) => {
  const OrdemServicoServico = sequelize.define('OrdemServicoServico', {
    ordem_servico_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    servico_id: {
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
    tableName: 'ordem_servico_servicos',
    timestamps: false
  });

  OrdemServicoServico.associate = (models) => {
    OrdemServicoServico.belongsTo(models.OrdemServico, { foreignKey: 'ordem_servico_id', as: 'ordem_servico' });
    OrdemServicoServico.belongsTo(models.Servico, { foreignKey: 'servico_id', as: 'servico' });
  };

  return OrdemServicoServico;
};
