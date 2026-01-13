import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { categoryId } = req.query;

    const products = await prisma.product.findMany({
      where: {
        businessId: req.user.businessId,
        ...(categoryId && { categoryId: categoryId as string }),
      },
      include: {
        category: true,
        variants: true,
        addons: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: products,
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
        error: 'Failed to fetch products',
      });
    }
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const {
      categoryId,
      name,
      description,
      basePrice,
      images,
      preparationTime,
      variants,
      addons,
    } = req.body;

    if (!categoryId || !name || basePrice === undefined) {
      throw new ApiError(400, 'Category ID, name, and base price are required');
    }

    // Verify category belongs to user's business
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || category.businessId !== req.user.businessId) {
      throw new ApiError(400, 'Invalid category');
    }

    const product = await prisma.product.create({
      data: {
        businessId: req.user.businessId,
        categoryId,
        name,
        description,
        basePrice: parseFloat(basePrice),
        images: images || [],
        preparationTime,
        isAvailable: true,
      },
    });

    // Create variants if provided
    if (variants && Array.isArray(variants)) {
      await Promise.all(
        variants.map((variant: any) =>
          prisma.productVariant.create({
            data: {
              productId: product.id,
              name: variant.name,
              priceModifier: parseFloat(variant.priceModifier),
              isAvailable: true,
            },
          })
        )
      );
    }

    // Create addons if provided
    if (addons && Array.isArray(addons)) {
      await Promise.all(
        addons.map((addon: any) =>
          prisma.addon.create({
            data: {
              productId: product.id,
              name: addon.name,
              price: parseFloat(addon.price),
              isRequired: addon.isRequired || false,
              maxQuantity: addon.maxQuantity || 1,
            },
          })
        )
      );
    }

    // Fetch complete product with relations
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        variants: true,
        addons: true,
      },
    });

    res.status(201).json({
      success: true,
      data: completeProduct,
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
        error: 'Failed to create product',
      });
    }
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;
    const {
      categoryId,
      name,
      description,
      basePrice,
      images,
      isAvailable,
      preparationTime,
    } = req.body;

    // Check if product belongs to user's business
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new ApiError(404, 'Product not found');
    }

    if (existingProduct.businessId !== req.user.businessId) {
      throw new ApiError(403, 'Not authorized to update this product');
    }

    // If categoryId is being changed, verify it belongs to user's business
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category || category.businessId !== req.user.businessId) {
        throw new ApiError(400, 'Invalid category');
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(categoryId !== undefined && { categoryId }),
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(basePrice !== undefined && { basePrice: parseFloat(basePrice) }),
        ...(images !== undefined && { images }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(preparationTime !== undefined && { preparationTime }),
      },
      include: {
        category: true,
        variants: true,
        addons: true,
      },
    });

    res.json({
      success: true,
      data: product,
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
        error: 'Failed to update product',
      });
    }
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;

    // Check if product belongs to user's business
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new ApiError(404, 'Product not found');
    }

    if (existingProduct.businessId !== req.user.businessId) {
      throw new ApiError(403, 'Not authorized to delete this product');
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Product deleted successfully',
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
        error: 'Failed to delete product',
      });
    }
  }
};
