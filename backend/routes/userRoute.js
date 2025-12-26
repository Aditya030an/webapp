import express from "express";
import { createUser, loginUser , getAllUsers,getUser , deleteUser } from "../controllers/userController.js";
const router = express.Router();

router.post("/createUser", createUser);
router.post("/loginUser", loginUser);
router.get("/getAllUsers", getAllUsers);
router.get("/getUser/:userId", getUser);
router.delete("/deleteUser/:userId", deleteUser);

export default router;