module.exports = (sequelize, DataTypes) => {
  const Servico = sequelize.define('Servico', {
    nome: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    descricao: DataTypes.STRING(255),
    valor_mao_obra: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'servicos',
    timestamps: false
  });

  return Servico;
};
