const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  filename: 'index.html',
  inject: 'body',
  template: './src/index.html',
});

const config = {
  entry: path.join(__dirname, 'index.js'),
  plugins: [
    HtmlWebpackPluginConfig
  ],
  context: __dirname,
  node: {
    __filename: true
  },
  output: {
    filename: 'script.js',
    path: path.join(__dirname, 'docs'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'docs'),
    compress: true,
    port: 9000,
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.glsl$/,
        use: [
          { loader: 'raw-loader' },
        ],
      },
    ],
  },
};

module.exports = config;
