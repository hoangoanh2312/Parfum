import { Request, Response } from "express";
import * as categoryService from "../services/category.services";

export const getCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await categoryService.getCategories();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};