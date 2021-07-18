import axios from 'axios';
import config from '../config/config';
import EntityNotFoundError from '../exceptions/entityNoyFoundError';
import GMailAPIClient from '../utils/GMailAPIClient';
import fs from 'fs';


export async function existArtist(artistId) {
  try {
    const artist = await axios.get(`${config.UNQFY_SERVICE_URI}/artists/${artistId}`);

    return artist != undefined;
  } catch(err) {
    throw new EntityNotFoundError('Artist', artistId);
  }
}

export function addSubscription(email, artistId, subscriptions) {
  let newSubscriptions;

  if(subscriptions.find(sub => sub.artist === artistId)) {
    newSubscriptions = subscriptions.map(subs => {
      if(subs.artist === artistId && subs.subscriptions.contains(email)) {
        return subs;
      } else if(subs.artist === artistId) {
        return {artist: artistId, subscriptions: [...subs.subscriptions, email]};
      }
    });
  } else {
    newSubscriptions = [...subscriptions, {artist: artistId, subscriptions: [email]}];
  }

  return newSubscriptions;
}

export function removeSubscription(email, artistId, subscriptions) {
  const newSubscriptions = subscriptions.map(subs => {
    if(subs.artist === artistId && subs.subscriptions.contains(email)) {
      const newSubs = subs.subscriptions.filter(subEmail => subEmail !== email);
      return {artist: artistId, subscriptions: newSubs }
    }
  })

  return newSubscriptions;
}

export async function notifyUsers(artistId, subject, message, subscriptions) {
  try {
    const gmailClient = new GMailAPIClient('src/config/credentials.json', 'src/config/token.json');

    const sub = subscriptions.find(x => x.artist === artistId);

    if(sub) {
      const emailPromises = sub.subscriptions.map(email => gmailClient.send_mail(
        subject,
        message,
        {email, name: ''}, 
        {name: "UNQfy newsletter", email: "unqfy@gmail.com",})
      );

      Promise.all(emailPromises);
    }

  } catch (err) {
    throw new Error('Fallo el envio de notificacion via email');
  }
}