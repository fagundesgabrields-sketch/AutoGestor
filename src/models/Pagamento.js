module.exports = (sequelize, DataTypes) => {
  const Pagamento = sequelize.define('Pagamento', {
    ordem_servico_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    forma_pagamento: {
      type: DataTypes.ENUM('Dinheiro', 'Cartao', 'Pix', 'Boleto'),
      allowNull: false
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    data_pagamento: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('Pendente', 'Pago', 'Cancelado'),
      defaultValue: 'Pendente'
    }
  }, {
    tableName: 'pagamentos',
    timestamps: false
  });

  Pagamento.associate = (models) => {
    Pagamento.belongsTo(models.OrdemServico, { foreignKey: 'ordem_servico_id', as: 'ordem_servico' });
  };

  return Pagamento;
};
