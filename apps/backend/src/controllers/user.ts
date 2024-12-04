import { Request, Response  } from 'express';
import User from '../models/User';

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findOne({ where: { username: req.body.username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search for users
export const listUsers =  async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a user
export const updateUser =  async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (req.body.username) {
      const existingUser = await User.findOne({ where: { username: req.body.username } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user
export const deleteUser =  async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};