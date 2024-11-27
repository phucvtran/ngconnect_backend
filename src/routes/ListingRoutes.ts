import express from "express";
import {
  createJob,
  createListing,
  editListing,
  getAllListings,
  getListingById,
} from "../controllers/ListingController";
import extractJWT from "../middlewares/extractJWT";

const router = express.Router();

router.post("/listing", extractJWT, createListing); // create listing

router.post("/job", extractJWT, createJob); // create listing

router.put("/listing/:id", extractJWT, editListing); // update listing

router.get("/listings", getAllListings); // GET ALL Listings
router.get("/listing/:id", getListingById); // get listing by id

export default router;
