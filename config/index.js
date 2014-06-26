/**
 * Created by Игорь on 17.06.2014.
 */

function config(app) {

    require('./express')(app);
    require('./config')(app);

}

module.exports = config;