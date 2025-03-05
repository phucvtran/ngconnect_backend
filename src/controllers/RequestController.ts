import { Request, Response, NextFunction } from "express";

import Listing from "../models/Listing";
import { HttpError } from "../utils/httpError";
import sequelize from "../config/dbConnection";
import ListingRequest from "../models/ListingRequest";
import Conversations from "../models/Conversations";
import ReservationDates from "../models/ReservationDates";
import { PaginationResponse } from "../utils/PaginationResponse";
import User from "../models/User";

/**
 * Create listing Request,
 * check if user logged in, check if listing is available, check if user try to create request for their own listing
 * @param req request must have list of datetimes, and message
 * @param res
 * @param next
 */
export const createRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let requestBody: ListingRequest = req.body;
  try {
    if (!res.locals || !res.locals.user.id) {
      throw new HttpError(
        HttpError.UNAUTHORIZED_CODE,
        HttpError.UNAUTHORIZED_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_RESTRICTED_PERMISSION
      );
    } else if (res.locals.user.id) {
      // user must login before creating the request
      requestBody.createdUser = res.locals.user.id;

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
          HttpError.HTTP_MESSAGE.ERROR_REQUEST_EXIST
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
          HttpError.HTTP_MESSAGE.ERROR_LISTING_DOESNOT_EXISTED
        );
      } else {
        if (listing.user.id === res.locals.user.id) {
          // check if user try to create the request for their own listing
          throw new HttpError(
            HttpError.BAD_REQUEST_CODE,
            HttpError.BAD_REQUEST_DESCRIPTION,
            HttpError.HTTP_MESSAGE.ERROR_CREATE_REQUEST_FOR_OWN_LISTING
          );
        }
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
        message: HttpError.HTTP_MESSAGE.SUCCESS_CREATE_LISTING_REQUEST,
        listingRequest: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get listing request by ID
 * @param req
 * @param res
 * @param next
 */
export const getRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!res.locals || !res.locals.user.id) {
      throw new HttpError(
        HttpError.UNAUTHORIZED_CODE,
        HttpError.UNAUTHORIZED_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_RESTRICTED_PERMISSION
      );
    } else if (res.locals.user.id) {
      // listing request has conversation (chat) and reservationDates(schedule - date and time)
      const listingRequest = await ListingRequest.findOne({
        where: { id: req.params.id, createdUser: res.locals.user.id },
        include: ["conversations", "reservationDates"],
      });
      if (!listingRequest) {
        throw new HttpError(
          HttpError.NOT_FOUND_CODE,
          HttpError.NOT_FOUND_DESCRIPTION,
          "Listing Request does not exist."
        );
      } else {
        res.status(HttpError.SUCCESSFUL_CODE).json(listingRequest);
      }
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
  try {
    if (!res.locals || !res.locals.user.id) {
      throw new HttpError(
        HttpError.UNAUTHORIZED_CODE,
        HttpError.UNAUTHORIZED_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_RESTRICTED_PERMISSION
      );
    } else if (res.locals.user.id) {
      const { rows: request, count: total } =
        await ListingRequest.findAndCountAll({
          where: { listingId: req.params.listingId },
          limit: response.getResponse().limit,
          offset: response.getOffset(),
          distinct: true,
          order: [
            [
              { model: Conversations, as: "conversations" },
              "createdDate",
              "DESC",
            ],
          ],
          include: [
            "createdUserObj",
            "reservationDates",
            {
              model: Conversations,
              required: true,
            },
            { model: Listing, include: [{ model: User }] },
          ],
        });
      response.setResults(request);
      response.setTotal(total);
      res.status(HttpError.SUCCESSFUL_CODE).json(response.getResponse());
    }
  } catch (error) {
    next(error);
  }
};

/**
 * get request by user id. get all the request for a user.
 * @param req userID
 * @param res a list of request for the userID
 * @param next
 */
export const getRequestByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let response = new PaginationResponse(req);
  try {
    if (!res.locals || !res.locals.user.id) {
      // verify token
      throw new HttpError(
        HttpError.UNAUTHORIZED_CODE,
        HttpError.UNAUTHORIZED_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_RESTRICTED_PERMISSION
      );
    } else if (res.locals.user.id != req.params.userId) {
      // make sure that user only get the requests belong to them
      throw new HttpError(
        HttpError.FORBIDDEN_CODE,
        HttpError.FORBIDDEN_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_RESTRICTED_PERMISSION
      );
    } else if (res.locals.user.id) {
      const { rows: request, count: total } =
        await ListingRequest.findAndCountAll({
          where: { createdUser: req.params.userId },
          limit: response.getResponse().limit,
          offset: response.getOffset(),
          distinct: true,
          order: [
            [
              { model: Conversations, as: "conversations" },
              "createdDate",
              "DESC",
            ],
          ],
          include: [
            "createdUserObj",
            "reservationDates",
            {
              model: Conversations,
              required: true,
            },
            { model: Listing, include: [{ model: User }] },
          ],
        });
      response.setResults(request);
      response.setTotal(total);
      res.status(HttpError.SUCCESSFUL_CODE).json(response.getResponse());
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get conversation by request ID
 * @param req request ID
 * @param res return a conversation (chat) for the requestID.
 * @param next
 */
export const getConversationByRequestId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.sortBy = req.query.sortBy || "createdDate";
  let response = new PaginationResponse(req);
  try {
    if (!res.locals || !res.locals.user.id) {
      throw new HttpError(
        HttpError.UNAUTHORIZED_CODE,
        HttpError.UNAUTHORIZED_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_RESTRICTED_PERMISSION
      );
    } else if (res.locals.user.id) {
      const { rows: conversations, count: total } =
        await Conversations.findAndCountAll({
          where: { listingRequestId: req.params.requestId },
          limit: response.getResponse().limit,
          offset: response.getOffset(),
          order: response.getOrder(),
        });
      response.setResults(conversations);
      response.setTotal(total);
      res.status(HttpError.SUCCESSFUL_CODE).json(response.getResponse());
    }
  } catch (error) {
    next(error);
  }
};
