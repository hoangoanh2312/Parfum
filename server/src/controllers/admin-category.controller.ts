import { NextFunction, Request, Response } from 'express';
import * as service from '../services/admin-category.service';
export async function listCategories(req: Request, res: Response, next: NextFunction) { try { res.status(200).json({ success: true, data: await service.listCategories(req.query) }); } catch (e) { next(e); } }
export async function createCategory(req: Request, res: Response, next: NextFunction) { try { res.status(201).json({ success: true, message: 'Đã thêm danh mục', data: await service.createCategory(req.body?.name) }); } catch (e) { next(e); } }
export async function updateCategory(req: Request, res: Response, next: NextFunction) { try { res.status(200).json({ success: true, message: 'Đã cập nhật danh mục', data: await service.updateCategory(req.params.categoryId, req.body?.name) }); } catch (e) { next(e); } }
export async function deleteCategory(req: Request, res: Response, next: NextFunction) { try { await service.deleteCategory(req.params.categoryId); res.status(200).json({ success: true, message: 'Đã xóa danh mục' }); } catch (e) { next(e); } }
