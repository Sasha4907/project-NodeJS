module.exports = {
    env: {
        browser: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'react-app', 
        'react-app/jest',
        'airbnb/base',
        'plugin:sonarjs/recommended',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
        'sonar',
        'sonarjs',
    ],
    rules: {
        semi: 'off',
        'no-console': 'off',
        'no-unused-vars': 'off',
        'consistent-return': 'off',
        'no-underscore-dangle': 'off',
        'no-plusplus': 'off',
        'max-len': ['error', 200, { ignoreUrls: true }],
        'no-use-before-define': 'off',
        'linebreak-style': 'off',
        'no-trailing-spaces': 'off',
        'padded-blocks': 'off',
        indent: 'off',
        'no-unused-expressions': 'off',
        'no-undef': 'off',
        'arrow-parens': 'off',
    },
}
