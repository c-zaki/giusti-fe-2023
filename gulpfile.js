const glob = require("glob");
const path = require("path");
const fs = require("fs");
const { src, dest, watch, series } = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const del = require("del");
const nunjucksRender = require("gulp-nunjucks-render");
const sourcemaps = require("gulp-sourcemaps");
const mergeStream = require("merge-stream");
const imagemin = require("gulp-imagemin");
const webp = require('gulp-webp');
const newer = require("gulp-newer");
const postcss = require("gulp-postcss");
const chalk = require("chalk");
const formatterHtml = require("gulp-format-html");
const ftp = require("vinyl-ftp");
const sftp = require("gulp-sftp-up4");
const exec = require('gulp-exec');
const stdexec = require('child_process').exec;
const log = console.log;
const merge = require('deepmerge');

const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config.js");

const pathDist = "./dist";
const pathSrc = "./src";
const pathConfig = `${pathSrc}/config`;
const tmpPaths = {
  "tokensTmp" : "./.tmp_tokens",
  "stylesTmp" : "./.tmp_styles"
};

const config = require(`${pathConfig}/gulp.json`);
const assetsImagesExts = config.assets.images.exts.join("|");
const assetsImagesoptExts = config.assets.imagesopt.exts.join("|");
const assetsMiscExts = config.assets.misc.exts.join("|");
const assetsDeployExts = config.assets.deploy.exts.join("|");
const assetsFontpackExts = config.assets.fontpack.exts.join("|");
const assetsIconpackExts = config.assets.iconpack.exts.join("|");

// Node Sass will be used by default, but it's strongly recommended that you set it explicitly for
// forwards-compatibility in case the default ever changes.
// @see https://www.npmjs.com/package/gulp-sass
sass.compiler = require("node-sass");

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

function getCliParams(arr) {
  return arr.reduce(
    (prev, current) => {
      if (current.indexOf('--') === 0) {
        const param = current.split('=');
        return { ...prev, [param[0].slice(2)]: param[1] };
      }
    },
    {}
  );
}

function startServer(done) {
  log(chalk.red.bold("Starting BrowserSync ..."));

  let configBrowserSync = config.webserver;
  configBrowserSync = {
    ...{
      "server": pathDist
    }, ...configBrowserSync
  };

  browserSync.init(configBrowserSync);
  return done();
}

function transpileSCSS(done) {
  log(chalk.red.bold("Building SCSS ..."));

  return src(`${pathSrc}/assets/scss/**/*.{scss,sass}`)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: ["node_modules/"],
      }).on("error", sass.logError)
    )
    .pipe(postcss([require("autoprefixer")]))
    .pipe(sourcemaps.write())
    .pipe(dest(`${pathDist}/assets/css`))
    .pipe(browserSync.stream({ once: true }));
}

function cleanTemps(done){
  log(chalk.red.bold("Cleaning temp paths..."));
  Object.keys(tmpPaths).forEach( pathName  => {
    fs.rmSync(tmpPaths[pathName], { recursive: true });
  });
  return done();
}

function optimizeCSS() {
  log(chalk.red.bold("Optimizing CSS ..."));

  return src(`${pathDist}/assets/css/*.css`)
    .pipe(cleanCSS())
    .pipe(dest(`${pathDist}/assets/css`))
}

function transpileJS(done) {
  log(chalk.red.bold("Building JS ..."));

  return (
    src(`${pathSrc}/assets/js/**/*`)
      .pipe(webpackStream(webpackConfig, webpack))
      // @see https://stackoverflow.com/questions/53924907/webpack-watch-crashes-after-error-in-js-file
      .on("error", function handleError() {
        this.emit("end");
      })
      .pipe(dest(`${pathDist}/assets/js/`))
      .pipe(browserSync.stream({ once: true }))
  );
}

