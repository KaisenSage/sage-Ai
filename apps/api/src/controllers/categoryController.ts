import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const categories = await prisma.category.findMany({
      where: {
        businessId: req.user.businessId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch categories',
      });
    }
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { name, description, imageUrl, order } = req.body;

    if (!name) {
      throw new ApiError(400, 'Category name is required');
    }

    const category = await prisma.category.create({
      data: {
        businessId: req.user.businessId,
        name,
        description,
        imageUrl,
        order: order || 0,
        isActive: true,
      },
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to create category',
      });
    }
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;
    const { name, description, imageUrl, order, isActive } = req.body;

    // Check if category belongs to user's business
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new ApiError(404, 'Category not found');
    }

    if (existingCategory.businessId !== req.user.businessId) {
      throw new ApiError(403, 'Not authorized to update this category');
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to update category',
      });
    }
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;

    // Check if category belongs to user's business
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new ApiError(404, 'Category not found');
    }

    if (existingCategory.businessId !== req.user.businessId) {
      throw new ApiError(403, 'Not authorized to delete this category');
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to delete category',
      });
    }
  }
};
