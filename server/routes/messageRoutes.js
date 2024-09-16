import express from "express";
import { getMessage, sendMessage } from "../controller/messageController.js";
import protectRoute from "../protectRoute.js";

const router = express.Router();

router.post("/sendmessage/:id", protectRoute, sendMessage);
router.get("/getmessage/:id", protectRoute, getMessage);

export default router;