import express from "express";
import protectRoute from "../protectRoute.js"
import { getAllUsers, setStatus } from "../controller/userController.js";

const router = express.Router();

router.get("/allusers", protectRoute, getAllUsers);
router.post("/status", protectRoute ,setStatus);
export default router;