function compileHtml(done) {
  log(chalk.red.bold("Building HTML from nunjucks ..."));

  return src(`${pathSrc}/pages/**/*.+(njk|nunjucks)`)
    .pipe(
      nunjucksRender({
        path: [pathSrc, `!${pathSrc}/pages`],
        manageEnv: function (env) {
          
          // Filters

          env.addFilter('setAttribute', function (obj, key, value) {
            obj[key] = value;
            return obj;
          });

          env.addFilter('merge', function (obj1, obj2) {
            return merge(obj1, obj2);
          });

          env.addFilter('getIndexElement', function(obj, index){
            return Object.values(obj)[index];
          });

          env.addFilter('getRandomIndexElement', function(obj){
            var length = Object.values(obj).length;
            var randomElementIndex = Math.floor(Math.random() * length);
            return Object.values(obj)[randomElementIndex];
          });

          env.addFilter('randomString', function(obj, length = 8){
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
          });

          env.addFilter('overwriteMerge', function (obj1, obj2) {
            return merge(obj1, obj2, { arrayMerge: (destinationArray, sourceArray, options) => sourceArray });
          });

          env.addFilter('mergeArray', function (arr1, arr2) {
            if (Array.isArray(arr1) && Array.isArray(arr2)) {
              return [...arr1, ...arr2];
            }
            return [];
          });

          env.addFilter('getContext', function () {
            return this.ctx;
          });

          // JSONs detection and parse

          glob
            .sync(`${pathSrc}/**/*.json`, { ignore: `${pathSrc}/config/*` })
            .forEach((filepath) => {

              let globalVar;
              const name = path.parse(filepath).name;

              if (filepath.includes("/pages/")) {
                globalVar = "page_" + name;
              }if (filepath.includes("/templates/") ){
                globalVar = "tpl_" + name;
              } else if(filepath.includes("/ui/") ){
                globalVar = "ui_" + name;
              } else if (filepath.includes("/tokens/")) {
                globalVar = "token_" + name;
              } else if (filepath.includes("/components/")) {
                globalVar = "component_" + name;
              } else if (filepath.includes("/languages/")) {
                globalVar = "lang_" + name.split('.')[0];
              } else {
                globalVar = name;
              }

              env.addGlobal(
                globalVar.toLowerCase(),
                requireUncached(filepath)
              );

            });

          //Import zaux.config.js
          glob
            .sync(`./zaux.config.js`)
            .forEach((filepath) => {
              var name = path.parse(filepath).name;
              name = name.replace(/\./g, '_');
              env.addGlobal(
                name.toLowerCase(),
                requireUncached(filepath)
              );
            });

          try {
            const appLang = env.getGlobal('app').lang;

            if (appLang) {
              let objLangTarget;
              try {
                objLangTarget = env.getGlobal(`lang_${appLang}`);
              } catch (error) {
                console.error(`Warning: JSON language file doesn't exists.`);
              }
              if (objLangTarget) {
                env.addGlobal('lang', objLangTarget);
              }
            }
          } catch (error) {
            console.error(`Warning: Language is not specified (please check the 'lang' key in 'app.json').`);
          }

        },
      })
    )
    .pipe(dest(pathDist))
    .pipe(browserSync.stream({ once: true }));
}

/**
 * HTML formatter
 * @see https://github.com/ntnyq/gulp-plugins/tree/master/packages/gulp-format-html
 * @see https://github.com/beautify-web/js-beautify
 * @returns
 */
function formatHtml() {
  log(chalk.red.bold("Formatting HTML ..."));

  return src(`${pathDist}/**/*.html`)
    .pipe(
      formatterHtml({
        indent_size: 2,
        preserve_newlines: false,
        space_in_empty_paren: true,
      })
    )
    .pipe(dest(pathDist));
}

