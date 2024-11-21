import { Request, Response, NextFunction } from "express";

import Listing from "../models/Listing";
import { HttpError } from "../utils/httpError";
import { PaginationResponse } from "../utils/PaginationResponse";

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
    let requestBody:Listing = req.body;
    if(!res.locals || !res.locals.user.id){
        throw new HttpError(HttpError.UNAUTHORIZED_CODE, HttpError.UNAUTHORIZED_DESCRIPTION, "Restricted permission or session is expired.")
    } else if (res.locals.user.id) {
        requestBody.createdUser = res.locals.user.id;

        try {
            await Listing.create(requestBody)
            res.status(HttpError.CREATE_SUCCESSFUL_CODE).json({ message: "create listing successfully", listing:requestBody });
        } catch (error) {
            next(error)
        }
    }
    
};

export const editListing = async (req: Request, res: Response, next: NextFunction) => {
    let requestBody:Listing = req.body;
    if(!res.locals || !res.locals.user.id){
        throw new HttpError(HttpError.UNAUTHORIZED_CODE, HttpError.UNAUTHORIZED_DESCRIPTION, "Restricted permission or session is expired.")
    } else if (res.locals.user.id) {
        requestBody.createdUser = res.locals.user.id;

        try {
            const listing = await Listing.findOne({where:{id : req.params.id}})
            if(!listing){
                throw new HttpError(HttpError.NOT_FOUND_CODE, HttpError.NOT_FOUND_DESCRIPTION, "Listing does not exist.")
            }else {
                listing.update(requestBody)
            }
            res.status(HttpError.CREATE_SUCCESSFUL_CODE).json({ message: "update listing successfully", listing:listing });
        } catch (error) {
            next(error)
        }
    }
    
};

export const getAllListings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let response = new PaginationResponse(req);

        const { rows: listings, count: total } = await Listing.findAndCountAll({
            limit: response.getResponse().limit,
            offset: response.getOffset(),
            order:response.getOrder()
          });
        
        response.setResults(listings);
        response.setTotal(total);
        res.status(HttpError.SUCESSFUL_CODE).json(response.getResponse());
    } catch (error) {
        next(error)
    }
    
};

export const getListingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const listing = await Listing.findOne({where:{id : req.params.id}})
        if(!listing){
            throw new HttpError(HttpError.NOT_FOUND_CODE, HttpError.NOT_FOUND_DESCRIPTION, "Listing does not exist.")
        }else {
            res.status(HttpError.SUCESSFUL_CODE).json(listing)
        }
        
    } catch (error) {
        next(error)
    }
}
