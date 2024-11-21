import express from "express";
import {
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
    login,
    createUser
} from "../controllers/userController";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);

// router.get("/", getAllUsers); // GET /api/users
// router.get("/:id", getUserById); // GET /api/users/:id
// router.put("/:id", updateUser); // PUT /api/users/:id
// router.delete("/:id", deleteUser); // DELETE /api/users/:id

export default router;
