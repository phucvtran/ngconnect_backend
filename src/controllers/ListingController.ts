import { Request, Response, NextFunction } from "express";

import Listing from "../models/Listing";
import { HttpError } from "../utils/httpError";
import { PaginationResponse } from "../utils/PaginationResponse";
import Job from "../models/Job";
import sequelize from "../config/dbConnection";
import { Op } from "sequelize";
import { ListingCategory } from "../models/ListingCategory";

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
        "Restricted permission or session is expired."
      );
    } else if (res.locals.user.id) {
      requestBody.createdUser = res.locals.user.id;

      if (requestBody.categoryId === 1) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          "You are trying to create job. use createJob api instead."
        );
      }
      await Listing.create(requestBody);
      res
        .status(HttpError.CREATE_SUCCESSFUL_CODE)
        .json({ message: "create listing successfully", listing: requestBody });
    }
  } catch (error) {
    next(error);
  }
};

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
        "Restricted permission or session is expired."
      );
    } else if (res.locals.user.id) {
      requestBody.createdUser = res.locals.user.id;

      if (requestBody?.categoryId === 1) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          "Can't change this listing to Job Listing"
        );
      }
      const listing = await Listing.findOne({ where: { id: req.params.id } });
      if (!listing) {
        throw new HttpError(
          HttpError.NOT_FOUND_CODE,
          HttpError.NOT_FOUND_DESCRIPTION,
          "Listing does not exist."
        );
      } else {
        listing.update(requestBody);
      }
      res
        .status(HttpError.SUCESSFUL_CODE)
        .json({ message: "update listing successfully", listing: listing });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let response = new PaginationResponse(req);

    // Build the where clause for filtering by category
    const whereClause: any = {};
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

    const { rows: listings, count: total } = await Listing.findAndCountAll({
      where: whereClause,
      limit: response.getResponse().limit,
      offset: response.getOffset(),
      order: response.getOrder(),
      distinct: true,
      include: ["user", "job"],
      // attributes: { exclude: ["password"] },
    });

    response.setResults(listings);
    response.setTotal(total);
    res.status(HttpError.SUCESSFUL_CODE).json(response.getResponse());
  } catch (error) {
    next(error);
  }
};

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
        "Restricted permission or session is expired."
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
      res.status(HttpError.SUCESSFUL_CODE).json(response.getResponse());
    }
  } catch (error) {
    next(error);
  }
};

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
        "Listing does not exist."
      );
    } else {
      res.status(HttpError.SUCESSFUL_CODE).json(listing);
    }
  } catch (error) {
    next(error);
  }
};

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
        "Restricted permission or session is expired."
      );
    } else if (res.locals.user.id) {
      requestBody.createdUser = res.locals.user.id;

      //check if user want to create job;
      if (requestBody.categoryId !== 1) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          "You are trying to create listing. use createListing api instead."
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

        res
          .status(HttpError.CREATE_SUCCESSFUL_CODE)
          .json({ message: "create job successfully", listing: result });
      }
    }
  } catch (error) {
    next(error);
  }
};

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
        "Restricted permission or session is expired."
      );
    } else if (res.locals.user.id) {
      requestBody.createdUser = res.locals.user.id;

      if (requestBody.categoryId !== 1) {
        throw new HttpError(
          HttpError.BAD_REQUEST_CODE,
          HttpError.BAD_REQUEST_DESCRIPTION,
          "Can't Change Job Listing to Normal Listing"
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
            "Job does not exist."
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

      res
        .status(HttpError.SUCESSFUL_CODE)
        .json({ message: "update job successfully", listing: result });
    }
  } catch (error) {
    next(error);
  }
};
