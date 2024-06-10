import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: Buffer,
    isMale: {
      type: Boolean,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    token: {
      type: String,
      required: false,
    },
    tokenExpiredAt: {
      type: Date,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    refreshTokenExpiredAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', UserSchema);
