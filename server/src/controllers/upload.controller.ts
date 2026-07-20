import { Request, Response } from 'express';

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không tìm thấy file ảnh" });
  }
  // @ts-ignore
  const imageUrl = req.file.path; 
  res.status(200).json({ url: imageUrl });
};