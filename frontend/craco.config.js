module.exports = {
    babel: {
        loaderOptions: (babelLoaderOptions) => {
            babelLoaderOptions.presets = [
                ['@babel/preset-env', { targets: '> 0.25%, not dead, IE 11' }],
                '@babel/preset-react',
            ];
            babelLoaderOptions.plugins = [
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
            ];
            return babelLoaderOptions;
        },
    },
};
