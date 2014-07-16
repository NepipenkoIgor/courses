/**
 * Created by igor on 7/4/14.
 */
var mongoose = require('mongoose');
var Courses = mongoose.model('Courses');
var Units = mongoose.model('Units');

function router(app) {
    //'use strict'
    app.get('/courses', function (req, res) {

        Courses.find({}, function (err, data) {
            console.log(data);
            res.json(data);
        });

    });
    app.get('/units', function (req, res) {

        Units.find({}, function (err, data) {
            console.log(data);
            res.json(data);
        });

    });

    app.post('/subjects', function (req, res) {

        console.log("iam here", req.body[0]);
        /*   if(req.body.action==='delete'){
         Subjects.remove({'_id':req.body.id},function(err,data){
         var moduleId=[];
         if(req.body.module.length>0){
         for (var i = 0; i < req.body.module.length; i++) {
         if (moduleId.indexOf(req.body.module[i].parent) === (-1)) {
         moduleId.push(req.body.module[i].parent);
         ModuleLesson.remove({parent: req.body.module[i].parent}, function (err) {
         res.json({success: true});
         });
         };
         };
         }else{
         res.json({success: true});
         }
         });
         }else {

         if (!req.body[0]._id) {
         console.log("kuku",req.body[0]._id)
         var subj = new Subjects(req.body[0]);
         subj.save(function (,$scope.resModuleLessonArrayerr, number) {
         console.log(err, number);
         ModuleLesson.create(req.body[1], function (err, number) {
         console.log(err, number);
         res.json({success: true, data: {id: subj._id}});
         });
         });

         } else {
         console.log("iam here",req.body)
         var saveId = req.body[0]._id;
         delete req.body[0]._id;
         Subjects.update({'_id': saveId}, req.body[0], function (err, data) {
         var moduleId = [];
         for (var i = 0; i < req.body[1].length; i++) {
         if (moduleId.indexOf(req.body[1][i].parent) === (-1)) {
         moduleId.push(req.body[1][i].parent);
         ModuleLesson.remove({parent: req.body[1][i].parent}, function (err) {

         });
         }
         }
         ;
         ModuleLesson.create(req.body[1], function (err, number) {
         console.log(err, number);
         res.json({success: true});
         });
         });
         }
         ;
         };*/

        /*removeModules(req.body[0],function() {
         addModules();
         })

         function removeModules(subject, cb) {
         db.insert({}, function() {
         cb(err);
         })
         }*/

        updateCourse(req.body[1], function (err) {
            unitsRemove(req.body[3], function (err) {
                saveUnit(req.body[1], req.body[2], function (err,data) {
                    console.log(data);
                    updateUnit(data, function (err) {
                        res.json({success: true});
                    })
                })
            })
        })
        function updateCourse(course, cb) {
            var saveId = course._id;
            delete course._id;
            //var parent = [];
            Courses.update({'_id': saveId}, course, function (err) {
                if(err) {
                    return cb(err);
                }
                return cb(null);
            });
        };


        function unitsRemove(unitsId, cb) {
            if (unitsId !== null) {

                function remove(id) {
                    Units.remove({'_id': id}, function (err, data) {
                        if(err) {
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
      /*      var parent = [];
            for (var i = 0; i < course.modules.length; i++) {
                for (var j = 0; j < course.modules[i].sections.length; j++) {
                    var idSpecial = course.modules[i].sections[j].specialId;
                    if (parent.indexOf(idSpecial) === (-1)) {
                        parent.push(course.modules[i].sections[j].specialId);
                    }
                }
            }*/
            var resMass=[];
            function save(element) {
               // if (parent.indexOf(element.parent) !== (-1)) {
                   // console.log("find id=", units._id);

                    if (!element._id) {
                        var unit = new Units(element);
                        unit.save(function (err, data) {
                         if(err){
                             return cb(err)
                         }
                            var next=units.shift();
                            resMass.push(next);
                            return next ? save(next):cb(null,resMass)
                        })
                    }else {
                    var next = units.shift();
                        if(next!==undefined){
                            resMass.push(next);
                        }

                    return next ? save(next) : cb(null,resMass);
                }
            }
            var el=units.shift();
            resMass.push(el);
            save(el);
        }

        function updateUnit(dataUnits, cb) {

            function update(element) {
                if (element!==undefined) {
                    var saveUnitId = element._id;
                    delete element._id;
                    Units.update({'_id': saveUnitId},element, function (err, data) {
                        if(err) {
                            return cb(err);
                        }
                        var next = dataUnits.shift();

                        return next ? update(next) : cb(null);
                    });
                }else {
                    var next = dataUnits.shift();

                    return next ? update(next) : cb(null);
                }
            }
            update(dataUnits.shift());

        }


        /* if (req.body[0].action === 'edit') {
         console.log('edit');
         var saveId = req.body[1]._id;
         delete req.body[1]._id;
         var parent = [];
         for (var i = 0; i < req.body[1].modules.length; i++) {
         for (var j = 0; j < req.body[1].modules[i].sections.length; j++) {
         var idSpecial = req.body[1].modules[i].sections[j].specialId;
         if (parent.indexOf(idSpecial) === (-1)) {
         parent.push(req.body[1].modules[i].sections[j].specialId);
         }
         }
         }
         console.log(parent)
         Courses.update({'_id': saveId}, req.body[1], function (err, data) {
         res.json({success: true});
         var unit = []
         for (var i = 0; i < req.body[2].length; i++) {
         if (req.body[3] !== null) {
         for (var i = 0; i < req.body[3].length; i++) {
         Units.remove({'_id': req.body[3][i]}, function (err, data) {
         //res.json({success: true});
         });
         }
         }
         if (parent.indexOf(req.body[2][i].parent) !== (-1)) {
         console.log("find id=", req.body[2][i]._id);
         if (req.body[2][i]._id === undefined) {
         var unit = new Units(req.body[2][i]);
         unit.save(function (err, data) {
         console.log("find data=", data);
         // res.json({success: true});
         })
         }
         if (req.body[2][i]._id !== null) {
         var saveUnitId = req.body[2][i]._id;
         delete req.body[2][i]._id;

         Units.update({'_id': saveUnitId}, req.body[2][i], function (err, data) {
         // res.json({success: true});
         });
         }
         }
         }

         res.json({success: true});
         });
         }*/
    });
}

module.exports = router;