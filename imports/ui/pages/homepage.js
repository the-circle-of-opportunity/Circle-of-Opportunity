import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Universities } from '../../api/universities/universities.js';

import './homepage.html';
import '../components/liveFeed.js';
import '/imports/api/users/helpers.js'
//import '../components/ticker.js'

Template.homepage.helpers({

  donorDonations: function(){
    return ReactiveMethod.call('totalDonorDonations');
  },

  tuitionAndAllowance: function(){
    return ReactiveMethod.call("totalTuitionAndAllowance");
  },

  paidBack: function(){
    return ReactiveMethod.call("totalPaidBack");
  }
})