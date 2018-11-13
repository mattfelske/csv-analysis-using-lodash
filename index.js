const async = require('async');
const moment = require('moment');
const fs = require('fs');
const _ = require('lodash')

const p1 = require('./problems/p1');

console.log('***************** GENM Test Project *****************');
// TODO could potentially read in from args to get filepath

const FILE = "Sample Data Sheet - Sheet1.csv";

async.waterfall([
  (callback) => {
    console.log('Reading file')
    fs.readFile(FILE, 'utf-8', function(err, data) {
      if (err) return callback(err);
      callback(null, data)
    });
  },
  (data, callback) => {
    console.log('Convert csv output to JSON')
    var lines = data.split('\r\n').slice(1);
    console.log('lines', lines.length);
    var objs = lines.map((line) => {
      var vals = line.split(',');
      return {
        id: vals[0],
        firstName: vals[1],
        lastName: vals[2],
        email: vals[3],
        paid:  vals[4].replace('$', ''),
        apprentices: Number(vals[5]),
        candidates: vals[6],
        created_at: vals[7],
        paid_at: vals[8]
      };
    })
    callback(null, objs)
  },
  (transactions, callback) => {
    console.log('--- Which user id has paid us the most money?');
    var groupings = {};
    // var transactions = [transactions[0], transactions[1], transactions[2]]
    // console.log('unique', _.uniq(transactions).length)
    var highestVal = null;
    var users = [];
    transactions.forEach((t) => {
      // console.log(`$${t.paid}`)
      if (!highestVal) {
        highestVal = t.paid;
        users.push(t);
      } else if (highestVal === t.paid) {
        users.push(t);
      } else if (highestVal < t.paid) {
        users = [t];
        highestVal = t.paid
      }
    })
    
    console.log(`High paid users at $${highestVal} are: `)
    users.forEach((user) => {
      console.log(`${user.firstName} ${user.lastName}`)
    })
    callback(null, transactions);
  },
  
  (transactions, callback) => {
    console.log('--- 2. What is the average payment (paid) for users with 3 or greater apprentices?');
    if (!Array.isArray(transactions)) return callback(new Error('Should be transactions'));
    var f = transactions.find((t) => {
      return t.apprentices >= 3
    });
    console.log('total: ', f.length)
    callback(null, transactions);
  },
  
  (transactions, callback) => {
    console.log('--- 3. How many users signed up (created at) in Q1 2018?');
    callback(null, transactions);
  },
  
  (transactions, callback) => {
    console.log('--- 4. How many payments were made in 2019 with users who have signed up in 2017?');
    callback(null, transactions);
  },
  
  (transactions, callback) => {
    console.log('--- 5. How many users have certain amounts of candidates? Ex: 24 users have 10 candidates, 29 users have 9 candidates, etc… (displayed as a list)');
    callback(null, transactions);
  },
], (err, result) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Finished', result);
  process.exit();
})