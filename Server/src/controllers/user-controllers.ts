import {Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { createToken } from "../utils/token-manager.js";
// to encrypt the password
import {hash, compare} from 'bcrypt';
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers=async(req:Request, res:Response, next : NextFunction)=>{
try{
//get all users
const users= await User.find();

return res.status(200).json({message:"OK", users});
}catch(error){
    return res.status(200).json({message:"ERROR", cause:error.message});
}
};
export const userSignup=async(req:Request, res:Response, next : NextFunction)=>{
    try{
    //user Signup
    const {name, email, password}= req.body;
    const existingUser= await User.findOne({email});
    if(existingUser) return res.status(401).send("User already exists");
    const hashedPassword = await hash(password, 10);
    const user= new User({name, email, password:hashedPassword});
    await user.save();
    //create token and store cookie
    res.clearCookie(COOKIE_NAME,{
        domain:"localhost",
        httpOnly:true,
        signed:true,
        path:"/",
    });
    const token =createToken(user._id.toString(),user.email,"7d");
    const expires = new Date();
    expires.setDate(expires.getDate()+7);
    res.cookie(COOKIE_NAME,token,{path:"/",domain:"localhost",expires,httpOnly:true,signed:true});
    return res.status(201).json({message:"OK", name:user.name, email:user.email});
    }catch(error){
        return res.status(200).json({message:"ERROR", cause:error.message});
    }
    };

    export const verifyUser = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          //user token check
          const user = await User.findById(res.locals.jwtData.id);
          if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
          }
          if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
          }
          return res
            .status(200)
            .json({ message: "OK", name: user.name, email: user.email });
        } catch (error) {
          console.log(error);
          return res.status(200).json({ message: "ERROR", cause: error.message });
        }
      };
      
        export const userLogout=async(req:Request, res:Response, next : NextFunction)=>{
            try{
            //user Login
            
            const user = await User.findById(res.locals.jwtData.id)
            if(!user){
                return res.status(401).send("Token Malfunctioned");
            }
            console.log(user._id.toString(),res.locals.jwtData.id);
            if(user._id.toString()!== res.locals.jwtData.id){
                return res.status(401).send("Permissions didn't match");
                
            }
            res.clearCookie(COOKIE_NAME,{
                domain:"localhost",
                httpOnly:true,
                signed:true,
                path:"/",
            });
           
            return res.status(200).json({message:"OK", name:user.name, email:user.email});
            }catch(error){
                return res.status(200).json({message:"ERROR", cause:error.message});
            }
            };

export const userLogin=async(req:Request, res:Response, next : NextFunction)=>{
            try{
            //user Login
            const {email,password}= req.body;
            const user = await User.findOne({email})
            if(!user){
                return res.status(401).send("User Don't exist");
            }
            const isPasswordCorrect = await compare(password, user.password);
            if(!isPasswordCorrect){
                return res.status(403).send("Password is incorrect");
                
            }
            res.clearCookie(COOKIE_NAME,{
                domain:"localhost",
                httpOnly:true,
                signed:true,
                path:"/",
            });
            const token =createToken(user._id.toString(),user.email,"7d");
            const expires = new Date();
            expires.setDate(expires.getDate()+7);
            res.cookie(COOKIE_NAME,token,{path:"/",domain:"localhost",expires,httpOnly:true,signed:true});
            return res.status(200).json({message:"OK", name:user.name, email:user.email});
            }catch(error){
                return res.status(200).json({message:"ERROR", cause:error.message});
            }
            };
    