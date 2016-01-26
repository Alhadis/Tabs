"use strict";

const touchEnabled = "ontouchstart" in document.documentElement;
const pressEvent   = touchEnabled ? "touchend" : "click";
