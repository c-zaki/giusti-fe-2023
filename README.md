<p align="left">
<img width="256" src="applogo.png"/>
</p>

## Features

- Webpack 5
- Gulp 4
- BrowserSync
- Sass (node-sass)
- JavaScript (ES6) with Babel
- Nunjucks (templating language)

## Third-party libraries included

- Bootstrap 5.1.3
- jQuery 3.6.0 (not used)
- Swiper 7.0.8
- Lazysizes 5.3.0

## Requirements

- NodeJs 14.16.0, consider using NVM if possible.

## Installation and setup

1. Install NodeJs 14.16.0 via NVM (`nvm install`).
   - MacOS / Linux: https://github.com/nvm-sh/nvm#installing-and-updating
   - Microsoft Windows:
     https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows
2. Select the correct NodeJs version (`nvm use 14.16.0`).
3. Install all the dependencies (`npm install`).
4. Optional: Place the projects assets (images and more) in the relative folders:
   - `src/assets/font`
   - `src/assets/icon`
   - `src/assets/img`
   - `src/media` (this used for fake/sample images or other media)

## Usage

1. Be sure to use the correct NodeJs version (`nvm use 14.16.0`).
2. Start web server and the task pipeline running `npm run dev` in CLI, when everything will be done a web browser will open.
3. Begin to work and edit files, the browser will reload after changes and the `dist` folder will be populated.


## CLI commands

#### Starts a web server on localhost and watches for files changes with live reload.

`npm run dev` 
#### Deploys files to a specific remote host (via SFTP)

`npm run deploysftp -- --target="../TARGET_REMOTE_HOST.deploy.json"`

#### Deploys files to a specific remote host (via FTP)

`npm run deployftp -- --target="../TARGET_REMOTE_HOST.deploy.json"`

## Web server

- Browserable files: http://localhost:9000
- Web server admin UI: http://localhost:9001

## Suggestions

### Customize global sass variables

Take a look in `src/assets/scss/abstracts/_variables.scss` to define and override sass variables.

### Customize Bootstrap 5 inclusions

Everything is enabled in `src/assets/scss/vendor/_bootstrap.scss`, feel free to comment some inclusions in order to use only some functionalities of the framework.

## Resources

- BEM (Block-Element-Modifier) naming convention for CSS classes: http://getbem.com/introduction/
- Nunjucks templating language: http://mozilla.github.io/nunjucks/templating.html
- Gulp task runner: https://gulpjs.com/

## Credits

Zaki - Creative Digital Agency (zaki.it)
