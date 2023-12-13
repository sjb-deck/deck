/** @format */

const path = require('path');

const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;

module.exports = {
  entry: {
    login: ['./deck/src/js/login.js', './deck/src/scss/login.scss'],
    inventoryBase: ['./inventory/src/globals/styles/inventoryBase.scss'],
    itemIndex: ['./inventory/src/pages/render/itemIndex.js'],
    cartIndex: ['./inventory/src/pages/render/cartIndex.js'],
    adminIndex: ['./inventory/src/pages/render/adminIndex.js'],
    addItem: ['./inventory/src/pages/render/addItem.js'],
    loanReturn: ['./inventory/src/pages/render/loanReturn.js'],
    orderReceipt: ['./inventory/src/pages/render/orderReceipt.js'],
    itemList: ['./inventory/src/pages/render/itemList.js'],
    kitInfo: ['./inventory/src/pages/render/kitInfo.js'],
    createBlueprint: ['./inventory/src/pages/render/createBlueprint.js'],
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
