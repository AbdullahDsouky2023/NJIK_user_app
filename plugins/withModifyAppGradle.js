const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = (config) => {
  const newAppBuildGradle = `implementation 'com.facebook.react:react-native:0.70.0!!'`;
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents += newAppBuildGradle;
    return config;
  });
};
