import { HttpError } from "../model/Response";
import { Response } from "express";

export function handleException(res: Response, error: any) {
    console.log(error);
    if (error instanceof HttpError) {
        res.status(error.code).json(error.message);
    } else if (error instanceof Error) {
        res.status(500).json(error.message);
    } else {
        res.status(500).json("Internal Server Error");
    }
}

export const success = {result: true};
export const failed = {result: false};