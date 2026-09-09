const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support additional source extensions
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'mjs',
  'cjs',
];

// Ensure correct transformer settings for Hermes
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

module.exports = config;
