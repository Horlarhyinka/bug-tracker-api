import Joi from "joi";
import mongoose from "mongoose";

export const validateUser = (user: {email: string, password: string}) => Joi.object({
    email: Joi.string().required().regex(/^([a-zA-Z0-9\.@]{3,})@([a-z0-9@]+).([a-zA-Z0-9\.])+$/),
    password: Joi.string().min(6).required()
}).validate(user)

export const validateId = (id: string) => mongoose.Types.ObjectId.isValid(id)
