var msdeploy = require('./index.js');
var buildCommand = require('./js/build-command.js');

module.exports = {
    'Build command level 1 args ' : function(test) {
        var options = {
            verb: 'sync'
        };
        test.expect(2);
        var msdeployCommandLine = buildCommand(options);
        test.ok(typeof msdeployCommandLine === 'string', 'Command returned a string');
        test.ok(msdeployCommandLine.indexOf('-verb:sync') != -1,'Verb sync found');
        test.done();
    },
    'Build command level 2 args': function (test) {
        var options = {
            verb: 'sync',
            source: {
                iisApp: 'foo'
            },
            dest: {
                'package': 'bar'
            }
        };
        test.expect(2);
        var msdeployCommandLine = buildCommand(options);
        test.ok(typeof msdeployCommandLine === 'string', 'Command returned a string');
        test.ok(msdeployCommandLine.indexOf('-dest:package="bar"') != -1,'Destination arg found');
        test.done();
    },
    'Build command level 2 args as function returns': function (test) {
        var options = {
            verb: 'sync',
            source: {
                iisApp: function () { return 'foo'; }
            },
            dest: {
                'package': function () { return 'bar'; }
            }
        };
        test.expect(2);
        var msdeployCommandLine = buildCommand(options);
        test.ok(typeof msdeployCommandLine === 'string', 'Command returned a string');
        test.ok(msdeployCommandLine.indexOf('-dest:package="bar"') != -1,'Destination arg found');
        test.done();
    }
};