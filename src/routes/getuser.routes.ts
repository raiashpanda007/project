import { Router } from "express";
import { getTop5UsersWithMostPosts } from "../controller/GetUsers";
 const router = Router();
router.get('/',getTop5UsersWithMostPosts)

export default router;