module.exports = (sequelize, DataTypes) => {
  const OrdemServico = sequelize.define('OrdemServico', {
    veiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mecanico_id: DataTypes.INTEGER,
    data_abertura: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    data_conclusao: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM('Aberta', 'Em Andamento', 'Concluida', 'Cancelada'),
      defaultValue: 'Aberta'
    },
    descricao_problema: DataTypes.TEXT,
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }
  }, {
    tableName: 'ordens_servico',
    timestamps: false
  });

  OrdemServico.associate = (models) => {
    OrdemServico.belongsTo(models.Veiculo, { foreignKey: 'veiculo_id', as: 'veiculo' });
    OrdemServico.belongsTo(models.Mecanico, { foreignKey: 'mecanico_id', as: 'mecanico' });
    OrdemServico.hasMany(models.OrdemServicoServico, { foreignKey: 'ordem_servico_id', as: 'servicos_os' });
    OrdemServico.hasMany(models.OrdemServicoPeca, { foreignKey: 'ordem_servico_id', as: 'pecas_os' });
    OrdemServico.hasMany(models.Pagamento, { foreignKey: 'ordem_servico_id', as: 'pagamentos' });
  };

  return OrdemServico;
};
