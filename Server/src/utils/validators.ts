import { NextFunction, Request, Response } from "express";
import {body, ValidationChain, validationResult} from "express-validator";

export const validate = (validations:ValidationChain[])=>{
    return async (req:Request, res:Response, next:NextFunction)=>{
    for(let validation of validations){
     const result = await validation.run(req);
     if(!result.isEmpty()){
        break;
     }
    }
    const errors = validationResult(req);
    if(errors.isEmpty()){
        return next();
    }
    return res.status(422).json({errors: errors.array()});
    };
};
export const loginValidator=[
    body("password").trim().isLength({min:6}).withMessage("Password Should contain atleast 6 characters"),
    body("email").trim().isEmail().withMessage("valid Email is required"),
] 
export const signupValidator = [
    body("name").notEmpty().withMessage("Name is required"),
   ...loginValidator,
]; 

export const chatValidator = [
    body("message").notEmpty().withMessage("Message is required"),
];
