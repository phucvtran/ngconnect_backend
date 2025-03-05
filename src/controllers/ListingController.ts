import { Request, Response, NextFunction } from "express";

import Listing from "../models/Listing";
import { HttpError } from "../utils/httpError";
import { PaginationResponse } from "../utils/PaginationResponse";
import Job from "../models/Job";
import sequelize from "../config/dbConnection";
import { Op } from "sequelize";

/**
 * create listing item
 */
export const createListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let requestBody: Listing = req.body;
    if (!res.locals || !res.locals.user.id) {
      throw new HttpError(
        HttpError.UNAUTHORIZED_CODE,
        HttpError.UNAUTHORIZED_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_RESTRICTED_PERMISSION
      );
    } else if (res.locals.user.id) {
      requestBody.createdUser = res.locals.user.id;

      if (requestBody.categoryId === 1) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          HttpError.HTTP_MESSAGE.ERROR_CREATE_JOB
        );
      }
      await Listing.create(requestBody);
      res.status(HttpError.CREATE_SUCCESSFUL_CODE).json({
        message: HttpError.HTTP_MESSAGE.SUCCESS_CREATE_LISTING,
        listing: requestBody,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Update listing item.
 * @param req
 * @param res
 * @param next
 */
export const editListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let requestBody: Listing = req.body;
  try {
    if (!res.locals || !res.locals.user.id) {
      throw new HttpError(
        HttpError.UNAUTHORIZED_CODE,
        HttpError.UNAUTHORIZED_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_RESTRICTED_PERMISSION
      );
    } else if (res.locals.user.id) {
      requestBody.createdUser = res.locals.user.id;

      // throw error, if user try to update normal listing to job listing
      if (requestBody?.categoryId === 1) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          HttpError.HTTP_MESSAGE.ERROR_MODIFY_LISTING_CATEGORY_TO_JOB
        );
      }
      const listing = await Listing.findOne({ where: { id: req.params.id } });
      if (!listing) {
        throw new HttpError(
          HttpError.NOT_FOUND_CODE,
          HttpError.NOT_FOUND_DESCRIPTION,
          HttpError.HTTP_MESSAGE.ERROR_LISTING_DOESNOT_EXISTED
        );
      } else {
        listing.update(requestBody);
      }
      res.status(HttpError.SUCCESSFUL_CODE).json({
        message: HttpError.HTTP_MESSAGE.SUCCESS_UPDATE_LISTING,
        listing: listing,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * get all listing
 * @param req request include the searchQuery, it will target %like% to title and description
 * @param res a list of listings.
 * @param next
 */
export const getAllListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let response = new PaginationResponse(req);

    const whereClause: any = {};

    // Build the where clause for filtering by category
    // get listing by multi categories
    if (req.query.categoryId) {
      //get latest category list; uncomment this to has category filter error handler
      // let listingCategories = await ListingCategory.findAll();

      // const ALLOWED_CATEGORIES = listingCategories.map((cat) => cat.id);

      const categoryIdsArray = (req.query.categoryId as string)
        .split(",")
        .map(Number); // Parse query string

      // if (!categoryIdsArray.every((id) => ALLOWED_CATEGORIES.includes(id))) {
      //   throw new HttpError(
      //     HttpError.BAD_REQUEST_CODE,
      //     HttpError.BAD_REQUEST_DESCRIPTION,
      //     "Invalid categoryId value"
      //   );
      // }

      whereClause.categoryId = {
        [Op.in]: categoryIdsArray, // Match any in the array
      };
    }

    // search key will target title or description of the listing.
    if (req.query.search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${req.query.search}%` } }, // Title contains searchQuery
        { description: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    // apply pagination, sort and search
    const { rows: listings, count: total } = await Listing.findAndCountAll({
      where: whereClause,
      limit: response.getResponse().limit,
      offset: response.getOffset(),
      order: response.getOrder(),
      distinct: true,
      include: ["user", "job"], // include user and job object in the response.
      // attributes: { exclude: ["password"] },
    });

    response.setResults(listings);
    response.setTotal(total);
    res.status(HttpError.SUCCESSFUL_CODE).json(response.getResponse());
  } catch (error) {
    next(error);
  }
};

/**
 * get listing by current user. For my post Screen.
 * Note: add searchQuery in needed.
 * @param req
 * @param res
 * @param next
 */
export const getListingsByCurrentUser = async (
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
      const { rows: listings, count: total } = await Listing.findAndCountAll({
        where: { createdUser: res.locals.user.id },
        limit: response.getResponse().limit,
        offset: response.getOffset(),
        order: response.getOrder(),
        distinct: true,
        include: ["user", "job"],
      });
      response.setResults(listings);
      response.setTotal(total);
      res.status(HttpError.SUCCESSFUL_CODE).json(response.getResponse());
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get listing by listing ID.
 * @param req
 * @param res a listing object
 * @param next
 */
export const getListingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listing = await Listing.findOne({
      where: { id: req.params.id },
      include: ["user", "job"],
    });
    if (!listing) {
      throw new HttpError(
        HttpError.NOT_FOUND_CODE,
        HttpError.NOT_FOUND_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_LISTING_DOESNOT_EXISTED
      );
    } else {
      res.status(HttpError.SUCCESSFUL_CODE).json(listing);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Create job listing, category == 1
 * @param req
 * @param res
 * @param next
 */
export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let requestBody = req.body;
  try {
    if (!res.locals || !res.locals.user.id) {
      throw new HttpError(
        HttpError.UNAUTHORIZED_CODE,
        HttpError.UNAUTHORIZED_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_RESTRICTED_PERMISSION
      );
    } else if (res.locals.user.id) {
      requestBody.createdUser = res.locals.user.id;

      //check if user want to create job;
      if (requestBody.categoryId !== 1) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          HttpError.HTTP_MESSAGE.ERROR_CREATE_LISTING
        );
      } else {
        const result = await sequelize.transaction(async (t) => {
          let createdListing: any = await Listing.create(requestBody, {
            transaction: t,
          });
          requestBody.listingId = createdListing.id;
          const job = await Job.create(requestBody, { transaction: t });
          createdListing.dataValues.jobDetail = job;
          return createdListing;
        });

        res.status(HttpError.CREATE_SUCCESSFUL_CODE).json({
          message: HttpError.HTTP_MESSAGE.SUCCESS_CREATE_JOB,
          listing: result,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * edit job listing
 * @param req
 * @param res
 * @param next
 */
export const editJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let requestBody = req.body;
  try {
    if (!res.locals || !res.locals.user.id) {
      throw new HttpError(
        HttpError.UNAUTHORIZED_CODE,
        HttpError.UNAUTHORIZED_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_RESTRICTED_PERMISSION
      );
    } else if (res.locals.user.id) {
      requestBody.createdUser = res.locals.user.id;

      // if user try to change the job listing category, throw error.
      if (requestBody.categoryId !== 1) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          HttpError.HTTP_MESSAGE.ERROR_MODIFY_JOB_LISTING_CATEGORY_TO_NORMAL
        );
      }
      const result = await sequelize.transaction(async (t) => {
        const job = await Job.findOne({
          where: { id: req.params.id },
          transaction: t,
        });
        if (!job) {
          throw new HttpError(
            HttpError.NOT_FOUND_CODE,
            HttpError.NOT_FOUND_DESCRIPTION,
            HttpError.HTTP_MESSAGE.ERROR_JOB_LISTING_DOESNOT_EXISTED
          );
        } else {
          await job.update(requestBody, { transaction: t });

          const listing = await Listing.findOne({
            where: { id: job?.listingId },
            transaction: t,
          });

          await listing?.update(requestBody, { transaction: t });
        }

        return requestBody;
      });

      res.status(HttpError.SUCCESSFUL_CODE).json({
        message: HttpError.HTTP_MESSAGE.SUCCESS_UPDATE_JOB_LISTING,
        listing: result,
      });
    }
  } catch (error) {
    next(error);
  }
};
