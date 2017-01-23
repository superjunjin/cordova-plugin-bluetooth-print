#!/usr/bin/env node

//this hook installs all your plugins

var path = require('path');
var exec = require('child_process').exec;

var packageJSON = require('../../package.json');
var pluginlist = packageJSON.cordovaPlugins || [];

var localpluginlist = packageJSON.localPlugins || [];

function puts(error, stdout, stderr) {
    console.log(stdout);
}

pluginlist.forEach(function(plug) {
    exec("cordova plugin add " + plug, puts);
});

