"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Config_1 = require("../Config");
var ActiveMqConfig = (function (_super) {
    __extends(ActiveMqConfig, _super);
    function ActiveMqConfig() {
        _super.apply(this, arguments);
    }
    return ActiveMqConfig;
}(Config_1.Config));
exports.ActiveMqConfig = ActiveMqConfig;
