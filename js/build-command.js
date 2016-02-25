/*
 * Based on work by mrjackdavis
 * Original Copyright license:
 * Copyright (c) 2014 mrjackdavis
 * Licensed under the MIT license.
 * https://github.com/mrjackdavis/grunt-msdeploy
 */
(function () {
    "use strict";
    module.exports = function(options) {
        var fullCommand = '';
        for (var key in options){
            if(!options.hasOwnProperty(key)) {
                continue;
            }
            //append level 1 to args
            var argument = "-"+key+":";

            var obj = options[key];

            //Check if level 2 is string
            if(typeof obj === 'string' || obj instanceof String){
                //append string to args
                argument += obj;
            }else{
                //level 2 is key value pair, loop through and attach
                for (var prop in obj) {
                    if(obj.hasOwnProperty(prop)){
                        var propVal;
                        if(typeof obj[prop] === 'function') {
                            propVal = prop + "=\"" + obj[prop]() +"\",";
                        } else {
                            propVal = prop + "=\"" + obj[prop] +"\",";
                        }
                        argument += (propVal);
                    }
                }
                //Remove last comma
                argument = argument.slice(0, -1);
            }

            //Construct full command
            fullCommand += ' ' + argument;
        }
        return fullCommand;
    };
})();