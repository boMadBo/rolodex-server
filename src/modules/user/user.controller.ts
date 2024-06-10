import { CreateUserRequest, UpdateUserRequest } from '@/modules/user/types/request.types';
import { UserCollectionResponse, UserResponse } from '@/modules/user/types/response.types';
import { IUser } from '@/modules/user/types/types';
import UserSchema from '@/modules/user/user.schema';
import { generateHash, getResponseUser, validateHash } from '@/modules/user/utils';
import { BadRequestError } from '@/shared/errors/badRequestError';
import { ExpressRequest } from '@/shared/types';
import { Response } from 'express';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';

const create = async (req: CreateUserRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    res.status(400).json(errors.array());
  }

  const existedUser = await UserSchema.findOne({ email: req.body.email });
  if (existedUser) {
    res.status(400).send('A user with this email address exists');
  }

  let filename = '';
  if (req.file?.filename) filename = req.file?.filename;

  try {
    const { birthDate } = req.body;

    const doc = new UserSchema({
      ...req.body,
      avatar: req.file?.filename,
      password: generateHash(req.body.password),
      ...(birthDate && { birthDate: new Date(birthDate) }),
    });

    const user = await doc.save();
    const { password, ...userData } = user.toObject();
    res.json({
      ...userData,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Failed to register');
  }
};

const login = async (email: string, password: string): Promise<IUser> => {
  const user = await getByEmailOrFail(email.toLowerCase());
  await validateHash(password, user.password);

  return user;
};

const logout = async (id: string): Promise<void> => {
  const user = await getByIdOrFail(id);
  user.token = undefined;
  user.refreshToken = undefined;

  await user.save();
};

const getUser = async (req: ExpressRequest, res: Response): Promise<UserResponse | undefined> => {
  if (!req.user) {
    return;
  }
  const user = await getByIdOrFail(req.user._id);
  const result = getResponseUser(user.toObject(), req.user._id);
  res.json(result);
};

const getList = async (req: ExpressRequest, res: Response): Promise<UserCollectionResponse[] | undefined> => {
  if (!req.user) {
    return;
  }
  const { _id } = req.user;
  const users = await UserSchema.find({ _id: { $ne: _id } });
  const result = users.map(user => getResponseUser(user.toObject(), _id));

  res.json(result);
};

const updateUser = async (req: UpdateUserRequest, res: Response): Promise<void> => {
  if (!req.user) {
    return;
  }
  const { firstName, lastName, password } = req.body;
  const { _id } = req.user;

  const updateFields: any = {};

  if (firstName || lastName || password || req.file) {
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (password) updateFields.password = generateHash(password);
    if (req.file && req.file.filename) {
      await deleteLastAvatar(_id);
      updateFields.avatar = req.file.filename;
    }
  }

  await UserSchema.findByIdAndUpdate({ _id }, updateFields);
  res.json({ success: true });
};

async function deleteLastAvatar(id: string): Promise<void> {
  const currentUser = await UserSchema.findOne({ _id: id });
  if (currentUser?.avatar) {
    const filePath = path.join('./src/uploads/', currentUser.avatar.toString());
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

async function getUserByRefreshToken(refreshToken: string): Promise<IUser> {
  const user = await UserSchema.findOne({ refreshToken });
  if (!user || (user.refreshTokenExpiredAt && user.refreshTokenExpiredAt < new Date())) {
    throw new BadRequestError('Incorrect refresh token');
  }

  return user.toObject();
}

async function getByEmailOrFail(email: string): Promise<IUser> {
  const user = await UserSchema.findOne({ email });
  if (!user) {
    throw new BadRequestError('User not found');
  }

  return user.toObject();
}

async function getByIdOrFail(id: string) {
  const user = await UserSchema.findById({ _id: id });
  if (!user) {
    throw new BadRequestError('User not found');
  }

  return user;
}

async function findByToken(token: string) {
  return UserSchema.findOne({ token });
}

export const UserController = () => {
  return {
    create,
    login,
    getUser,
    updateUser,
    getList,
    getUserByRefreshToken,
    logout,
    getByIdOrFail,
    findByToken,
  };
};
