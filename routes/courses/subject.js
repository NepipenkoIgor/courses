/**
 * Created by igor on 7/4/14.
 */
var mongoose = require('mongoose');
var Courses = mongoose.model('Courses');
var Units = mongoose.model('Units');
var fs = require('fs');
var path = require('path');
var util = require('util');
var Stream = require('stream').Stream;

function router(app, isAdmin,hasUser) {
    app.post('/upload',isAdmin,function (req, res) {

        var old="public/"+req.body.oldImg;
      //  console.log(old);
        fs.unlink(old,function(err) {
            fs.createReadStream(req.files.fileimg.path)
                .pipe(fs.createWriteStream("public/img/" + req.files.fileimg.originalFilename))
                .on('finish', function () {
                    Courses.update({_id: req.body.courseId}, {img: "img/" + req.files.fileimg.originalFilename}, function (num) {
                        res.redirect("/#" + req.body.url)
                    })

                });
        });
    });
    app.post('/savecourseimg', function (req, res) {


    })
    //'use strict'
    app.get('/courses',hasUser, function (req, res) {

        Courses.find({}, function (err, data) {
            console.log(data);
            res.json(data);
        });

    });
    app.get('/units',hasUser, function (req, res) {

        Units.find({}, function (err, data) {
            console.log(data);
            res.json(data);
        });

    });

    app.post('/subjects',isAdmin, function (req, res) {

       // console.log("iam here", req.body[0]);


        updateCourse(req.body[0], req.body[1], function (err) {
            unitsRemove(req.body[3], function (err) {
                saveUnit(req.body[1], req.body[2], function (err, data) {
                    console.log(data);
                    updateUnit(data, function (err) {
                        res.json({success: true});
                    });
                });
            });
        });
        function updateCourse(action, course, cb) {

            if (!course._id) {
                var course = new Courses(course);
                course.save(function (err) {
                    if (err) {
                        return cb(err);
                    }
                    return cb(null);
                });
            } else {
                if (action.action === "deletecourse") {
                    Courses.remove({'_id': course._id}, function (err, data) {
                        if (err) {
                            return cb(err);
                        }
                        return cb(null);
                    });
                }
                var saveId = course._id;
                delete course._id;
                //var parent = [];
                Courses.update({'_id': saveId}, course, function (err) {
                    if (err) {
                        return cb(err);
                    }
                    return cb(null);
                });
            }

        };


        function unitsRemove(unitsId, cb) {
            if (unitsId !== null) {

                function remove(id) {
                    Units.remove({'_id': id}, function (err, data) {
                        if (err) {
                            return cb(err);
                        }

                        var next = unitsId.shift();

                        return next ? remove(next) : cb(null);

                    });
                }

                remove(unitsId.shift());
            } else {
                return cb();
            }

        }

        function saveUnit(course, units, cb) {

            var resMass = [];

            if (units.length === 0) {

                return cb(null, resMass);
            }
            function save(element) {

                if (!element._id) {
                    var unit = new Units(element);
                    unit.save(function (err, data) {
                        if (err) {
                            return cb(err)
                        }
                        var next = units.shift();
                        resMass.push(next);
                        return next ? save(next) : cb(null, resMass)
                    })
                } else {
                    var next = units.shift();
                    if (next !== undefined) {
                        resMass.push(next);
                    }

                    return next ? save(next) : cb(null, resMass);
                }
            }

            var el = units.shift();
            resMass.push(el);
            save(el);
        }

        function updateUnit(dataUnits, cb) {
            if (dataUnits.length === 0) {

                cb(null);
            }
            function update(element) {
                if (element !== undefined) {
                    var saveUnitId = element._id;
                    delete element._id;
                    Units.update({'_id': saveUnitId}, element, function (err, data) {
                        if (err) {
                            return cb(err);
                        }
                        var next = dataUnits.shift();

                        return next ? update(next) : cb(null);
                    });
                } else {
                    var next = dataUnits.shift();

                    return next ? update(next) : cb(null);
                }
            }

            update(dataUnits.shift());

        }

    });
}

module.exports = router;