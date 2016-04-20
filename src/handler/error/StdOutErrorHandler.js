"use strict";
var StdOutErrorHandler = (function () {
    function StdOutErrorHandler() {
    }
    StdOutErrorHandler.prototype.handle = function (error) {
        if (error) {
            console.log(error);
        }
    };
    return StdOutErrorHandler;
}());
exports.StdOutErrorHandler = StdOutErrorHandler;
