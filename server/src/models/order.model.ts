import { Schema, model, Types } from 'mongoose';
<<<<<<< HEAD

// Mỗi dòng hàng trong đơn: LƯU SNAPSHOT (name/volume/price) tại thời điểm đặt
// để sau này sản phẩm đổi giá/tên thì đơn cũ vẫn giữ đúng dữ liệu lúc mua.
const orderItemSchema = new Schema(
  {
    variant: { type: Types.ObjectId, ref: 'Variant', required: true },
    name: String,
    volume: String,
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User' },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipping', 'done', 'cancelled'],
      default: 'pending',
    },
    address: { line: String, city: String, phone: String },
    note: String,
  },
  { timestamps: true },
);

export const Order = model('Order', orderSchema);
=======
const s = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  items: [{ variant: { type: Types.ObjectId, ref: 'Variant' }, name: String, price: Number, quantity: Number }],
  total: Number,
  status: { type: String, enum: ['pending','paid','shipping','done','cancelled'], default: 'pending' },
  address: { line: String, city: String, phone: String },
}, { timestamps: true });
export const Order = model('Order', s);
>>>>>>> feature/pf-32-category-brand-crud
