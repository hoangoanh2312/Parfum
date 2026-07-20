export type AdminListQuery = { page: number; limit: number; search: string; sort: 'newest' | 'oldest' | 'name_asc' | 'name_desc' };
const SORTS = ['newest', 'oldest', 'name_asc', 'name_desc'] as const;
const KEYS = new Set(['page', 'limit', 'search', 'sort']);

export const httpError = (status: number, message: string) => Object.assign(new Error(message), { status });

function stringValue(value: unknown, field: string) {
  if (typeof value !== 'string') throw httpError(400, `${field} không hợp lệ`);
  return value;
}

function integerValue(value: unknown, field: string, fallback: number, max?: number) {
  if (value === undefined) return fallback;
  const raw = stringValue(value, field);
  if (!/^[1-9]\d*$/.test(raw)) throw httpError(400, `${field} không hợp lệ`);
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || (max !== undefined && parsed > max)) throw httpError(400, `${field} không hợp lệ`);
  return parsed;
}

export function parseAdminListQuery(query: Record<string, unknown>): AdminListQuery {
  for (const key of Object.keys(query)) if (!KEYS.has(key)) throw httpError(400, `Query ${key} không hợp lệ`);
  const page = integerValue(query.page, 'page', 1);
  const limit = integerValue(query.limit, 'limit', 10, 100);
  const search = query.search === undefined ? '' : stringValue(query.search, 'search').trim();
  const sort = query.sort === undefined ? 'newest' : stringValue(query.sort, 'sort');
  if (!(SORTS as readonly string[]).includes(sort)) throw httpError(400, 'sort không hợp lệ');
  return { page, limit, search, sort: sort as AdminListQuery['sort'] };
}

export function normalizeName(value: unknown) {
  if (typeof value !== 'string') throw httpError(400, 'name không hợp lệ');
  const name = value.trim().replace(/\s+/g, ' ');
  const length = Array.from(name).length;
  if (length < 2 || length > 100) throw httpError(400, 'name phải có độ dài từ 2 đến 100 ký tự');
  return name;
}

export const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const normalizedNamePattern = (name: string) =>
  `^\\s*${name.split(' ').map(escapeRegExp).join('\\s+')}\\s*$`;
export const isDuplicateKeyError = (error: unknown) =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
