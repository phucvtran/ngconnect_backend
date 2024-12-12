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

router.post("/listing", extractJWT, createListing); // create listing

router.put("/listing/:id", extractJWT, editListing); // update listing

router.post("/job", extractJWT, createJob); // create job

router.put("/job/:id", extractJWT, editJob); // update job

router.get("/listings", getAllListings); // GET ALL Listings
router.get("/listing/:id", getListingById); // get listing by id

router.get("/myListings", extractJWT, getListingsByCurrentUser);

export default router;
