module.exports = {
    extends: 'airbnb-base',
    env: {
        jest: true,
    },
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
    },
    plugins: ['jest'],
};
