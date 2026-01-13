import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { businessName, email, password, name, phone } = req.body;

    // Validate required fields
    if (!businessName || !email || !password || !name || !phone) {
      throw new ApiError(400, 'All fields are required');
    }

    // Check if email already exists
    const existingStaff = await prisma.staff.findUnique({
      where: { email },
    });

    if (existingStaff) {
      throw new ApiError(400, 'Email already registered');
    }

    // Create business
    const slug = businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const business = await prisma.business.create({
      data: {
        name: businessName,
        slug,
        email,
        phone,
      },
    });

    // Create staff user (owner)
    const passwordHash = await hashPassword(password);
    const staff = await prisma.staff.create({
      data: {
        businessId: business.id,
        email,
        passwordHash,
        name,
        phone,
        role: 'OWNER',
        isActive: true,
      },
    });

    // Generate token
    const token = generateToken({
      id: staff.id,
      email: staff.email,
      businessId: staff.businessId,
      role: staff.role,
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: staff.id,
          email: staff.email,
          name: staff.name,
          role: staff.role,
          businessId: staff.businessId,
        },
      },
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
        error: 'Registration failed',
      });
    }
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    // Find staff user
    const staff = await prisma.staff.findUnique({
      where: { email },
    });

    if (!staff) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, staff.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    if (!staff.isActive) {
      throw new ApiError(403, 'Account is inactive');
    }

    // Generate token
    const token = generateToken({
      id: staff.id,
      email: staff.email,
      businessId: staff.businessId,
      role: staff.role,
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: staff.id,
          email: staff.email,
          name: staff.name,
          role: staff.role,
          businessId: staff.businessId,
        },
      },
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
        error: 'Login failed',
      });
    }
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const staff = await prisma.staff.findUnique({
      where: { id: req.user.id },
      include: {
        business: true,
      },
    });

    if (!staff) {
      throw new ApiError(404, 'User not found');
    }

    res.json({
      success: true,
      data: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
        businessId: staff.businessId,
        business: staff.business,
      },
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
        error: 'Failed to fetch user',
      });
    }
  }
};
