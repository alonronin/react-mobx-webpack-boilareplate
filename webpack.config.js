const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = module.exports = {
  entry: {
    'change-state': './change-state',
    'side-effect': './side-effect',
    'simple-app': './simple-app',
    'form-validation': './form-validation',
    vendors: Object.keys(pkg.dependencies)
  },

  output: {
    path: path.resolve('./dist'),
    filename: 'js/[name].js'
  },

  context: path.resolve(__dirname, 'src'),

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [
            'react',
            'es2015',
            'stage-1'
          ],
          plugins: [
            'transform-decorators-legacy',
            'transform-class-properties'
          ]
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ],

    noParse: []
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: Infinity
    }),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
};

if(process.env.NODE_ENV !== 'production') {
  config.module.loaders[0].query.presets.push('react-hmre');
}

const apps = Object.keys(config.entry).filter(key => key !== 'vendors');

const plugins = apps.map(function(app){
  return new HtmlWebpackPlugin({
    title: app,
    chunks: ['vendors', app],
    filename: `${app}.html`
  })
});

plugins.push(new HtmlWebpackPlugin({
  title: 'MobX-React-Webpack boilerplate',
  chunks: [],
  apps: apps,
  template: './index.ejs',
  filename: 'index.html'
}));

config.plugins.push(...plugins);
