import express from "express";
import {
  createRequest,
  getConversationByRequestId,
  getRequestById,
  getRequestByListingId,
  sendMessage,
} from "../controllers/RequestController";
import extractJWT from "../middlewares/extractJWT";
import {
  validateListingRequest,
  validateSendMessageRequest,
} from "../middlewares/validators";

const router = express.Router();

router.post("/", [extractJWT, validateListingRequest], createRequest); // create Request
router.post(
  "/conversation/send-message",
  [extractJWT, validateSendMessageRequest],
  sendMessage
); // send message;
router.get("/conversation/:requestId", extractJWT, getConversationByRequestId); // get conversation by requestID
router.get("/by-listing-id/:id", extractJWT, getRequestByListingId); // get request by Listing id
router.get("/:id", extractJWT, getRequestById); // get request by id

export default router;
