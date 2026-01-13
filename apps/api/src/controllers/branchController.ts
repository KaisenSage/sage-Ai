import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getBranches = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const branches = await prisma.branch.findMany({
      where: {
        businessId: req.user.businessId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: branches,
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
        error: 'Failed to fetch branches',
      });
    }
  }
};

export const createBranch = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const {
      name,
      address,
      city,
      state,
      country,
      phone,
      email,
      coordinates,
      settings,
    } = req.body;

    if (!name || !address || !city || !state || !country || !phone || !email) {
      throw new ApiError(400, 'All required fields must be provided');
    }

    const branch = await prisma.branch.create({
      data: {
        businessId: req.user.businessId,
        name,
        address,
        city,
        state,
        country,
        phone,
        email,
        coordinates,
        settings,
        isActive: true,
        orderingEnabled: true,
      },
    });

    res.status(201).json({
      success: true,
      data: branch,
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
        error: 'Failed to create branch',
      });
    }
  }
};

export const updateBranch = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;
    const {
      name,
      address,
      city,
      state,
      country,
      phone,
      email,
      isActive,
      orderingEnabled,
      coordinates,
      settings,
    } = req.body;

    // Check if branch belongs to user's business
    const existingBranch = await prisma.branch.findUnique({
      where: { id },
    });

    if (!existingBranch) {
      throw new ApiError(404, 'Branch not found');
    }

    if (existingBranch.businessId !== req.user.businessId) {
      throw new ApiError(403, 'Not authorized to update this branch');
    }

    const branch = await prisma.branch.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(country !== undefined && { country }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(isActive !== undefined && { isActive }),
        ...(orderingEnabled !== undefined && { orderingEnabled }),
        ...(coordinates !== undefined && { coordinates }),
        ...(settings !== undefined && { settings }),
      },
    });

    res.json({
      success: true,
      data: branch,
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
        error: 'Failed to update branch',
      });
    }
  }
};
