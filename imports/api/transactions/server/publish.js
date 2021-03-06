import { Transactions } from '/imports/api/transactions/transactions.js';

// All variables to publish are kept in the fields option
Meteor.publish('transactions', function () {

});

Meteor.publish('topTransactions', function (nT) {
	return Transactions.find({},{sort: {createdAt: -1}, limit: nT});
});

Meteor.publish('topStudentTransactions', function(id,nT){
	return Transactions.find({idReceiver: id},{sort: {createdAt: -1}, limit: nT});
});

Meteor.publish('topDonorTransactions', function(id,nT){
	return Transactions.find({idSender: id},{sort: {createdAt: -1}, limit: nT});
});

Meteor.publish('topGeneralPotTransactions', function(nT){
	return Transactions.find({type: "DtG"},{sort: {createdAt: -1}, limit: nT});
});
