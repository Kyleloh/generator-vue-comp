'use strict';

var _ = require('lodash');
var glob = require("glob");
var path = require('path');
var s = require('underscore.string');
var yeoman = require('yeoman-generator');

var logger = require('../app/logger');
var utils = require('../app/utils');

var scrFolderPath, scrFolder, exampleFolderPath, exampleFolder;

module.exports = yeoman.Base.extend({

  prompting() {

    var prompts = [{
      type: 'string',
      name: 'name',
      message: 'What is your directive name?',
      default: 'name'
    }, {
      type: 'list',
      name: 'version',
      message: 'What is your vue version?',
      choices: [{name: 'v1', value: 'v1'}, {name: 'v2', value: 'v2'}],
      default: 'v2'
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;

      // example: name = demo-user
      this.props.directiveName = s(this.props.name).underscored().slugify().value(); // => demo-user
      this.props.camelDirectiveName = s(this.props.directiveName).camelize().value(); // => demoUser
      this.props.firstCapCamelDirectiveName = s(this.props.camelDirectiveName).capitalize().value(); // => DemoUser

      scrFolder = 'src/directives/' + this.props.directiveName;
      scrFolderPath = './' + scrFolder + '/';
      exampleFolder = 'examples/directives/' + this.props.directiveName;
      exampleFolderPath = './' + exampleFolder + '/';
    });

  },

  copyTemplates() {

    var done = this.async();

    glob(this.templatePath() + '/' + this.props.version + "/**/*.*", {}, (er, files) => {
      _.each(files, filePath => {
        var toFileName = path.parse(filePath).base;

        if (toFileName === 'example.html') {
          toFileName = toFileName.replace('example', 'index');
          this.fs.copyTpl(
            filePath,
            path.resolve(exampleFolderPath, toFileName),
            this.props
          );
        } else {
          this.fs.copyTpl(
            filePath,
            path.resolve(scrFolderPath, toFileName),
            this.props
          );
        }

      });

      done();
    });

  },

  updateContent() {

    var fullPath = 'src/directives/index.js';
    utils.rewriteFile({
      fileRelativePath: fullPath,
      insertPrev: true,
      needle: "// Don't touch me - import",
      splicable: [
        `import './${this.props.directiveName}/index';`
      ]
    });

    fullPath = 'examples/index.html';
    utils.rewriteFile({
      fileRelativePath: fullPath,
      insertPrev: true,
      needle: "<!-- Don't touch me - directives -->",
      splicable: [
        `<li>`,
        `  <a href="examples/directives/${this.props.directiveName}/index.html">${this.props.firstCapCamelDirectiveName} Example</a>`,
        `</li>`
      ]
    });

    fullPath = 'conf/webpack.config.dev.js';
    utils.rewriteFile({
      fileRelativePath: fullPath,
      insertPrev: true,
      needle: "// Don't touch me - directives",
      splicable: [
        `'${this.props.directiveName}': path.join(config.src, 'directives', '${this.props.directiveName}', 'index.js'),`
      ]
    });

  },

  usageTip() {
    logger.log('=========================');
    logger.log('Congratulations, completed successfully!');
    logger.log("Gook Luck!");
    logger.log('=========================');
  }

});
