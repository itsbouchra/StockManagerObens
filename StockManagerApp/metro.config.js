const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    // On enlève 'flow' des extensions prises en compte
    sourceExts: defaultConfig.resolver.sourceExts.filter(ext => ext !== 'flow'),
  },
};

module.exports = mergeConfig(defaultConfig, config);
