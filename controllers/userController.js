import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

// Generate invitation token
const generateInvitationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send invitation email
export const inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    // Validate role if provided
    if (role && !['ADMIN', 'HR', 'USER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be one of: ADMIN, HR, USER' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const invitationToken = generateInvitationToken();
    const invitationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user with invitation details
    const user = new User({
      email,
      role: role || 'USER',
      invitationToken,
      invitationExpires,
      isActive: false,
      // Set temporary values for required fields
      firstName: 'Pending',
      lastName: 'Registration',
      password: 'temporary' // Will be changed during registration
    });

    await user.save();

    // Send invitation email
    const registrationLink = `${process.env.FRONTEND_URL}/register?token=${invitationToken}`;
    await sendEmail({
      email,
      subject: 'Invitation to Join Task Management System',
      message: `You have been invited to join the Task Management System. Click the following link to complete your registration: ${registrationLink}`
    });

    res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error sending invitation', error: error.message });
  }
};

// Complete registration
export const completeRegistration = async (req, res) => {
  try {
    const { token, password, firstName, lastName } = req.body;

    const user = await User.findOne({
      invitationToken: token,
      invitationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired invitation token' });
    }

    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.isActive = true;
    user.invitationToken = undefined;
    user.invitationExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Registration completed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error completing registration', error: error.message });
  }
};

// Get all users (Admin and HR only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -invitationToken -invitationExpires');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Update user role (Admin and HR only)
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Only Admin can assign Admin role
    if (role === 'ADMIN' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only Admin can assign Admin role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: '-password -invitationToken -invitationExpires' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
}; 