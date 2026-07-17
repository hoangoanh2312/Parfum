import { Request, Response } from 'express';
import * as reviewService from '../services/review.service';

export async function getProductReviews(req: Request, res: Response) {
  try {
    res.json(await reviewService.getApprovedByProduct(req.params.idOrSlug));
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
}

export async function createProductReview(req: Request, res: Response) {
  try {
    res.status(201).json(await reviewService.createReview(req.params.idOrSlug, req.body));
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
}

export async function getAdminReviews(req: Request, res: Response) {
  try {
    res.json(await reviewService.getAdminReviews(String(req.query.status || '')));
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
}

export async function approveReview(req: Request, res: Response) {
  try {
    res.json(await reviewService.setApproval(req.params.reviewId, true));
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
}

export async function rejectReview(req: Request, res: Response) {
  try {
    res.json(await reviewService.setApproval(req.params.reviewId, false));
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
}
