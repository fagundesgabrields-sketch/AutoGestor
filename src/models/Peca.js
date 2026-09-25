module.exports = (sequelize, DataTypes) => {
  const Peca = sequelize.define('Peca', {
    nome: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    descricao: DataTypes.STRING(255),
    valor_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    estoque: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'pecas',
    timestamps: false
  });

  return Peca;
};
