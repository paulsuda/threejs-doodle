const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  // template: './src/index.html',
  filename: 'index.html',
  inject: 'body',
  template: './src/index.html',
});

const config = {
  entry: path.join(__dirname, 'index.js'),
  plugins: [HtmlWebpackPluginConfig],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
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
