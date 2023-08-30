const { defineConfig } = require('cypress');

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:1337',
    },
});
