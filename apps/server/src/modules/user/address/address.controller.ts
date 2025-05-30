import { Request, Response, NextFunction } from "express";
import AddressService from "./address.service";
import { CreateAddressDto } from "./address.types";
import { AuthRequest } from "../../../middlewares/auth.middleware";

class AddressController {
  private readonly addressService = new AddressService();

  public async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const body = req.body;
      const address = await this.addressService.create({
        ...body,
        user_id: userId,
      });
      res.status(201).json(address);
    } catch (err) {
      next(err);
    }
  }

  public async getAll(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const addresses = await this.addressService.findAll();
      res.status(200).json(addresses);
    } catch (err) {
      next(err);
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const address = await this.addressService.findOne(id);
      res.status(200).json(address);
    } catch (err) {
      next(err);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const dto: CreateAddressDto = req.body;
      const address = await this.addressService.update(id, dto);
      res.status(200).json(address);
    } catch (err) {
      next(err);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await this.addressService.delete(id);
      res.status(200).json({ message: "Address deleted" });
    } catch (err) {
      next(err);
    }
  }

  public async getByUserId(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const addresses = await this.addressService.findByUserId(req.user?.id);
      res.status(200).json(addresses);
    } catch (err) {
      next(err);
    }
  }
}

export default AddressController;
