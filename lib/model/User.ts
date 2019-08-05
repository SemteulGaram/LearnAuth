import mongoose from 'mongoose';
import Joi from '@hapi/joi';

export interface IUser {
  name: string;
  email: string;
  password: string;
  date: Date;
}

export interface IUserModel extends IUser, mongoose.Document {}

export var UserSchema: mongoose.Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('User', UserSchema);

// VALIDATION
export const validationUserSchema = {
  name: Joi.string()
    .min(6)
    .max(255)
    .required(),
  email: Joi.string()
    .min(6)
    .max(255)
    .required()
    .email(),
  password: Joi.string()
    .min(6)
    .max(1024)
    .required()
}

export const isValidateUser = (data: any): Joi.ValidationResult<any> => {
  return Joi.validate(data, validationUserSchema);
}
