import express from "express";
import {
  createJob,
  createListing,
  editJob,
  editListing,
  getAllListings,
  getListingById,
  getListingsByCurrentUser,
} from "../controllers/ListingController";
import extractJWT from "../middlewares/extractJWT";

const router = express.Router();

router.post("/", extractJWT, createListing); // create listing

router.put("/:id", extractJWT, editListing); // update listing

router.post("/job", extractJWT, createJob); // create job

router.put("/job/:id", extractJWT, editJob); // update job

router.get("/", getAllListings); // GET ALL Listings

router.get("/my-listings", extractJWT, getListingsByCurrentUser);

router.get("/:id", getListingById); // get listing by id

export default router;
