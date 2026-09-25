module.exports = (sequelize, DataTypes) => {
  const Mecanico = sequelize.define('Mecanico', {
    nome: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    especialidade: DataTypes.STRING(80),
    telefone: DataTypes.STRING(20)
  }, {
    tableName: 'mecanicos',
    timestamps: false
  });

  Mecanico.associate = (models) => {
    Mecanico.hasMany(models.OrdemServico, { foreignKey: 'mecanico_id', as: 'ordens_servico' });
  };

  return Mecanico;
};
