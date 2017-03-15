'use strict';

var _ = require('lodash');
var glob = require("glob");
var path = require('path');
var s = require('underscore.string');
var yeoman = require('yeoman-generator');

var logger = require('../app/logger');
var utils = require('../app/utils');

var srcCompPath = './src/components/';

function getCompName(path) {
	return utils.readDir(path);
}


module.exports = yeoman.Base.extend({
  prompting() {
  	let cpNames = getCompName(srcCompPath);
  	cpNames.splice(cpNames.indexOf('index.js'), 1);
  	let choices=[];
  	cpNames.forEach((line, i) => {
  		choices.push({
  			name: line,
  			value: line
  		});
  	});
  	if(choices.length === 0){
  		console.log('You don\'t have any component. Bye.')
  		return;
  	}
    var prompts = [{
      type: 'list',
      name: 'deletename',
      message: 'delete which component?',
      choices: choices,
      default: choices[0].name
    }];
    return this.prompt(prompts).then(props => {
    	let compName = props.deletename;

    	let indexFilePath = 'src/components/index.js',
    		deleteKeyWord = compName+',',
    		deleteKeyWord2 = 'import '+compName+' from',
    		compPath = 'src/components/'+compName+'/',
    		examplePath = 'examples/components/'+compName+'/',
    		exampleIndexHtml = 'examples/index.html',
    		htmlDeleteKeyWord = 'examples/components/'+compName+'/index.html',
    		webpackConfigPath = 'conf/webpack.config.dev.js',
    		wpDeleteKeyWord = "'components', '"+compName+"', 'index.vue'";

    	logger.log('============ delete start =============')
    	utils.deleteFile(compPath);
    	utils.deleteFile(examplePath);
    	utils.deleteSome(indexFilePath, [deleteKeyWord, deleteKeyWord2]);
    	utils.deleteSome(exampleIndexHtml, [htmlDeleteKeyWord], true);
    	utils.deleteSome(webpackConfigPath, [wpDeleteKeyWord]);
    	logger.log('============ delete end =============');

    });
  }
});