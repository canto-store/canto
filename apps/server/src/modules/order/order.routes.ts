import express from 'express';
import {
  createOrderHandler,
  getOrdersHandler,
  getOrdersByUserIdHandler,
  getOrderByIdHandler,
  updateOrderItemStatusHandler,
} from './order.controller';

const router = express.Router();



router.post('/', createOrderHandler);
router.get('/', getOrdersHandler); 
router.get('/user/:userId', getOrdersByUserIdHandler);
router.get('/:orderId', getOrderByIdHandler);
router.patch(
  '/item/:orderItemId/status',
  updateOrderItemStatusHandler 
);

export default router;
