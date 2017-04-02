import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './studentoverview.html';
import './studentView.html';

// *****************************************************************************
// What happens when you create the template
// *****************************************************************************

// OnCreated function for the template --> is run when page is rendered
// --------------------------------------------------------------------

Template.studentoverview.onCreated( function() {

  // Template level subscriptions
  // ****************************

  // subscribe to userData publication: returns all documents in user accounts
  this.subscribe('userData');

  /*
  NOTE: improvements that can be made
  1. Use following format:

  this.autorun(function() {
    this.subscribe('userData');
  });

  this.subscribe() attaches subscriptionReady() (whereas Meteor.subscribe() doesnt)
  this.autorun automatically re-initializes the subscription if something changes
  */

});



// *****************************************************************************
// Template level Helpers
// *****************************************************************************

// Helpers function for the template --> defines all the helpers needed
// ---------------------------------------------------------------------

/* NOTE: javascript syntax for the functions used

user: ()=> { return Meteor.users.find();}
is equivalent to
user: function() { return Meteor.users.find(); }

*/

Template.studentoverview.helpers({

  // user returns a pointer to all the user documents in subscription
  // ****************************************************************

  user: ()=> {
    return Meteor.users.find();
  },

  // secondStudent returns ??
  // ************************

  // NOTE: check what secondStudent returns!!!

  secondStudent: function (index) {
    return (index + 1) % 2 === 0;
  },

  // uni_name returns the name of the university affiliated with this student
  // ************************************************************************

  /*
  uni_name: function () {
    return Universities.findOne({_id:this.uni_info.uni},{name: 1});
  },
  */

});

// studentView Helper to pass on ethereum information based on public key
// -----------------------------------------------------------------------

// NOTE: Check where this is working and move it accordingly!!!!

Template.studentView.helpers({
  balance : function (){
    var myEthAddr = this.ethereum;
    return ethGetBalance(myEthAddr);
  },
});
