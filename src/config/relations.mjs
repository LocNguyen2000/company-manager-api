export default function addRelations(sequelize, DataTypes) {
  const { Product, Office, Employee, OrderDetail, ProductLine, User, Order, Customer, Role } = sequelize.models;

  Customer.hasOne(User, { foreignKey: { name: 'customerNumber', type: DataTypes.INTEGER } });
  User.belongsTo(Customer, { foreignKey: { name: 'customerNumber', type: DataTypes.INTEGER } });

  Employee.hasOne(User, { foreignKey: { name: 'employeeNumber', type: DataTypes.INTEGER } });
  User.belongsTo(Employee, { foreignKey: { name: 'employeeNumber', type: DataTypes.INTEGER } });

  Employee.belongsTo(Role, {
    foreignKey: {
      name: 'role',
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  });
  Role.hasMany(Employee, {
    foreignKey: {
      name: 'role',
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
  });

  Employee.belongsTo(Employee, {
    foreignKey: {
      name: 'reportsTo',
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
  });
  Employee.hasMany(Employee, {
    foreignKey: {
      name: 'reportsTo',
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  });

  Customer.belongsTo(Employee, {
    foreignKey: {
      name: 'salesRepEmployeeNumber',
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  });
  Employee.hasMany(Customer, {
    foreignKey: {
      name: 'salesRepEmployeeNumber',
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  });

  Order.belongsTo(Customer, { foreignKey: { name: 'customerNumber', type: DataTypes.INTEGER, allowNull: false } });
  Customer.hasMany(Order, { foreignKey: { name: 'customerNumber', type: DataTypes.INTEGER, allowNull: false } });

  Employee.belongsTo(Office, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    foreignKey: {
      name: 'officeCode',
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
      },
    },
  });
  
  Office.hasMany(Employee, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    foreignKey: {
      name: 'officeCode',
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
      },
    },
  });

  Order.hasMany(OrderDetail, {foreignKey: 'orderNumber'})
  Product.hasMany(OrderDetail, {foreignKey: 'productCode'})

  Order.belongsToMany(Product, {
    through: OrderDetail,
    foreignKey: {
      name: 'orderNumber',
    },
  });

  Product.belongsToMany(Order, {
    through: OrderDetail,
    foreignKey: {
      name: 'productCode',
    },
  });

  Order.hasMany(OrderDetail, { foreignKey: { name: 'orderNumber'}})
  Product.hasMany(OrderDetail, { foreignKey: { name: 'productCode'}})

  ProductLine.hasMany(Product, {
    foreignKey: {
      name: 'productLine',
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [0, 50],
      },
    },
  });

  Product.belongsTo(ProductLine, {
    foreignKey: {
      name: 'productLine',
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [0, 50],
      },
    },
  });
}
