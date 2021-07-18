import express from "express";

import BadParamError from "../exceptions/badParamError";
import EntityNotFoundError from "../exceptions/entityNoyFoundError";
import { addSubscription, existArtist, notifyUsers, removeSubscription } from "../services/subscription.service";
import { existParams } from "../utils/utils";

export const subscriptionRouter = express.Router();

// Subscribe user
subscriptionRouter.post('/subscribe', async (req, res, next) => {
  try{
    const validParams = ['artistId', 'email'];
    if(!existParams(validParams, req.body)) throw new BadParamError(validParams);

    const artistId = req.body.artistId;
    const email = req.body.email;

    const exist = await existArtist(artistId);
    if(!exist) throw new EntityNotFoundError('Artist', artistId);

    req.app.locals.subscriptions = addSubscription(email, artistId, req.app.locals.subscriptions);

    res.status(200).json({});
    next();
  } catch(err) { next(err) }
});

// Unsubscribe user
subscriptionRouter.post('/unsubscribe', async (req, res, next) => {
  try{
    const validParams = ['artistId', 'email'];
    if(!existParams(validParams, req.body)) throw new BadParamError(validParams);

    const artistId = req.body.artistId;
    const email = req.body.email;

    const exist = await existArtist(artistId);
    if(!exist) throw new EntityNotFoundError('Artist', artistId);

    req.app.locals.subscriptions = removeSubscription(email, artistId, req.app.locals.subscriptions);

    res.status(200).json({});
    next();
  } catch(err) { next(err) }
});

// Notify users
subscriptionRouter.post('/notify', async (req, res, next) => {
  try{
    const validParams = ['artistId', 'subject', "message"];
    if(!existParams(validParams, req.body)) throw new BadParamError(validParams);

    const artistId = req.body.artistId;
    const subject = req.body.subject;
    const message = req.body.message;

    const exist = await existArtist(artistId);
    if(!exist) throw new EntityNotFoundError('Artist', artistId);

    notifyUsers(artistId, subject, message, req.app.locals.subscriptions);

    res.status(200).json({});
    next();
  } catch(err) { next(err) }
});