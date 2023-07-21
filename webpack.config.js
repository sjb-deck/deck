/** @format */

const path = require('path');

const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;

module.exports = {
  entry: {
    login: ['./deck/src/js/login.js', './deck/src/scss/login.scss'],
    inventoryBase: ['./inventory/src/scss/inventoryBase.scss'],
    itemIndex: ['./inventory/src/js/itemIndex.js'],
    cartIndex: ['./inventory/src/js/cartIndex.js'],
    adminIndex: ['./inventory/src/js/adminIndex.js'],
    addItem: ['./inventory/src/js/addItem.js'],
    loanReturn: ['./inventory/src/js/loanReturn.js'],
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
