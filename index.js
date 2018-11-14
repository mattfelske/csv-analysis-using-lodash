process.stdin.setEncoding('utf8');

const async = require('async');
const moment = require('moment');
const fs = require('fs');
const _ = require('underscore')
const csvtojsonV2 = require("csvtojson/v2");

const csvFilePath = 'Sample Data Sheet - Sheet1.csv'


async.waterfall([
  (callback) => {
    console.log('Loading data...\n');
    csvtojsonV2({
      colParser:{
        "paid":function(item, head, resultRow, row , colIdx){
            return item.replace('$', '');
        },
        "apprentices":function(item, head, resultRow, row , colIdx){
            return parseInt(item);
        },

        "candidates":function(item, head, resultRow, row , colIdx){
            return parseInt(item);
        },
        "created_at": function(item, head, resultRow, row , colIdx){
          return moment(item, 'X')
        },
        "paid_at": function(item, head, resultRow, row , colIdx){
          return moment(item, 'X')
        }
      }
    })
    .fromFile(csvFilePath)
    .on('error',(err) => callback(err))
    .then((result)=> callback(null, result));
  },

  (users, callback) => {
    console.log('***************** Test Project *****************');
    console.log('The objective is to perform engineered analytics on a data set of user accounts.');
    console.log('There are several questions presented by the marketing team, and they require some code to produce relevant answers.');
    console.log('The results for each question can be submitted in a single Node.js file.\n\n')

    console.log('Which question do you want to run? [1,2,3,4,5, or *]');
    process.stdin.on('data', (data) => {
      const SUPPORTED_OPTIONS = ['1', '2', '3', '4', '5', '*'];
      var option = data.trim();
      if (SUPPORTED_OPTIONS.indexOf(option) === -1) {
        console.error(`Unsupported input '${option}'`);
        return process.exit();
      }
      console.log(`\nSelected Option '${option}'\n`)
      callback(null, users, option)
    });
  }
], (err, users, option) => {
  if (err) {
    console.error(err);
    return process.exit(1);
  }

  if (option === '1') question1(users);
  else if (option === '2') question2(users);
  else if (option === '3') question3(users);
  else if (option === '4') question4(users);
  else if (option === '5') question5(users);
  else {
    question1(users);
    question2(users);
    question3(users);
    question4(users);
    question5(users);
  }

  process.exit();
})
// process.stdin.on('data', (data) => {
//   console.log('You wrote: ', data);
//
//   csvtojsonV2({
//     colParser:{
//       "paid":function(item, head, resultRow, row , colIdx){
//           return item.replace('$', '');
//       },
//       "apprentices":function(item, head, resultRow, row , colIdx){
//           return parseInt(item);
//       },
//
//       "candidates":function(item, head, resultRow, row , colIdx){
//           return parseInt(item);
//       },
//       "created_at": function(item, head, resultRow, row , colIdx){
//         return moment(item, 'X')
//       },
//       "paid_at": function(item, head, resultRow, row , colIdx){
//         return moment(item, 'X')
//       }
//     }
//   })
//   .fromFile(csvFilePath)
//   .on('error',(err)=>{
//       console.log(err);
//       process.exit(1);
//   })
//   .then((result)=>{
//       question1(result);
//       question2(result);
//       question3(result);
//       question4(result);
//       question5(result);
//       process.exit();
//   });


var question1 = (users) => {
  console.log('1. Which user id has paid us the most money?');
  var result = _.max(users, (user) => parseInt(user.paid));
  console.log(`\t${result.id}\n`);
};

var question2 = (users) => {
  console.log('2. What is the average payment (paid) for users with 3 or greater apprentices?');

  var x = _.filter(users, (user) => user.apprentices >= 3);
  var result = _.reduce(x, (memory, num) => parseInt(memory) + parseInt(num.paid), 0) / x.length;
  console.log(`\t$${Number.parseFloat(result).toFixed(2)}\n`)
};

var question3 = (users) => {
  console.log('3. How many users signed up (created at) in Q1 2018?');

  var x = _.filter(users, (user) => ((user.created_at.quarter() === 1) && (user.created_at.year() === 2018)));
  console.log(`\t${x.length}\n`)
};

var question4 = (users) => {
  console.log('4. How many payments were made in 2019 with users who have signed up in 2017?');

  var x = _.filter(users, (user) => user.created_at.year() === 2017);
  var y = _.filter(x, (entry) => entry.paid_at.year() === 2019);
  console.log(`\t${y.length}\n`)
};

var question5 = (users) => {
  console.log('5. How many users have certain amounts of candidates? Ex: 24 users have 10 candidates, 29 users have 9 candidates, etc… (displayed as a list)');

  var x = _.groupBy(users, (user) => user.candidates);
  _.each(Object.keys(x), (key) => {
    console.log(`\t${key} candidates for ${x[key].length} users`);
  })
};
