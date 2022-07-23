module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "react-app", 
        "react-app/jest",
        "airbnb/base",
        "plugin:sonarjs/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "sonar",
        "sonarjs"
    ],
    "rules": {
        "semi": "error",
        "no-console": "off",
        "no-unused-vars": "off",
        "consistent-return":"off",
        "no-underscore-dangle": "off",
        "no-plusplus": "off",
        "max-len": ["error", 200, {"ignoreUrls": true}],
        "sonarjs/cognitive-complexity": "error",
        "sonarjs/no-identical-expressions": "error",
        "sonarjs/no-duplicate-string": "off",
        "no-use-before-define": "off"
    }
}
