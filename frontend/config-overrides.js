const rewireMobX = require('react-app-rewire-mobx');
const path = require('path');


module.exports = function override(config, env) {
    // Apply MobX rewire
    config = rewireMobX(config, env);

    // Modify Babel loader to include react-turnstile
    const babelLoader = config.module.rules.find(
        (rule) => rule.loader && rule.loader.includes('babel-loader')
    );

    if (babelLoader) {
        babelLoader.include = Array.isArray(babelLoader.include)
            ? [...babelLoader.include, path.resolve('node_modules/react-turnstile')]
            : [babelLoader.include, path.resolve('node_modules/react-turnstile')];
    }

    return config;
};
