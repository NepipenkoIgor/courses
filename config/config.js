var _ = require('underscore');

module.exports = function (app) {
    'use strict';

    var config = {
        HOSTNAME: process.env.HOSTNAME,
        PORT: process.env.PORT,

        NODE_ENV: process.env.NODE_ENV,
        LOG_LEVEL: process.env.LOG_LEVEL,

        MONGODB_URL: process.env.MONGODB_URL,
        SESSION_SECRET: process.env.SESSION_SECRET,

        SOCKET_IO_LOG_LEVEL: process.env.SOCKET_IO_LOG_LEVEL,

        GOOGLE_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,

        FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
        FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
        FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,

        TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
        TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
        TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL
    };

    var env = process.env.NODE_ENV || 'local';
    var defaults = require('./' + env + '.env');
    _.defaults(config, defaults);

    app.set('config', config);
};