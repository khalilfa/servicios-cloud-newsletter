import express from "express";

import BadParamError from "../exceptions/badParamError";
import EntityNotFoundError from "../exceptions/entityNoyFoundError";
import { addSubscription, allSubscriptionsFor, deleteSubscriptions, existArtist, notifyUsers, removeSubscription } from "../services/subscription.service";
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

// All subscribed users
subscriptionRouter.get('/subscriptions/:artistId', async (req, res, next) => {
  try{
    console.log('Entra aca');
    const validParams = ['artistId'];
    if(!existParams(validParams, req.params)) throw new BadParamError(validParams);

    const artistId = req.params.artistId;

    const exist = await existArtist(artistId);
    if(!exist) throw new EntityNotFoundError('Artist', artistId);

    const subscriptions = allSubscriptionsFor(artistId, req.app.locals.subscriptions);

    console.log('Llega antes del status 200');
    res.status(200).json({ artistId, subscriptors: subscriptions });
    next();
  } catch(err) { next(err) }
});

// Delete all subscribed users
subscriptionRouter.delete('/subscriptions', async (req, res, next) => {
  try{
    const validParams = ['artistId'];
    if(!existParams(validParams, req.body)) throw new BadParamError(validParams);

    const artistId = req.body.artistId;

    const exist = await existArtist(artistId);
    if(!exist) throw new EntityNotFoundError('Artist', artistId);

    req.app.locals.subscriptions = deleteSubscriptions(artistId, req.app.locals.subscriptions);

    res.status(200).json({});
    next();
  } catch(err) { next(err) }
});

// Ping
subscriptionRouter.delete('/ping', async (req, res, next) => {
  try{
    res.status(200).json({});
    next();
  } catch(err) { next(err) }
});