import Product from "../models/products.mjs";
import Order from "../models/orders.mjs";
import OrderDetail from "../models/orderdetails.mjs";
import User from '../models/users.mjs'
import Employee from "../models/employees.mjs";
import Customer from "../models/customers.mjs";
import Role from "../models/role.mjs"
import ProductLine from '../models/productlines.mjs'
import Office from '../models/offices.mjs'

export default function addRelations(sequelize) {
  const { Product, Office, Employee, OrderDetail, ProductLine, User, Order, Customer, Role } =
    sequelize.models;

  Customer.hasOne(User, { foreignKey: 'customerNumber' });
  User.belongsTo(Customer);

  Employee.hasOne(User, { foreignKey: 'employeeNumber' });
  User.belongsTo(Employee);


  Employee.belongsTo(Role);
  Role.hasMany(Employee, { foreignKey: 'role' });

  Order.belongsTo(Customer);
  Customer.hasMany(Order, { foreignKey: 'customerNumber' });

  Employee.belongsTo(Office);
  Office.hasMany(Employee, {
    foreignKey: 'officeCode',
  });

  Order.belongsToMany(Product, {
    through: OrderDetail,
  });

  Product.belongsToMany(Order, {
    through: OrderDetail,
  });

  ProductLine.hasMany(Product, { foreignKey: 'productLine' });
  Product.belongsTo(ProductLine);
}
