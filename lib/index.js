"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commons_api_1 = require("@verdaccio/commons-api");
const fleetbaseClient_1 = require("./fleetbaseClient");
class FleetbaseAuthPlugin {
    config;
    fleetbaseClient;
    logger;
    constructor(config, options) {
        this.config = Object.assign(config, config.auth['@fleetbase/verdaccio-fleetbase-auth']);
        this.logger = options.logger;
        this.fleetbaseClient = (0, fleetbaseClient_1.createFleetbaseClient)(this.config);
    }
    async authenticate(identity, password, callback) {
        this.logger.debug({ identity }, 'Auth::authenticate() - Authenticating user with identity: @{identity}');
        try {
            const response = await this.fleetbaseClient.post('auth/authenticate', { identity, password });
            const { groups } = response.data;
            callback(null, groups);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Authentication failed for creating developer account';
            const conflict = (0, commons_api_1.getConflict)(errorMessage);
            this.logger.debug({ error: errorMessage }, 'Auth::authenticate() - Authentication failed with error: @{error}');
            callback(conflict);
        }
    }
    async adduser(identity, password, callback) {
        this.logger.debug({ identity, password }, 'Auth::addUser() - Creating registry user with identity: @{identity} and password: @{password}');
        try {
            const response = await this.fleetbaseClient.post('auth/add-user', { identity, password });
            this.logger.debug({ response }, 'Auth::addUser() - Respone from Fleetbase: @{response}');
            const { token } = response.data;
            this.logger.debug({ token }, 'Auth::addUser() - Token Generated: @{token}');
            callback(null, true);
        }
        catch (error) {
            // Handle errors and call the callback with the error
            callback(error);
        }
    }
    allow_access(user, pkg, cb) {
        // Example implementation, modify based on your access logic
    }
    allow_publish(user, pkg, cb) {
        // Example implementation, adjust according to your publish logic
    }
}
exports.default = FleetbaseAuthPlugin;
