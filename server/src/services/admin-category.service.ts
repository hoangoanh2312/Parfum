import { Types } from 'mongoose';
import Category from '../models/category.model';
import { Product } from '../models/product.model';
import { AdminListQuery, escapeRegExp, httpError, isDuplicateKeyError, normalizedNamePattern, normalizeName, parseAdminListQuery } from './admin-resource.utils';

const DUPLICATE = 'Tên danh mục đã tồn tại';
const sortFor = (value: AdminListQuery['sort']): Record<string, 1 | -1> => {
  if (value === 'oldest') return { createdAt: 1 };
  if (value === 'name_asc') return { name: 1, _id: 1 };
  if (value === 'name_desc') return { name: -1, _id: -1 };
  return { createdAt: -1 };
};
async function ensureUnique(name: string, excludedId?: string) {
  const filter: Record<string, unknown> = { name: { $regex: normalizedNamePattern(name), $options: 'i' } };
  if (excludedId) filter._id = { $ne: excludedId };
  if (await Category.exists(filter)) throw httpError(409, DUPLICATE);
}
export async function listCategories(raw: Record<string, unknown>) {
  const query = parseAdminListQuery(raw);
  const filter = query.search ? { name: { $regex: escapeRegExp(query.search), $options: 'i' } } : {};
  const [items, totalItems] = await Promise.all([
    Category.find(filter).sort(sortFor(query.sort)).skip((query.page - 1) * query.limit).limit(query.limit),
    Category.countDocuments(filter),
  ]);
  return { items, pagination: { page: query.page, limit: query.limit, totalItems, totalPages: Math.ceil(totalItems / query.limit) } };
}
export async function createCategory(value: unknown) {
  const name = normalizeName(value);
  await ensureUnique(name);
  try { return await Category.create({ name }); }
  catch (error) { if (isDuplicateKeyError(error)) throw httpError(409, DUPLICATE); throw error; }
}
export async function updateCategory(id: string, value: unknown) {
  if (!Types.ObjectId.isValid(id)) throw httpError(400, 'ID danh mục không hợp lệ');
  const name = normalizeName(value);
  if (!(await Category.exists({ _id: id }))) throw httpError(404, 'Không tìm thấy danh mục');
  await ensureUnique(name, id);
  try { return await Category.findByIdAndUpdate(id, { name }, { new: true, runValidators: true }); }
  catch (error) { if (isDuplicateKeyError(error)) throw httpError(409, DUPLICATE); throw error; }
}
export async function deleteCategory(id: string) {
  if (!Types.ObjectId.isValid(id)) throw httpError(400, 'ID danh mục không hợp lệ');
  if (!(await Category.exists({ _id: id }))) throw httpError(404, 'Không tìm thấy danh mục');
  if (await Product.exists({ category: id })) throw httpError(409, 'Không thể xóa danh mục đang được sử dụng');
  await Category.findByIdAndDelete(id);
}
