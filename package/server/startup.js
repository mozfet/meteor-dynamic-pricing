/*jshint esversion: 6 */
import Pricing from './api';
import moment from 'moment';

//before insert
Quotes.before.insert(function (userId, doc) {

  //set owner id
  doc.ownerId = userId;

  //set expired as false
  doc.expired = false;

  //set creation and update time
  doc.createdAt = moment().format();
});

//publish credits to admin and owners
Meteor.publish('quotes', function () {
  const userId = Meteor.userId();

  //if user is admin
  if(Roles.userIsInRole(userId, ['admin'])) {

    //publish all credits
    return Quotes.find({});
  }

  //all other users
  else {

    //publish all quotes of this user
    const quotes = Quotes.find({ownerId: userId});
    Log.log(['payments', 'credits'], 'Published '+quotes.count()+' quotes to '+userId);
    return quotes;
  }
});

//remote procedure calls
Meteor.methods({
  'pricing.quote': Pricing.quote
});
