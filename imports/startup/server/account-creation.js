// *****************************************************************************
// Function extending the fields in user accounts
// *****************************************************************************

import { Universities } from '/imports/api/universities/universities.js';

Accounts.onCreateUser(function(options,user) {

  // Error Handling:
  // ---------------

  // making sure the username/email has not already been created
  // ************************************************************

  var newEmail = options.email;
  var emailAlreadyExists = Meteor.users.find({"emails.address": newEmail});

  if(emailAlreadyExists == true) {
    throw new Meteor.Error("emailAlreadyExists", "email already registered");
  }

  // making sure the password matches password verification
  // ******************************************************

  var password = options.password;
  var password_verification = options.password_verification;

  if(password != password_verification) {
    throw new Meteor.Error("passwordsDontMatch", "passwords do not match");
  }


  // Student only Information
  // ------------------------

  if(options.userType.isStudent) {

  // Add in university & opportunity information to user document
  var uni = Universities.findOne({name: "Imperial College"});
  user.uni_info = {
    name: uni.name,
    uni: uni._id,
    program: "Msc of Computing Science",
    eStatus: "pending",
    tuition: 13500,
    tuition_eth: .125,
    allowance: 1256,
    allowance_eth: .0125,
    deadline: "Mid-August",
    payments_remaining: 10,
  }
}

  // Add in the userType
  if(options.userType) {
    user.userType = options.userType;
  }


  // Add in the company_info
  if(options.company_info) {
    user.company_info = options.company_info;
  }


  // Add in non-default parameters
  // -----------------------------

  /*
  NOTE: the default parameters automatically added in are email and password
  */

  // Add in name field to user document
  if(options.name) {
    user.name = options.name;
  }

  // Add in contact field to user document (currently just phone)
  if(options.phone) {
    user.phone = options.phone;
  }

  // Add in address field to user document
  if(options.address) {
    user.address = options.address;
  }

  // Add in age field to user document
  if(options.age) {
    user.age = options.age;
  }

  // Add in image field to user document
  if(options.image) {
    user.image = options.image;
  }

  // Store Ethereum Public Key for this user
  if(options.ethereum) {
    user.ethereum = options.ethereum;
  }

  // Store Ethereum external Public Key for user
  if(options.ethereum_ext) {
    user.ethereum_ext = options.ethereum_ext;
  }

  // Store bio for user
  if(options.bio) {
    user.bio = options.bio;
  }

  // Boolean true if the student receives living allowances
  user.allowance = options.allowance;


  // Store information just for the universityAdmin user
  if(options.userType.isUniAdmin) {
    uni = Universities.findOne({name: options.adminFor})
    user.adminFor = uni._id;
  }

  // Want to keep the default hook's profile behavior
  if(options.profile) {
    user.profile = options.profile;
  }

  // Send email notifying user their profile has been created
  //  Must set environment variable MAIL_URL
  //    MAIL_URL='smtp://USERNAME:PASSWORD@HOST:PORT'
  //    export MAIL_URL
  //    For Gmail: HOST=smtp.gmail.com, PORT=587
  /*
  to_email = user.name.first + " <" + newEmail + ">"
  Meteor.call(
    'sendEmail',
    to_email,
    // from email is being set to MAIL_URL email above
    'registration@coo.com',
    'Hello from COO!',
    "<p><strong>This is a test email</strong>. Welcome to the COO.</p>",
  );
  */
	return user;
});
