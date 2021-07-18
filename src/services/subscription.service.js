import axios from 'axios';
import config from '../config/config';
import EntityNotFoundError from '../exceptions/entityNoyFoundError';

export async function existArtist(artistId) {
  try {
    const artist = await axios.get(`${config.UNQFY_SERVICE_URI}/artists/${artistId}`);

    return artist != undefined;
  } catch(err) {
    throw new EntityNotFoundError('Artist', artistId);
  }
}

export function addSubscription(email, artistId, subscriptions) {
  const newSubscriptions = subscriptions.map(subs => {
    if(subs.email === email && subs.subscriptions.contains(artistId)) {
      return subs;
    } else if(subs.email === email) {
      return {email, subscriptions: [...subs.subscriptions, artistId]};
    }

    return subs;
  });

  return newSubscriptions;
}

export function removeSubscription(email, artistId, subscriptions) {
  const newSubscriptions = subscriptions.map(subs => {
    if(subs.email === email && subs.subscriptions.contains(artistId)) {
      const newSubs = subs.subscriptions.filter(art => art !== artistId);
      return {email, subscriptions: newSubs }
    }
  })

  return newSubscriptions;
}