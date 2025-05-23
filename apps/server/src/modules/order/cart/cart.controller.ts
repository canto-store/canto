import { Request, Response, NextFunction } from "express";
import CartService from "./cart.service";
import {
  CreateCartItemDto,
  UpdateCartItemDto,
} from "./cart.types";

class CartController {
  private readonly service = new CartService();

  async getCartByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.userId);
      const cart = await this.service.getCartByUser(userId);
      res.status(200).json(cart);
    } catch (err) {
      next(err);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.userId);
      await this.service.clearCart(userId);
      res.status(200).json({ message: "Cart cleared" });
    } catch (err) {
      next(err);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as CreateCartItemDto;
      const item = await this.service.addItem(dto);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const dto = req.body as UpdateCartItemDto;
      await this.service.updateItem(id, dto);
      res.status(200).json({ message: "Cart item updated" });
    } catch (err) {
      next(err);
    }
  }

  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await this.service.deleteItem(id);
      res.status(200).json({ message: "Cart item removed" });
    } catch (err) {
      next(err);
    }
  }
}

export default CartController;
