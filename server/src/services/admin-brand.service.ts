import { Types } from 'mongoose';
import Brand from '../models/brand.model';
import { Product } from '../models/product.model';
import { AdminListQuery, escapeRegExp, httpError, isDuplicateKeyError, normalizedNamePattern, normalizeName, parseAdminListQuery } from './admin-resource.utils';

const DUPLICATE = 'Tên thương hiệu đã tồn tại';
const sortFor = (value: AdminListQuery['sort']): Record<string, 1 | -1> => {
  if (value === 'oldest') return { createdAt: 1 };
  if (value === 'name_asc') return { name: 1, _id: 1 };
  if (value === 'name_desc') return { name: -1, _id: -1 };
  return { createdAt: -1 };
};
async function ensureUnique(name: string, excludedId?: string) {
  const filter: Record<string, unknown> = { name: { $regex: normalizedNamePattern(name), $options: 'i' } };
  if (excludedId) filter._id = { $ne: excludedId };
  if (await Brand.exists(filter)) throw httpError(409, DUPLICATE);
}
export async function listBrands(raw: Record<string, unknown>) {
  const query = parseAdminListQuery(raw);
  const filter = query.search ? { name: { $regex: escapeRegExp(query.search), $options: 'i' } } : {};
  const [items, totalItems] = await Promise.all([
    Brand.find(filter).sort(sortFor(query.sort)).skip((query.page - 1) * query.limit).limit(query.limit),
    Brand.countDocuments(filter),
  ]);
  return { items, pagination: { page: query.page, limit: query.limit, totalItems, totalPages: Math.ceil(totalItems / query.limit) } };
}
export async function createBrand(value: unknown) {
  const name = normalizeName(value);
  await ensureUnique(name);
  try { return await Brand.create({ name }); }
  catch (error) { if (isDuplicateKeyError(error)) throw httpError(409, DUPLICATE); throw error; }
}
export async function updateBrand(id: string, value: unknown) {
  if (!Types.ObjectId.isValid(id)) throw httpError(400, 'ID thương hiệu không hợp lệ');
  const name = normalizeName(value);
  if (!(await Brand.exists({ _id: id }))) throw httpError(404, 'Không tìm thấy thương hiệu');
  await ensureUnique(name, id);
  try { return await Brand.findByIdAndUpdate(id, { name }, { new: true, runValidators: true }); }
  catch (error) { if (isDuplicateKeyError(error)) throw httpError(409, DUPLICATE); throw error; }
}
export async function deleteBrand(id: string) {
  if (!Types.ObjectId.isValid(id)) throw httpError(400, 'ID thương hiệu không hợp lệ');
  if (!(await Brand.exists({ _id: id }))) throw httpError(404, 'Không tìm thấy thương hiệu');
  if (await Product.exists({ brand: id })) throw httpError(409, 'Không thể xóa thương hiệu đang được sử dụng');
  await Brand.findByIdAndDelete(id);
}
