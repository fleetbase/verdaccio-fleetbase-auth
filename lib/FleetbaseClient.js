"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFleetbaseClient = void 0;
const axios_1 = __importDefault(require("axios"));
const createFleetbaseClient = (config) => {
    const instance = axios_1.default.create({
        baseURL: `${config.fleetbaseHost}/~registry/v1/`,
        headers: {
            Authorization: `Bearer ${config.fleetbaseApiKey}`,
            'Content-Type': 'application/json',
        },
    });
    return instance;
};
exports.createFleetbaseClient = createFleetbaseClient;
