'use strict';

var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');
var extend = require('deep-extend');
var s = require('underscore.string');
var yeoman = require('yeoman-generator');

var logger = require('./logger');
var utils = require('./utils');


// Global Variables
var folder, folderPath;

module.exports = yeoman.Base.extend({

  /**
   * 检查git是否安装
   */
  checkForGit() {
    return utils.exec('git --version');
  },

  /**
   * 打印欢迎信息
   */
  welcomeMessage() {
    logger.log(yosay(
      'Welcome to the ' + chalk.red('generator-vue-comp') + ' generator!'
    ));
  },

  /**
   * 询问项目的所在目录名
   */
  promptForFolder() {
    var prompt = {
      name   : 'folder',
      message: 'In which folder would you like the project to be generated? ',
      default: 'generator-vue-comp'
    };

    return this.prompt(prompt).then(props => {
      folder = props.folder;
      folderPath = './' + folder + '/';
    });
  },

  /**
   * Clone seed project
   */
  cloneRepo() {
    logger.green('Cloning the remote seed repo.......');
    if (this.props.version === 'v2') {
      return utils.exec('git clone https://github.com/danielxiaowxx/vue2-component-seed.git --branch master --single-branch ' + folder);
    } else {
      return utils.exec('git clone https://github.com/danielxiaowxx/vue-component-seed.git --branch master --single-branch ' + folder);
    }

  },

  /**
   * 删除clone下来的种子项目的git远程信息
   */
  rmGitRemote() {
    return utils.exec('cd ' + folder + ' && git remote remove origin');
  },

  /**
   * 询问项目的基本信息
   */
  getPrompts() {

    var prompts = [{
      name   : 'appName',
      message: 'What would you like to call your application?',
      default: folder
    }, {
      name   : 'appDescription',
      message: 'How would you describe your application?',
      default: 'Component project with Vue'
    }, {
      name   : 'appKeywords',
      message: 'How would you describe your application in comma seperated key words?',
      default: 'component,vue'
    }, {
      name   : 'appAuthor',
      message: 'What is your company/author name?'
    }, {
      type: 'list',
      name: 'version',
      message: 'What is your vue version?',
      choices: [{name: 'v1', value: 'v1'}, {name: 'v2', value: 'v2'}],
      default: 'v2'
    }];

    return this.prompt(prompts).then(props => {
      this.appName = props.appName;
      this.appDescription = props.appDescription;
      this.appKeywords = props.appKeywords;
      this.appAuthor = props.appAuthor;

      this.slugifiedAppName = s(this.appName).underscored().slugify().value();
      this.humanizedAppName = s(this.appName).humanize().value();
      this.camelAppName = s(this.slugifiedAppName).camelize().value();
      this.firstCapCamelAppName = s(this.camelAppName).capitalize().value();
      this.capitalizedAppAuthor = s(this.appAuthor).capitalize().value();
    });
  },

  /**
   * 更新package.json数据
   */
  updatePackage() {
    var pkg = this.fs.readJSON(this.destinationPath(folder + '/package.json'), {});
    extend(pkg, {
      name: this.appName,
      description: this.appDescription,
      author: this.appAuthor,
      keywords: this.appKeywords.split(',')
    });
    this.fs.writeJSON(this.destinationPath(folder + '/package.json'), pkg);
  },

  /**
   * 更新文本内容
   */
  updateContent() {
    var readme = this.fs.read(this.destinationPath(folder + '/README.md'));
    readme = readme.replace(/vue component seed/g, this.slugifiedAppName.replace(/\-/g, ' '))
                    .replace(/vue\-component\-seed/g, this.slugifiedAppName)
                    .replace(/VueComponentSeed/g, this.firstCapCamelAppName);
    console.log(readme);
    this.fs.write(this.destinationPath(folder + '/README.md'), readme);
  },

  /**
   * 安装依赖module
   */
  installing() {
    logger.green('Running npm install for you....');
    logger.green('This may take a couple minutes.');

    utils.exec('cd ' + folder).then(() => {
      this.installDependencies({
        bower: false,
        npm: true,
        callback: function () {
          logger.log('');
          logger.green('------------------------------------------');
          logger.green('Your application project is ready!');
          logger.log('');
          logger.green('To Get Started, run the following command:');
          logger.log('');
          logger.yellow('cd ' + folder + ' && npm run dev');
          logger.log('');
          logger.green('Happy Hacking!');
          logger.green('------------------------------------------');
        }
      });
    });
  }
});
