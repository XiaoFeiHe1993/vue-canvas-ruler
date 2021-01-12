module.exports = {
  stories: ['../.storybook/stories/**/*.stories.js'],
  logLevel: 'debug',
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-storysource',
    '@storybook/addon-viewport',
    '@storybook/addon-links',
    'storybook-mobile',
    '@storybook/preset-scss',
    'storybook-addon-designs',
    '@storybook/addon-notes/register',
    '@storybook/addon-cssresources',
  ],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader'],
    });

    return config;
  }
};
