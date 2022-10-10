import cron from 'node-cron';
import sequelize from '../config/database.mjs';
import {Op} from 'sequelize';
import { ORDER_STATUS } from '../config/variables.mjs';

const { Order } = sequelize.models;

// schedule jobs every 5 minute > all orders which have status not canceled or shipped >
// updated date is over 30 days, system automatically change status to ‘on-hold’
const task = cron.schedule('*/5 * * * *', async () =>  {
    console.log('Start task every minute');

    try {
        // Chưa xong code
        
        // let queryFilter = { status: { [Op.not]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED]} };

        // let currentOrders =  await Order.findAll({where: queryFilter});
        
        // const currentDate = new Date();

        // for (let order of currentOrders) {
        //     order = order.toJSON();

        //     const orderDate = new Date(order.updateAt)

        //     const timeDifference = Math.abs(currentDate - orderDate);
        //     const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        //     if (dayDifference > 30){
        //         console.log('1 order is oudated');
        //         order = Object.assign(order, {
        //             status: ORDER_STATUS.ON_HOLD,
        //         })
        //     }
        // }
        

        // console.log(currentOrders);

    } catch (error) {
        console.log(error);
    }

  }, {
    scheduled: false
});

export default task;


