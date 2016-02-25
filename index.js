(function() {
    "use strict";

    var gulp = require('gulp'),
        util = require('gulp-util'),
        exec = require('child_process').exec,
        path = require('path'),
        _ = require('lodash'),
        through = require('through2'),
        buildCommand = require('./js/build-command'),
        fs = require('fs');

    function getExePath() {

        var relativeMsDeployPath = "IIS/Microsoft Web Deploy V3/msdeploy.exe";

        var path64 = process.env.ProgramFiles;
        var path32 = process.env["ProgramFiles(x86)"];

        if (path64 != null) {
            var msDeploy64Path = path.resolve(path.join(path64, relativeMsDeployPath));
            if (fs.existsSync(msDeploy64Path)) {
                util.log("Found 64-bit version of msdeploy");
                return msDeploy64Path;
            }
        }

        if (path32 != null) {
            var msDeploy32Path = path.resolve(path.join(path32, relativeMsDeployPath));
            if (fs.existsSync(msDeploy32Path)) {
                util.log("Found 32-bit version of msdeploy");
                return msDeploy64Path;
            }
        }

        throw new Error("MSDeploy doesn't seem to be installed. Could not find msdeploy in \"" + msDeploy64Path + "\" or \"" + msDeploy32Path + "\". You can install it from http://www.iis.net/downloads/microsoft/web-deploy")
    }

    function gulpMsDeploy(config) {
        // Merge task-specific and/or target-specific options with these defaults.
        var defaultOptions = {
            msdeployPath: getExePath()
        };
        var options = _.extend(defaultOptions, config);

        return through.obj(function (file, enc, cb) {
            if (!file || !file.path) {
                cb(null, file);
                return;
            }
            var fullCommand = '"' + options.msdeployPath + '"';
            if(options.sourceType == 'package') {
                options.source = options.source || {};
                options.source.package = file.path
            }
            if(options.sourceType == 'iisApp') {
                options.source = options.source || {};
                options.source.iisApp = file.path
            }
            delete options['sourceType'];
            //Build args
            //Loop through,
            //Assume all level 1 are arguments: "-arg:"
            //Assume all level 2 is parameters, can be a string, or multiple key value pairs

            delete options["msdeployPath"];

            fullCommand += buildCommand(options);

            util.log("Working...");
            return exec(fullCommand,{ maxBuffer: 2000*1024}, function (error, stdout, stderr) {
                util.log(stdout);
                if (error !== null) {
                    throw new Error(util.colors.red('msdeploy: ' + stderr));
                }
                cb();
            });
        });

    }

    module.exports = gulpMsDeploy;
})();