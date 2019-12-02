// @nrwl/react + SVG
const babelWebpackConfig = require('@nrwl/react/plugins/babel');

module.exports = config => {
  config.module.rules.push(
    {
      test: /\.svg$/,
      use: [
        '@svgr/webpack',
        'url-loader'
      ]
    }
  );
  return babelWebpackConfig(config);
};