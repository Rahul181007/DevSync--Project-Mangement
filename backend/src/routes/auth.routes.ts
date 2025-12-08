import { Router } from "express";
import { authController } from "../modules/auth/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router=Router();

router.post('/login',(req,res)=>authController.login(req,res))
router.get('/me',authMiddleware,(req,res)=>authController.me(req,res));
router.post('/logout',(req,res)=>authController.logout(req,res))
router.post('/refresh',(req,res)=>authController.refresh(req,res))
export default router