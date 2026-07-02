"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocaleMessages = exports.getSupportedLanguage = exports.defaultLanguage = void 0;
const en_1 = require("../locales/en");
const vi_1 = require("../locales/vi");
const messagesByLanguage = {
    vi: vi_1.vi,
    en: en_1.en,
};
exports.defaultLanguage = 'vi';
const getSupportedLanguage = (language) => {
    if (language === 'en' || language === 'vi') {
        return language;
    }
    return exports.defaultLanguage;
};
exports.getSupportedLanguage = getSupportedLanguage;
const getLocaleMessages = (language) => {
    const lang = (0, exports.getSupportedLanguage)(language);
    return {
        lang,
        messages: messagesByLanguage[lang],
    };
};
exports.getLocaleMessages = getLocaleMessages;
