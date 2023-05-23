var path = require('path');

module.exports = {
  // Multiple entries
  // @see https://github.com/webpack/docs/wiki/configuration#outputfilename
  entry: {
    general: path.resolve(__dirname, 'src/assets/js/general.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist/assets/js'),
    filename: '[name].bundle.js'
  },
  externals: {
    // jquery: "jQuery",
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: [path.resolve(__dirname, "src")],
        use: [
          "sass-loader",
        ],
      },
      {
        test: /^(?!.*\.es5\.js$).*\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  mode: 'production'
};
