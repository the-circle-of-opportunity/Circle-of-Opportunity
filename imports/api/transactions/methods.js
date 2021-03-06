import { Meteor } from 'meteor/meteor';
import { Transactions } from './transactions.js';

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Meteor.methods({

  // Transaction COO Donor to COO Student
  createTransaction: function(options) {

    // Get the donor's and student's public key stored in mongodb
    var ethD = Meteor.users.findOne({_id:  options.idSender}).ethereum;
    var ethS = Meteor.users.findOne({_id:  options.idReceiver}).ethereum;
    //if(ethD == Meteor.settings.ethDonorCoo){
    if(ethD == Meteor.settings.ethDonorCoo){
      var pwdSender = Meteor.settings.pwdDonorCoo;
    }
    else var pwdSender = Meteor.settings.pwdStudentCoo;

    try{
      var trans = ethSendEtherTransaction(ethD, pwdSender, ethS, options.amount);
    } catch(err) {
      throw new Meteor.Error(err,"Not enough money in your ethereum wallet");
    }


    options.transactionHash = trans;

    // Store the transaction in the database
    return Transactions.insert(options);
  },

  // Transaction COO Donor to COO General Pot
  donatenow: function(options){
    // COO's donor public key
    var ethD = Meteor.users.findOne({_id:  options.idSender}).ethereum;
    // Password of the COO's donor
    var pwdSender = Meteor.settings.pwdDonorCoo;
    // General pot's public key
    var keyGeneral = Meteor.settings.general.generalKey;
    // Make the transaction
    var trans = ethSendEtherTransaction(ethD, pwdSender, keyGeneral, options.amount);
    // build the object options to store record of the transaction in MongoDB
    options.transactionHash = trans;
    options.idReceiver =  Meteor.settings.general.generalId;
    options.nameReceiver =  Meteor.settings.general.generalName;

    // Store the transaction in the database
    return Transactions.insert(options);
  },

  // If student, return the amount of money received so far
  // If donor, return the amount of donations given so far
  totalDonation: function(options) {
    check(options,String);

    // For someone who isnt a student
    // ******************************
    var user = Meteor.users.findOne({_id: options});

    if(user.userType.isStudent) {

      var transactionPointer = Transactions.find({idReceiver: options});
      totalAmount = 0;

      transactionPointer.forEach(function(transaction) {
        totalAmount = totalAmount + transaction.amount;
      });
    } else {

      var transactionPointer = Transactions.find({idSender: options});
      totalAmount = 0;

      transactionPointer.forEach(function(transaction) {
        totalAmount = totalAmount + transaction.amount;
      });
    }
    return Number(totalAmount.toFixed(2));
  },

  // Return an array of people that have transactions with this particular person and total amount
  DonatedTo: function(id) {

    check(id,String);

    var user = Meteor.users.findOne({_id: id});

    // If calling this from a student's profile page
    if(user.userType.isStudent) {

      var donor = [];

      var transactionPointer = Transactions.find({idReceiver: id});

      transactionPointer.forEach( function(transaction) {

        var found = donor.find(function(value){
          return value.id == transaction.idSender
        });
        var transation_amount = transaction.amount;
        if(found) {
          found.amount = Number((found.amount + transaction.amount).toFixed(2));
        } else {
          donor.push(
            {
              id: transaction.idSender,
              name: transaction.nameSender,
              amount: Number((transation_amount).toFixed(2)),
            }
          )
        }

      });
      return donor;
    }

    // IF not calling this from a student's profile page
    var student = [];

    var transactionPointer = Transactions.find({idSender: id});

    transactionPointer.forEach( function(transaction) {

      var found = student.find( function(value) {
        return value.id == transaction.idReceiver
      });
      var transation_amount = transaction.amount;
      if(found) {
        found.amount = ((found.amount + transaction.amount).toFixed(2));
      }
      else {
        student.push(
          {
            id: transaction.idReceiver,
            name: transaction.nameReceiver,
            amount: Number((transation_amount).toFixed(2)),
          }
        )
      }

    });

    return student;
  },

  // Returns total amount paid by non-previousStudent users
  totalDonorDonations: function() {

    var transactionPointer = Transactions.find({type: {$in: ["DtG", "DtS"]}});
    totalAmount = 0;

    transactionPointer.forEach(function(transaction) {
      var donor = Meteor.users.findOne({_id: transaction.idSender});
      if("undefined"=== typeof donor.uni_info) {
        totalAmount = totalAmount + transaction.amount;
      }
    });

    return Number((totalAmount*Meteor.settings.ethToPound).toFixed(2));
  },

  // Returns total amount paid for tuition and allowance
  totalTuitionAndAllowance: function() {

    var transactionPointer = Transactions.find({type: {$in: ["StU","StC"]}});
    totalAmount = 0;

    transactionPointer.forEach(function(transaction){
      totalAmount = totalAmount + transaction.amount;
    });

    return Number((totalAmount*Meteor.settings.ethToPound).toFixed(2));
  },

  // Returns total amount paid back by previous students
  totalPaidBack: function() {

    var transactionPointer = Transactions.find({type: {$in: ["DtG","DtS"]}});
    totalAmount = 0;

    transactionPointer.forEach(function(transaction){
      var donor = Meteor.users.findOne({_id: transaction.idSender});
      if("undefined"!=typeof donor.uni_info && donor.uni_info.eStatus=="graduated") {
        totalAmount = totalAmount + transaction.amount;
      }
    });

    return Number((totalAmount*Meteor.settings.ethToPound).toFixed(2));
  }

});
