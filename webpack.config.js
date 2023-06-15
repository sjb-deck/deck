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
    // create an entry point for webpack to compile ur react code
    // remember to restart webpack after adding new entry points
    itemList: ['./inventory/src/js/itemList.js'],
  },
  output: {
    path: path.resolve(__dirname, './static/webpack'),
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
        test: /\.(scss|css)$/i,
        // exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [new StatoscopeWebpackPlugin()],
};
