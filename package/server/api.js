/*jshint esversion: 6 */
import moment from 'moment';

const quote = (credits, currency) => {
  let rate;

  //error checking
  if(credits < 0) {
    throw new Meteor.Error('cannot quotea price for a negative amount of credits');
  }
  if(currency != 'EUR') {
    throw new Meteor.Error('price quoting does not yet support currency', currency);
  }

  //pricing table determines the rate
  if(credits <= 2) {
    rate = 2;
  }
  else if(credits <= 50) {
    rate = 1.5;
  }
  else if (credits <= 100) {
    rate = 1.25;
  }
  else if (credits <= 200) {
    rate = 1;
  }
  else if (credits <= 300) {
    rate = 0.90;
  }
  else if (credits <= 500) {
    rate = 0.80;
  }
  else if (credits <= 1000) {
    rate = 0.75;
  }
  else {
    rate = 0.70;
  }

  //calculate the amount
  const base = 0.5;
  const amount = Math.round(base * credits * rate).toFixed(2);

  //get the display currency
  let displayCurrency = currency;
  switch(currency) {
    case 'EUR':
      displayCurrency = '€';
      break;
    default:
      displayCurrecny = currency;
  }

  //insert the quote into the database
  const quoteId = Quotes.insert({
    credits: credits,
    amount: amount,
    currency: currency,
    displayCurrency: displayCurrency,
    validityHours: 24
  });

  //return quote id
  return quoteId;
};

const removeExpiredQuotes = () => {

  //if user is admin
  const isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin']);
  if(isAdmin) {

    //get all quotes
    const quotes = Quotes.find({}, {createdAt: 1, validityHours: 1});
    Log.log(['information', 'pricing'], `Existing number of ${quotes.count()}.`);

    //for each quote
    const expiredQuotes = [];
    const now = moment();
    quotes.forEach((quote) => {
      // console.log('validityHours:', quote.validityHours);
      const createdDate = moment(quote.createdAt);
      // console.log('createdDate:', createdDate);
      const expirationDate = quote.validityHours?createdDate.add(quote.validityHours, 'h'):createdDate;
      // console.log('expirationDate:', expirationDate);
      const isExpired = expirationDate.isBefore(now);
      // console.log('isExpired:', isExpired);
      if(isExpired) {
        expiredQuotes.push(quote._id);
      }
    });
    Log.log(['information', 'pricing'], `Removing ${expiredQuotes.length} expired quotes.`);

    //remove all expired quotes
    Quotes.remove({_id: {$in: expiredQuotes}});
  }
};

export default {
  quote: quote,
  removeExpiredQuotes: removeExpiredQuotes
};
