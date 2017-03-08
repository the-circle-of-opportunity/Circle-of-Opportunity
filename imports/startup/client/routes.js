import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import to load these templates
import '../../ui/pages/homepage.js';
import '../../ui/pages/mainpage.js';
import '../../ui/pages/howitworks.js';
import '../../ui/pages/studentoverview.js';
import '../../ui/pages/viewthecircle.js';
import '../../ui/pages/donorregister.js';
import '../../ui/pages/studentregister.js';
import '../../ui/pages/contact.js';
import '../../ui/pages/donatenow.js';
import '../../ui/pages/studentRegForm.js';
import '../../ui/components/navBar.js';


// Import to override accounts templates


// Below here are the route definitions

FlowRouter.route('/', {
  name: 'homepage',
  action(){
    BlazeLayout.render('mainpage', {main: 'homepage'});
  },
});

FlowRouter.route('/students', {
  name: 'studentsoverview',
  action(){
    BlazeLayout.render('mainpage', {main: 'studentoverview'});
  },
});

FlowRouter.route('/howitworks', {
  name: 'howitworks',
  action(){
    BlazeLayout.render('mainpage', {main: 'howitworks'});
  },
});

FlowRouter.route('/viewthecircle', {
  name: 'viewthecircle',
  action(){
    BlazeLayout.render('mainpage', {main: 'viewthecircle'});
  },
});

FlowRouter.route('/studentregister', {
  name: 'studentregister',
  action(){
    BlazeLayout.render('mainpage', {main: 'studentregister', form: 'studentRegForm'});
  },
});

FlowRouter.route('/donorregister', {
  name: 'donorregister',
  action(){
    BlazeLayout.render('mainpage', {main: 'donorregister'});
  },
});

FlowRouter.route('/contact', {
  name: 'contact',
  action(){
    BlazeLayout.render('mainpage', {main: 'contact'});
  },
});

FlowRouter.route('/donatenow', {
  name: 'donatenow',
  action(){
    BlazeLayout.render('mainpage', {main: 'donatenow'});
  },
});