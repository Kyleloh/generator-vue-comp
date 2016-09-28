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
      message: 'What is your component name?',
      default: 'name'
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;

      // example: name = demo-user
      this.props.componentName = s(this.props.name).underscored().slugify().value(); // => demo-user
      this.props.camelComponentName = s(this.props.componentName).camelize().value(); // => demoUser
      this.props.firstCapCamelComponentName = s(this.props.camelComponentName).capitalize().value(); // => DemoUser

      scrFolder = 'src/components/' + this.props.componentName;
      scrFolderPath = './' + scrFolder + '/';
      exampleFolder = 'examples/components/' + this.props.componentName;
      exampleFolderPath = './' + exampleFolder + '/';
    });

  },

  copyTemplates() {

    var done = this.async();

    glob(this.templatePath() + "/**/*.*", {}, (er, files) => {
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
          toFileName = toFileName.replace('_', this.props.componentName);
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

    var fullPath = 'src/components/index.js';
    utils.rewriteFile({
      fileRelativePath: fullPath,
      insertPrev: true,
      needle: "// Don't touch me - import",
      splicable: [
        `import ${this.props.camelComponentName} from './${this.props.componentName}/index.vue';`
      ]
    });
    utils.rewriteFile({
      fileRelativePath: fullPath,
      insertPrev: true,
      needle: "// Don't touch me - export",
      splicable: [
        `${this.props.camelComponentName},`
      ]
    });

    fullPath = 'examples/index.html';
    utils.rewriteFile({
      fileRelativePath: fullPath,
      insertPrev: true,
      needle: "<!-- Don't touch me - compopnents -->",
      splicable: [
        `<li>`,
        `  <a href="examples/components/${this.props.componentName}/index.html">${this.props.firstCapCamelComponentName} Example</a>`,
        `</li>`
      ]
    });

    fullPath = 'conf/webpack.config.dev.js';
    utils.rewriteFile({
      fileRelativePath: fullPath,
      insertPrev: true,
      needle: "// Don't touch me - components",
      splicable: [
        `'${this.props.componentName}': path.join(config.src, 'components', '${this.props.componentName}', 'index.vue'),`
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
