import { Meteor } from 'meteor/meteor';
import { Transactions } from '../transactions/transactions.js';

Meteor.methods({

  reallocate: function() {

    console.log('Entering reallocation method');
    // Set up variables to be used
    var goalAmount = 0.27;
    var balance_table = [];
    var potBalance = ethGetBalance('0xc08ee9c6252fb61271520dacac9a6126255bc81e');
    var totalEther = potBalance;
    var gasPrice = 0.002;

    // Get all of the students data and store in an array
    var users = Meteor.users.find({"userType.isStudent": true},{fields:{'_id': 1,'ethereum': 1, 'name': 1}}).fetch();

    console.log(users);

    // Create a table detailing all of the students current funds and get the totla balance
    for(i = 0; i < users.length; i++){
      ethBalance = ethGetBalance(users[i].ethereum);
      totalEther += ethBalance;
      balance_table.push({_id: users[i]._id,ethereum: users[i].ethereum,name: users[i].name, balance: ethBalance});
    }

    console.log('Total Balance:');
    console.log(totalEther);

    // Sort the table from highest to lowest
    balance_table.sort(function(a,b) {return (a.balance > b.balance) ? -1 : ((b.balance > a.balance) ? 1 : 0);});

    console.log(balance_table);

    // Determine who is in the cut off and who isn't

    var numAccepted =  Math.floor(totalEther/goalAmount);
    if(users.length < numAccepted) numAccepted = users.length;

    console.log(numAccepted);

    // Take all of the Ether in each students account who is cut off and put it in the general pot
    for(i = numAccepted;i < users.length; i++){
      console.log('In student to GP reallocation step');
      var transferBalance = balance_table[i].balance - gasPrice;
      console.log(transferBalance);
      var trans = ethSendEtherTransaction(balance_table[i].ethereum,"password",Meteor.settings.general.generalKey,transferBalance);
      console.log(trans);

      var idD = balance_table[i]._id;
      var nD = balance_table[i].name;
      var a = transferBalance;

      var options = {
        type : "StG",
        idDonor: idD,
        idStudent: Meteor.settings.general.generalId,
        nameDonor: nD.first + " " + nD.last,
        nameStudent: Meteor.settings.general.generalName,
        amount: a,
        transactionHash: trans,
      }

      Transactions.insert(options);
    }

    // Take all of the funds in the general pot and distribute them to the remaining students
    for(i = 0; i < numAccepted; i++){
      console.log('In GP to student reallocation step');
      var transferBalance = goalAmount - balance_table[i].balance;
      console.log(transferBalance);
      if(transferBalance > 0){
        var trans = ethSendEtherTransaction(Meteor.settings.general.generalKey,Meteor.settings.general.generalPwd, balance_table[i].ethereum,transferBalance);
        console.log(trans);

        var idS = balance_table[i]._id;
        var nS = balance_table[i].name;
        var a = transferBalance;

        var options = {
          type : "GtS",
          idDonor: Meteor.settings.general.generalPwd,
          idStudent: idS,
          nameDonor: Meteor.settings.general.generalName,
          nameStudent: nS.first + " " + nS.last,
          amount: a,
          transactionHash: trans,
        }

        Transactions.insert(options);
      }
    }

  }
});
