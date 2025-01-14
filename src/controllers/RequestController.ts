import { Request, Response, NextFunction } from "express";

import Listing from "../models/Listing";
import { HttpError } from "../utils/httpError";
import sequelize from "../config/dbConnection";
import ListingRequest from "../models/ListingRequest";
import Conversations from "../models/Conversations";
import ReservationDates from "../models/ReservationDates";
import { PaginationResponse } from "../utils/PaginationResponse";

export const createRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let requestBody: ListingRequest = req.body;
  if (!res.locals || !res.locals.user.id) {
    throw new HttpError(
      HttpError.UNAUTHORIZED_CODE,
      HttpError.UNAUTHORIZED_DESCRIPTION,
      "Restricted permission or session is expired."
    );
  } else if (res.locals.user.id) {
    requestBody.createdUser = res.locals.user.id;
    try {
      // check if the user already make request for this listing
      const existingRequest = await ListingRequest.findOne({
        where: {
          createdUser: requestBody.createdUser,
          listingId: requestBody.listingId,
        },
      });

      if (existingRequest) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          "Request already exist for this listing"
        );
      }

      // get listing owner
      const listing = await Listing.findByPk(requestBody.listingId, {
        include: ["user"],
      });
      if (!listing) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          "Listing doesn't exist"
        );
      }
      const listingOwner = listing.user.id;

      const result = await sequelize.transaction(async (t) => {
        // create request
        const listingRequest = await ListingRequest.create(requestBody, {
          transaction: t,
        });

        if (listingRequest) {
          // Create reservation dates, schedule for this request;
          await Promise.all(
            requestBody.reservationDates.map((date: any) => {
              ReservationDates.create(
                {
                  listingRequestId: listingRequest.dataValues.id,
                  reservationDate: new Date(date),
                },
                { transaction: t }
              );
            })
          );

          // create start conversation for this request
          const conversationsRequestBody = {
            listingRequestId: listingRequest.dataValues.id,
            message: requestBody.message,
            senderId: requestBody.createdUser,
            receiverId: listingOwner,
          };
          await Conversations.create(conversationsRequestBody, {
            transaction: t,
          });
        }
        return listingRequest;
      });
      res.status(HttpError.CREATE_SUCCESSFUL_CODE).json({
        message: "create listing request successfully",
        listingRequest: result,
      });
    } catch (error) {
      next(error);
    }
  }
};

export const getRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingRequest = await ListingRequest.findOne({
      where: { id: req.params.id },
      include: ["conversations", "reservationDates"],
    });
    if (!listingRequest) {
      throw new HttpError(
        HttpError.NOT_FOUND_CODE,
        HttpError.NOT_FOUND_DESCRIPTION,
        "Listing Request does not exist."
      );
    } else {
      res.status(HttpError.SUCESSFUL_CODE).json(listingRequest);
    }
  } catch (error) {
    next(error);
  }
};

export const getRequestByListingId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let response = new PaginationResponse(req);
  if (!res.locals || !res.locals.user.id) {
    throw new HttpError(
      HttpError.UNAUTHORIZED_CODE,
      HttpError.UNAUTHORIZED_DESCRIPTION,
      "Restricted permission or session is expired."
    );
  } else if (res.locals.user.id) {
    try {
      const { rows: request, count: total } =
        await ListingRequest.findAndCountAll({
          where: { listingId: req.params.id },
          limit: response.getResponse().limit,
          offset: response.getOffset(),
          order: response.getOrder(),
          include: ["reservationDates", "conversations"],
        });
      response.setResults(request);
      response.setTotal(total);
      res.status(HttpError.SUCESSFUL_CODE).json(response.getResponse());
    } catch (error) {
      next(error);
    }
  }
};

export const getConversationByRequestId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.sortBy = req.query.sortBy || "createdDate";
  let response = new PaginationResponse(req);
  if (!res.locals || !res.locals.user.id) {
    throw new HttpError(
      HttpError.UNAUTHORIZED_CODE,
      HttpError.UNAUTHORIZED_DESCRIPTION,
      "Restricted permission or session is expired."
    );
  } else if (res.locals.user.id) {
    try {
      const { rows: conversations, count: total } =
        await Conversations.findAndCountAll({
          where: { listingRequestId: req.params.requestId },
          limit: response.getResponse().limit,
          offset: response.getOffset(),
          order: response.getOrder(),
        });
      response.setResults(conversations);
      response.setTotal(total);
      res.status(HttpError.SUCESSFUL_CODE).json(response.getResponse());
    } catch (error) {
      next(error);
    }
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let requestBody = req.body;
  if (!res.locals || !res.locals.user.id) {
    throw new HttpError(
      HttpError.UNAUTHORIZED_CODE,
      HttpError.UNAUTHORIZED_DESCRIPTION,
      "Restricted permission or session is expired."
    );
  } else if (res.locals.user.id) {
    try {
      //check if conversation exist
      const listingRequest = await ListingRequest.findOne({
        where: { id: requestBody.listingRequestId },
        include: ["conversations"],
      });
      if (!listingRequest) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          "Request does not exist"
        );
      }
      // check if users are in this conversation
      const existedConversation = listingRequest.conversations[0];
      if (requestBody.senderId === requestBody.receiverId) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          "Sender and Receiver can't be a same person"
        );
      } else if (
        requestBody.senderId !== existedConversation.senderId &&
        requestBody.senderId !== existedConversation.receiverId
      ) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          "Sender is not allow to send message to this conversation"
        );
      } else if (
        requestBody.receiverId !== existedConversation.senderId &&
        requestBody.receiverId !== existedConversation.receiverId
      ) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          "Receiver is not allow to send message to this conversation"
        );
      }
      // create start conversation for this request
      const conversationsRequestBody = {
        listingRequestId: requestBody.listingRequestId,
        message: requestBody.message,
        senderId: requestBody.senderId,
        receiverId: requestBody.receiverId,
      };
      let conversations = await Conversations.create(conversationsRequestBody);

      res
        .status(HttpError.CREATE_SUCCESSFUL_CODE)
        .json({ message: "create job successfully", conversations });
    } catch (error) {
      next(error);
    }
  }
};
