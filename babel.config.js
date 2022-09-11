module.exports = {
    presets: [
        ['module:metro-react-native-babel-preset', { useTransformReactJSXExperimental: true }],
    ],
    plugins: [
        [
            '@babel/plugin-transform-react-jsx',
            {
                runtime: 'automatic',
            },
        ],
        [
            'module-resolver',
            {
                alias: {
                    '@insureme': './src',
                },
            },
        ],
    ],
    // reduce bundle size
    env: {
        production: {
            plugins: ['react-native-paper/babel'],
        },
    },
};