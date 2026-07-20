import { Request, Response } from 'express';

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không tìm thấy file ảnh" });
  }
  const file = req.file as Express.Multer.File & { filename?: string };
  const imageUrl = file.filename
    ? `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    : file.path;

  res.status(200).json({ url: imageUrl });
};
