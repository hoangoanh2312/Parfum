import { Request, Response } from 'express';
import { Review } from '../models/review.model';
import { verifyAccess } from '../utils/jwt';

function getOptionalUser(req: Request) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;

  try {
    return verifyAccess(header.slice(7)) as { id?: string; role?: string };
  } catch {
    return null;
  }
}

export const listProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      approved: true,
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return res.json(
      reviews.map((review: any) => ({
        id: String(review._id),
        rating: review.rating,
        title: review.title || '',
        comment: review.comment,
        images: review.images || [],
        userName: review.user?.name || review.guestName || 'Khách hàng',
        createdAt: review.createdAt,
      })),
    );
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Không tải được review' });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const user = getOptionalUser(req);
    const { product, rating, title, comment, images, guestName, guestEmail } = req.body;

    if (!user?.id && (!guestName || !guestEmail)) {
      return res.status(400).json({ message: 'Vui lòng nhập tên và email để gửi review' });
    }

    const review = await Review.create({
      product,
      user: user?.id || undefined,
      guestName: user?.id ? undefined : guestName,
      guestEmail: user?.id ? undefined : guestEmail,
      rating,
      title,
      comment,
      images: Array.isArray(images) ? images : [],
      approved: false,
    });

    return res.status(201).json({
      id: String(review._id),
      message: 'Review đã được gửi và đang chờ duyệt',
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Không gửi được review' });
  }
};