function optimizeHTML() {
  log(chalk.red.bold("Optimizing HTML ..."));

  return src(`${pathDist}/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(pathDist));
}

function processZauxConfig(done) {
  log(chalk.red.bold("Processing zaux.config.js..."));

  const zauxConfig = requireUncached("./zaux.config");
  
  /*-- TOKENS --*/

  //Check if Tmp folder for tokens exists
  if (!fs.existsSync(tmpPaths.tokensTmp)){
    fs.mkdirSync(tmpPaths.tokensTmp);
  }else{
    log(chalk.yellow.bold("Warning: zaux.config.js processing already started please wait or re-run"));
    return done();
  }

  var tokens = zauxConfig.tokens;

  Object.keys(tokens).forEach( tokenSetName => {
    fs.writeFileSync(`${tmpPaths.tokensTmp}/${tokenSetName}.json`, JSON.stringify(tokens[tokenSetName]));
  });

  //Read from the tmp Tokens folder

  var tokenFiles = fs.readdirSync( tmpPaths.tokensTmp );
  tokenFiles.forEach( filePath => {
    const filenameNoExt = path.parse(filePath).name;
    const prefix = "zaux-token";
    stdexec(`npx json-to-scss ${tmpPaths.tokensTmp}/${filePath} ${pathSrc}/assets/scss/tokens/_${filenameNoExt.toLowerCase()}.scss --p=$${prefix}-${filenameNoExt.toLowerCase()}: `);
  });
  
  setTimeout(() => {
    fs.rmSync(tmpPaths.tokensTmp, { recursive: true })
  }, tokenFiles.length * 1000);

  /*-- STYLES --*/

  if (!fs.existsSync(tmpPaths.stylesTmp)){
    fs.mkdirSync(tmpPaths.stylesTmp);
  }else{
    log(chalk.red.bold("Another task for processing Zaux Config is currently ongoing, please wait and if necessary re-run the task."));
    return done();
  }

  var styles = zauxConfig.styles;
  Object.keys(styles).forEach( styleName => {
    fs.writeFileSync(`${tmpPaths.stylesTmp}/${styleName}.json`, JSON.stringify(styles[styleName]));
  });

  var styleFiles = fs.readdirSync( tmpPaths.stylesTmp );
  styleFiles.forEach( filePath => {
    const filenameNoExt = path.parse(filePath).name;
    const prefix = "zaux-styles";
    stdexec(`npx json-to-scss ${tmpPaths.stylesTmp}/${filePath} ${pathSrc}/assets/scss/tokens/styles/_${filenameNoExt.toLowerCase()}.scss --p=$${prefix}-${filenameNoExt.toLowerCase()}: `);
  });
  setTimeout(() => {
    fs.rmSync(tmpPaths.stylesTmp, { recursive: true })
  }, styleFiles.length * 2000);

  return done();
}

function exportJsonToScss() {
  log(chalk.red.bold("Exporting JSONs to SCSS ..."));

  const options = {
    continueOnError: false,
    pipeStdout: false,
  };

  const reportOptions = {
    err: true,
    stderr: true,
    stdout: false
  };

  return src([`${pathSrc}/data/tokens/*.+(json)`])
    .pipe(exec(file => {
      const filenameNoExt = path.parse(file.history[0]).name;
      const prefix = "zaux-token";
      return `npx json-to-scss ${file.path} ${pathSrc}/assets/scss/tokens/_${filenameNoExt}.scss --p=$${prefix}-${filenameNoExt}: `;
    }, options))
    .pipe(exec.reporter(reportOptions));
}

function generateStyleVariables(done){
  log(chalk.red.bold("Generating style variables ..."));
  const options = {
    continueOnError: false,
    pipeStdout: false,
  };

  const reportOptions = {
    err: true,
    stderr: true,
    stdout: false
  };
  
  return src([`${pathSrc}/components/*/*.style.+(json)`])
  .pipe(exec(file => {
    const filenameNoExt = path.parse(file.history[0]).name;
    const tokenArrayName = filenameNoExt.replace(".style","");
    const prefix = "zaux";
    return `npx json-to-scss ${file.path} ${pathSrc}/assets/scss/components/tokens/_${filenameNoExt}.scss --p=$${prefix}-${tokenArrayName}-style-tokens: `;
  }, options))
  .pipe(exec.reporter(reportOptions));
  
  /*
  const componentsPath = `${pathSrc}/components`;
  const optionsPath = "_options";
  fs.readdirSync(componentsPath).forEach( dir => {
    if( fs.existsSync(`${componentsPath}/${dir}/${optionsPath}/style-variables.json`) ){
      //let options = JSON.parse(fs.readFileSync(`${componentsPath}/${dir}/${optionsPath}/style-variables.json`));
      var path = `${componentsPath}/${dir}/${optionsPath}/style-variables.json`;
      stdexec(`npx json-to-scss ${path} ${componentsPath}/${dir}/style-variables.scss --p=$zaux-style-vars:`);
    }
  });
  return done();
  */
}

function watchFiles(done) {
  watch(`${pathSrc}/components/*/**.+(style).+(json)`, (done) => {
    //series([generateStyleVariables, exportJsonToScss])(done);
    series([exportJsonToScss])(done);
  });
  watch([`${pathSrc}/**/**.+(njk|nunjucks|html|json)`], (done) => {
    series([compileHtml, formatHtml])(done);
  });
  watch(`${pathSrc}/data/tokens/*.json`, (done) => {
    series([processZauxConfig])(done);
  });
  watch([`${pathSrc}/**/*.scss`], transpileSCSS, optimizeCSS);
  watch([`${pathSrc}/**/*.js`], transpileJS);
  watch(`${pathSrc}/assets/img/**/*.+(${assetsImagesExts})`, optimizeAssetsImages);
  watch(`${pathSrc}/media/**/*.+(${assetsMiscExts})`, copySampleData);
  watch(`${pathSrc}/media/**/*.+(${assetsImagesExts})`, copySampleMedia);
  watch([`./zaux.config.js`], (done) => {
    series([processZauxConfig, compileHtml, formatHtml, transpileSCSS, optimizeCSS])(done);
  });
  // watch(`${pathSrc}/media/**/*.+(${assetsImagesoptExts})`, optimizeSampleImages);
  return done();
}

function watchPHP(done){
  watch([`${pathSrc}/components/**/*.php`], deployWordPress);
  return done();
}

function watchPHPSFTP(done){
  watch([`${pathSrc}/components/**/*.php`], deployWordPressSFTP);
  return done();
}

function optimizeAssetsImages(done) {
  log(chalk.red.bold("Optimizing assets images ..."));

  return src(`${pathSrc}/assets/img/**/*.+(${assetsImagesExts})`)
    .pipe(newer(`${pathDist}/assets/img/`))
    .pipe(imagemin())
    .pipe(dest(`${pathDist}/assets/img/`))
    .pipe(browserSync.stream({ once: true }));
}

function optimizeSampleImages(done) {
  log(chalk.red.bold("Optimizing sample images (webp) ..."));

  return src(`${pathSrc}/media/**/*.+(${assetsImagesoptExts})`)
    .pipe(newer(`${pathDist}/media/`))
    .pipe(imagemin())
    .pipe(webp())
    .pipe(dest(`${pathDist}/media`))
    .pipe(browserSync.stream({ once: true }));
}

function copySampleMedia(done) {
  log(chalk.red.bold("Copying sample media ..."));

  return src([
    `${pathSrc}/media/**/*.+(${assetsImagesExts})`,
  ]).pipe(dest(`${pathDist}/media`));
}

function copySampleData(done) {
  log(chalk.red.bold("Copying sample data ..."));

  return src([
    `${pathSrc}/media/**/*.+(${assetsMiscExts})`,
  ]).pipe(dest(`${pathDist}/media`));
}

function copyFont() {
  log(chalk.red.bold("Copying fonts ..."));
  return src([
    `${pathSrc}/assets/font/**/*.+(${assetsFontpackExts})`,
    `!${pathSrc}/assets/font/**/demo-files/*`,
  ])
    .pipe(dest(`${pathDist}/assets/fonts`))
    .pipe(browserSync.stream({ once: true }));
}

function copyJs() {
  log(chalk.red.bold("Copying JavaScript ..."));

  return mergeStream(
    // jQuery
    src(`node_modules/jquery/dist/**/*.+(js|map)`).pipe(
      dest(`${pathDist}/assets/vendor/jquery`)
    ),
    // svgxuse (polyfill)
    src(`node_modules/svgxuse/**/*.+(js)`).pipe(
      dest(`${pathDist}/assets/vendor/svgxuse`)
    ),
    // object-fit-images (polyfill)
    src(`node_modules/object-fit-images/**/*.+(js)`).pipe(
      dest(`${pathDist}/assets/vendor/ofi`)
    ),
    // IntersectionObserver(polyfill)
    src(`node_modules/intersection-observer/**/*.+(js)`).pipe(
      dest(`${pathDist}/assets/vendor/intersection-observer`)
    )
  );
}

function copyIcons() {
  log(chalk.red.bold("Copying icons ..."));
  return src([`${pathSrc}/assets/icon/**/*.+(${assetsIconpackExts})`])
    .pipe(dest(`${pathDist}/assets/icon`))
    .pipe(browserSync.stream({ once: true }));
}

function copyJsons() {
  log(chalk.red.bold("Copying JSONs ..."));
  return src([`${pathSrc}/**/*.+(json)`])
    .pipe(dest(`${pathDist}/json`))
    .pipe(browserSync.stream({ once: true }));
}

function cleanDist(done) {
  log(chalk.red.bold(`Cleaning "${pathDist}" folder ...`));
  del.sync(`${pathDist}`);
  return done();
}

function deployFtp(done) {
  /*
  Config JSON example:
  {
    "host": FTP_HOSTNAME,
    "user": FTP_USER,
    "pass": FTP_PASSWORD_BASE64,
    "parallel": 10,
    "remotePath": FTP_REMOTE_PATH
  }
  */
  //let config = require(getCliParams(process.argv).target);

  let config = {};
  if( fs.existsSync("deploy.ftp.json") ){
    config = JSON.parse(fs.readFileSync("deploy.ftp.json", "utf-8"));
  }else{
    log(chalk.red.bold(`Error: No deploy.ftp.json found`));
    return done();
  }

  log(chalk.red.bold(`Deploying via FTP ...`));
  config.log = console.log;
  let buff = new Buffer.from(config.pass, "base64");
  config.password = buff.toString("utf8");
  let conn = ftp.create(config);

  return src([`${pathDist}/**/*.+(${assetsDeployExts})`], { base: pathDist, buffer: false })
  .pipe(conn.newer(config.remotePath)) // Only newser files
  .pipe(conn.dest(config.remotePath));
}

function deployWordPress(done){
    /*
  Config JSON example:
  {
    "host": FTP_HOSTNAME,
    "user": FTP_USER,
    "pass": FTP_PASSWORD_BASE64,
    "parallel": 10,
    "remotePath": FTP_REMOTE_PATH
  }
  */
  //let config = require(getCliParams(process.argv).target);

  let config = {};
  if( fs.existsSync("wordpress.deploy.json") ){
    config = JSON.parse(fs.readFileSync("wordpress.deploy.json", "utf-8"));
  }else{
    log(chalk.red.bold(`Error: No wordpress.deploy.json found`));
    return done();
  }

  log(chalk.red.bold(`Deploying on Wordpress Installation ...`));
  config.log = console.log;
  let buff = new Buffer.from(config.pass, "base64");
  config.password = buff.toString("utf8");
  let conn = ftp.create(config);
  
  let assetsPath = `${pathDist}/assets/**/*.+(${assetsDeployExts})`;
  let mediaPath = `${pathDist}/media/**/*.+(${assetsDeployExts})`;
  let componentsPath = `${pathSrc}/components/**/*.php`;
  let subComponentsPath = `${pathSrc}/components/**/**/*.php`;
  let dataPath = `${pathSrc}/data/**/*.json`;

  log(`Deploying assets...`);
  src([`${assetsPath}`], { base: pathDist, buffer: false })
  .pipe(conn.newer(config.remotePath)) // Only newser files
  .pipe(conn.dest(config.remotePath));
  log(chalk.green.bold("ASSETS DEPLOYED"));

  log(`Deploying Media...`);
  src([`${mediaPath}`], { base: pathDist, buffer: false })
  .pipe(conn.newer(config.remotePath)) // Only newser files
  .pipe(conn.dest(config.remotePath));
  log(chalk.green.bold("MEDIA DEPLOYED"));

  log(`Deploying components...`);
  src([`${componentsPath}`], { base: pathSrc, buffer: false })
  .pipe(conn.newer(config.remoteThemePath)) // Only newser files
  .pipe(conn.dest(config.remoteThemePath));
  log(chalk.green.bold("COMPONENTS DEPLOYED"));


  log(`Deploying Data...`);
  src([`${dataPath}`], { base: pathSrc, buffer: false })
  .pipe(conn.newer(config.remotePath)) // Only newser files
  .pipe(conn.dest(config.remotePath));
  log(chalk.green.bold("DATA DEPLOYED"));

  return done();
}

function deployWordPressSFTP(done){
    /*
  Config JSON example:
  {
    "host": FTP_HOSTNAME,
    "user": FTP_USER,
    "pass": FTP_PASSWORD_BASE64,
    "parallel": 10,
    "remotePath": FTP_REMOTE_PATH
  }
  */
  //let config = require(getCliParams(process.argv).target);

  let config = {};
  if( fs.existsSync("wordpress.deploy.sftp.json") ){
    config = JSON.parse(fs.readFileSync("wordpress.deploy.sftp.json", "utf-8"));
  }else{
    log(chalk.red.bold(`Error: No wordpress.deploy.sftp.json found`));
    return done();
  }

  log(chalk.red.bold(`Deploying on Wordpress Installation via SFTP ...`));
  config.log = console.log;
  let buff = new Buffer.from(config.pass, "base64");
  config.password = buff.toString("utf8");
  let conn = ftp.create(config);
  
  let assetsPath = `${pathDist}/assets/**/*.+(${assetsDeployExts})`;
  let mediaPath = `${pathDist}/media/**/*.+(${assetsDeployExts})`;
  let componentsPath = `${pathSrc}/components/**/*.php`;
  //let subComponentsPath = `${pathSrc}/components/**/**/*.php`;
  let dataPath = `${pathSrc}/data/**/*.json`;

  //_fe path configuration
  let configFePath = config;
  
  //Theme path configuration
  let configThemePath = config;
  configThemePath.remotePath = config.remoteThemePath;

  log(`Deploying assets...`);
  src([`${assetsPath}`], { base: pathDist, buffer: false })
  //.pipe(conn.newer(config.remotePath)) // Only newser files
  //.pipe(conn.dest(config.remotePath));
  .pipe(sftp(configFePath));
  log(chalk.green.bold("ASSETS DEPLOYED"));

  log(`Deploying Media...`);
  src([`${mediaPath}`], { base: pathDist, buffer: false })
  //.pipe(conn.newer(config.remotePath)) // Only newser files
  //.pipe(conn.dest(config.remotePath));
  .pipe(sftp(configFePath));
  log(chalk.green.bold("MEDIA DEPLOYED"));

  log(`Deploying components...`);
  src([`${componentsPath}`], { base: pathSrc, buffer: false })
  //.pipe(conn.newer(config.remoteThemePath)) // Only newser files
  //.pipe(conn.dest(config.remoteThemePath));
  .pipe(sftp(configThemePath));
  log(chalk.green.bold("COMPONENTS DEPLOYED"));


  log(`Deploying Data...`);
  src([`${dataPath}`], { base: pathSrc, buffer: false })
  //.pipe(conn.newer(config.remotePath)) // Only newser files
  //.pipe(conn.dest(config.remotePath));
  .pipe(sftp(configFePath));
  log(chalk.green.bold("DATA DEPLOYED"));

  return done();
}

function deploySftp(done) {
  /*
  Config JSON example:
  {
    "host": FTP_HOSTNAME,
    "user": FTP_USER,
    "pass": FTP_PASSWORD_BASE64,
    "remotePath": FTP_REMOTE_PATH
  }
  */
  //let config = require(getCliParams(process.argv).target);

  let config = {};
  if( fs.existsSync("deploy.sftp.json") ){
    config = JSON.parse(fs.readFileSync("deploy.sftp.json", "utf-8"));
  }else{
    log(chalk.red.bold(`Error: No deploy.ftp.json found`));
    return done();
  }

  log(chalk.red.bold(`Deploying via SFTP ...`));
  config.log = console.log;
  let buff = new Buffer.from(config.pass, "base64");
  config.pass = buff.toString("utf8");

  return src(`${pathDist}/**/*.+(${assetsDeployExts})`).pipe(sftp(config));
}

//Purges all php files
function purgePHPFiles() {
  return del([`${pathSrc}/components/**/*.php`]);
}

exports.clean = cleanDist;

exports.copyjsons = copyJsons;

exports.assets = series(
  cleanDist,
  copyFont,
  copyIcons,
  optimizeAssetsImages,
  copySampleMedia,
  // optimizeSampleImages,
  copySampleData,
  copyJsons,
  copyJs
);

exports.bundle = series(
  exportJsonToScss,
  transpileSCSS,
  transpileJS
);

exports.compile = series(
  exports.bundle,
  compileHtml
);

exports.build = series(exports.assets, exports.compile, formatHtml, processZauxConfig);
exports.dev = series(exports.build, startServer, watchFiles, optimizeCSS);
exports.opt = series(exports.assets, exports.compile, optimizeCSS, optimizeHTML);
exports.stylevariables = generateStyleVariables;
exports.loadzauxconfig = processZauxConfig;
exports.deployftp = deployFtp;
exports.deploysftp = deploySftp;
exports.deploywp = deployWordPress;
exports.deploywpsftp = deployWordPressSFTP;
exports.deploywpwatch = watchPHP;
exports.deploysshwpwatch = watchPHPSFTP;
exports.purgephpfiles = purgePHPFiles;
