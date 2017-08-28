const path = require('path');
const webpack = require('webpack');

module.exports = {
  // devtool: 'eval',
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /(node_modules|bower_components)/,
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
            },
          }
        ],
      },
    ]
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    /*new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),*/
    /*new webpack.optimize.UglifyJsPlugin({
      // compress production
      compress: true,
    })*/
  ],
};
