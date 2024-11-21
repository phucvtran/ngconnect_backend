import express from "express";
import {
    createListing, getAllListings
} from "../controllers/ListingController";
import extractJWT from "../middlewares/extractJWT";

const router = express.Router();

router.post("/create-listing",extractJWT, createListing); // create listing

router.get("/listings", getAllListings); // GET /api/users
// router.get("/:id", getUserById); // GET /api/users/:id
// router.put("/:id", updateUser); // PUT /api/users/:id
// router.delete("/:id", deleteUser); // DELETE /api/users/:id

export default router;
