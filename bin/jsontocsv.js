#!/usr/bin/env node

/**
 * Module dependencies.
 */
var program = require('commander');
var pjson = require('../package.json');
var fs = require('fs');
var jsonToCsv = require('../lib/jsontocsv.js');

/*
 * Commander Args
 */
program
  .version(pjson.version)
  .option('-i, --input <input>', 'Incoming json file path')
  .option('-o, --output <output>', 'Path for outgoing CSV file. Defaults to current directory.')
  .parse(process.argv);

function readFile(callback) {
  if (program.input) {
    fs.readFile(program.input, 'utf8', function(err, data) {
      if (err) {
        return callback(err);
      }

      callback(null, JSON.parse(data));
    });
  }
}

readFile(function(err, data) {
  if (err) {
    return false;
  }

  jsonToCsv(data, function(err, csv) {
    // Callback contain csv as string
    var fileName,
      fileDirectory,
      fileUrl;

    // If file output setted fileName is same with output else set default to input name
    fileName = String((program.output ? program.output : program.input)).split('.')[0] + ".csv";

    fileUrl = process.cwd() + "/" + fileName;

    fs.writeFile(fileUrl, csv, function(err) {
      if(err) {
        return console.log(err);
      }

      console.log("The file was saved to " + fileUrl + " !");
    });
  });
});
