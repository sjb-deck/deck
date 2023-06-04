/** @format */

const path = require('path');

const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;

module.exports = {
  entry: {
    login: ['./deck/src/js/login.js', './deck/src/scss/login.scss'],
    inventoryBase: ['./inventory/src/scss/inventoryBase.scss'],
    itemIndex: [
      './inventory/src/js/itemIndex.js',
      './inventory/src/scss/itemIndex.scss',
    ],
  },
  output: {
    path: path.resolve(__dirname, './static/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [new StatoscopeWebpackPlugin()],
};
