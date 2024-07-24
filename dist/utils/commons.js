"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringEnumToArray = exports.numberEnumToArray = void 0;
const numberEnumToArray = (numberEnum) => {
    return Object.values(numberEnum).filter((value) => typeof value === 'number');
};
exports.numberEnumToArray = numberEnumToArray;
const stringEnumToArray = (numberEnum) => {
    return Object.values(numberEnum).filter((value) => typeof value === 'string');
};
exports.stringEnumToArray = stringEnumToArray;
