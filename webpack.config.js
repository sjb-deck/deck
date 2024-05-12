/** @format */

const path = require('path');

const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;

module.exports = {
  entry: {
    login: ['./deck/src/js/login.js'],
    inventoryBase: ['./inventory/src/globals/styles/inventoryBase.scss'],
    inventoryIndex: ['./inventory/src/pages/render/inventoryIndex.js'],
    itemIndex: ['./inventory/src/pages/render/itemIndex.js'],
    cartIndex: ['./inventory/src/pages/render/cartIndex.js'],
    adminIndex: ['./inventory/src/pages/render/adminIndex.js'],
    addItem: ['./inventory/src/pages/render/addItem.js'],
    loanReturn: ['./inventory/src/pages/render/loanReturn.js'],
    orderReceipt: ['./inventory/src/pages/render/orderReceipt.js'],
    itemList: ['./inventory/src/pages/render/itemList.js'],
    kitIndex: ['./inventory/src/pages/render/kitIndex.js'],
    kitInfo: ['./inventory/src/pages/render/kitInfo.js'],
    kitLoanReturn: ['./inventory/src/pages/render/kitLoanReturn.js'],
    createBlueprint: ['./inventory/src/pages/render/createBlueprint.js'],
    kitRestock: ['./inventory/src/pages/render/kitRestock.js'],
    alerts: ['./inventory/src/pages/render/alerts.js'],
    kitCart: ['./inventory/src/pages/render/kitCart.js'],
    kitAdd: ['./inventory/src/pages/render/kitAdd.js'],
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
