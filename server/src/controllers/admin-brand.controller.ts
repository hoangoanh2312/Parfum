import { NextFunction, Request, Response } from 'express';
import * as service from '../services/admin-brand.service';
export async function listBrands(req: Request, res: Response, next: NextFunction) { try { res.status(200).json({ success: true, data: await service.listBrands(req.query) }); } catch (e) { next(e); } }
export async function createBrand(req: Request, res: Response, next: NextFunction) { try { res.status(201).json({ success: true, message: 'Đã thêm thương hiệu', data: await service.createBrand(req.body?.name) }); } catch (e) { next(e); } }
export async function updateBrand(req: Request, res: Response, next: NextFunction) { try { res.status(200).json({ success: true, message: 'Đã cập nhật thương hiệu', data: await service.updateBrand(req.params.brandId, req.body?.name) }); } catch (e) { next(e); } }
export async function deleteBrand(req: Request, res: Response, next: NextFunction) { try { await service.deleteBrand(req.params.brandId); res.status(200).json({ success: true, message: 'Đã xóa thương hiệu' }); } catch (e) { next(e); } }
