import { Router } from "express";
import getPopularPost from "../controller/GetPosts";
const router = Router();
router.get('/',(
    getPopularPost
))