/**
 * Created by igor on 7/4/14.
 */
var mongoose = require('mongoose');
var Subjects = mongoose.model('Subject');

function router(app) {
    //'use strict'
    app.get('/subject', function (req, res) {

        Subjects.find({}, function (err, data) {
            console.log(data);
            res.json(data);
        });

    });


};
module.exports = router;