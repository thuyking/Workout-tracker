"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const localeController_1 = require("../controllers/localeController");
const router = (0, express_1.Router)();
router.get('/', localeController_1.getLocales);
exports.default = router;
