import express from "express";
import {
  createRequest,
  getConversationByRequestId,
  getRequestById,
  getRequestByListingId,
  getRequestByUserId,
} from "../controllers/RequestController";
import extractJWT from "../middlewares/extractJWT";
import { validateListingRequest } from "../middlewares/validators";

const router = express.Router();

router.post("/", [extractJWT, validateListingRequest], createRequest); // create Request
router.get("/conversation/:requestId", extractJWT, getConversationByRequestId); // get conversation by requestID
router.get("/by-listing-id/:listingId", extractJWT, getRequestByListingId); // get request by Listing id
router.get("/by-user-id/:userId", extractJWT, getRequestByUserId); // get request by user id
router.get("/:id", extractJWT, getRequestById); // get request by id

export default router;
