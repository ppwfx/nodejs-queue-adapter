"use strict";
var JsonEncoder = (function () {
    function JsonEncoder() {
    }
    JsonEncoder.prototype.encode = function (payload) {
        return JSON.stringify(payload);
    };
    JsonEncoder.prototype.decode = function (payload) {
        return JSON.parse(payload);
    };
    return JsonEncoder;
}());
exports.JsonEncoder = JsonEncoder;
