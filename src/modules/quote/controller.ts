import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { HttpStatus } from '~const';

import QuoteService from './service';

export const getQuoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quote = await Container.get(QuoteService).getQuoteById(+req.params.id);
    return res.status(HttpStatus.OK).json(quote);
  } catch (error) {
    next(error);
  }
};

export const getQuotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(QuoteService).getQuotes(req.query);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAllQuotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Container.get(QuoteService).getAllQuotes(req.query);
    return res.status(HttpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const createQuote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdQuote = await Container.get(QuoteService).createQuote(req.body);
    return res.status(HttpStatus.CREATED).json(createdQuote);
  } catch (error) {
    next(error);
  }
};
