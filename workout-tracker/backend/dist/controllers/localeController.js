"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocales = void 0;
const localeService_1 = require("../services/localeService");
const getLocales = (req, res) => {
    const language = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    res.status(200).json((0, localeService_1.getLocaleMessages)(language));
};
exports.getLocales = getLocales;
