import { Router } from "express";
import { authController } from "../modules/auth/auth.controller";

const router=Router();

router.post('/login',(req,res)=>authController.login(req,res))
router.get('/me',(req,res)=>authController.me(req,res));
router.post('/logout',(req,res)=>authController.logout(req,res))
export default router