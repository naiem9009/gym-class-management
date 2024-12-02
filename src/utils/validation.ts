import { z } from 'zod';

// login validation
export const loginSchema = z.object({
    email: z.string().email('Invalid email address').nonempty('Email is required'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[\W_]/, 'Password must contain at least one special character')
        .nonempty('Password is required'),
});

// register validation
export const registerSchema = z.object({
    fullName: z.string().min(3, 'Name must contain at least three character'),
    email: z.string().email('Invalid email address').nonempty('Email is required'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[\W_]/, 'Password must contain at least one special character')
        .nonempty('Password is required'),
})


// schedule validation
export const scheduleSchema = z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    time: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, {
        message: "Invalid time format (expected HH:mm or HHmm)",
    }),
    trainerId: z.string().uuid({ message: "Invalid trainer ID format" }),
    className: z.string().min(1, { message: "Class name cannot be empty" }),
});
