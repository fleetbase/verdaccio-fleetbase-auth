"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commons_api_1 = require("@verdaccio/commons-api");
const fleetbaseClient_1 = require("./fleetbaseClient");
const getConfigValue_1 = __importDefault(require("./getConfigValue"));
class FleetbaseAuthPlugin {
    config;
    fleetbaseClient;
    logger;
    protectedPrefixes;
    defaultProtectedPrefixes = '@fleetbase,fleetbase,@flb,@fleetbase-extension,@flb-extension';
    constructor(config, options) {
        this.config = Object.assign(config, config.auth['@fleetbase/verdaccio-fleetbase-auth']);
        this.logger = options.logger;
        this.fleetbaseClient = (0, fleetbaseClient_1.createFleetbaseClient)(this.config);
        this.protectedPrefixes = (0, getConfigValue_1.default)('PROTECTED_PREFIXES', this.config) ?? '@fleetbase,fleetbase,@flb,@fleetbase-extension,@flb-extension';
    }
    isNotProtectedPackage(packageName) {
        const prefixes = this.protectedPrefixes.split(',');
        for (const prefix of prefixes) {
            if (packageName.startsWith(prefix)) {
                return false;
            }
        }
        return true;
    }
    async authenticate(identity, password, callback) {
        this.logger.debug({ identity }, 'Auth::authenticate() - Authenticating user with identity: @{identity}');
        try {
            const response = await this.fleetbaseClient.post('auth/authenticate', { identity, password });
            this.logger.debug({ response: response.data }, 'Auth::authenticate() - Response from Fleetbase: @{response}');
            const { groups } = response.data;
            this.logger.debug({ groups: JSON.stringify(groups) }, 'Auth::authenticate() - Groups: @{groups}');
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
            this.logger.debug({ response: response.data }, 'Auth::addUser() - Response from Fleetbase: @{response}');
            const { token } = response.data;
            this.logger.debug({ token }, 'Auth::addUser() - Token Generated: @{token}');
            callback(null, true);
        }
        catch (error) {
            // Handle errors and call the callback with the error
            callback(error);
        }
    }
    async allow_access(user, pkg, callback) {
        // Allow access should check with Fleetbase API and see that registry user has access to the extension
        this.logger.debug({ user }, 'Auth::allow_access() - User: @{user}');
        this.logger.debug({ pkg }, 'Auth::allow_access() - Package: @{pkg}');
        // If not a protected package just allow access without server check
        if (this.isNotProtectedPackage(pkg.name)) {
            this.logger.debug({ packageName: pkg.name }, 'Auth::allow_access() - (No Check) Access Allowed: @{packageName}');
            callback(null, true);
            return;
        }
        // Check with server if access is allowed
        try {
            this.logger.debug({ packageName: pkg.name, identity: user.name, groups: user.groups }, 'Auth::allow_access() Request Params: { identity: @{identity}, package: @{packageName}, groups: @{groups} }');
            const response = await this.fleetbaseClient.post('auth/check-access', { identity: user.name, package: pkg.name, groups: user.groups });
            this.logger.debug({ response: response.data }, 'Auth::allow_access() - Response from Fleetbase: @{response}');
            const { allowed } = response.data;
            this.logger.debug({ allowed }, 'Auth::allow_access() - Allowed: @{allowed}');
            callback(null, allowed);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Access denied';
            const err = (0, commons_api_1.getForbidden)(errorMessage);
            this.logger.debug({ error: errorMessage }, 'Auth::allow_access() - Access not granted: @{error}');
            callback(err, false);
        }
    }
    async allow_publish(user, pkg, callback) {
        // Allow publish should check with Fleetbase API for the extension and check the status for approved
        // After publish registry should update the extension as published
        this.logger.debug({ user }, 'Auth::allow_publish() - User: @{user}');
        this.logger.debug({ pkg }, 'Auth::allow_publish() - Package: @{pkg}');
        try {
            const response = await this.fleetbaseClient.post('auth/check-publish', { identity: user.name, package: pkg.name, groups: user.groups });
            this.logger.debug({ response: response.data }, 'Auth::allow_publish() - Response from Fleetbase: @{response}');
            const { allowed } = response.data;
            this.logger.debug({ allowed }, 'Auth::allow_publish() - Allowed: @{allowed}');
            callback(null, allowed);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Publish forbidden';
            const err = (0, commons_api_1.getForbidden)(errorMessage);
            this.logger.debug({ error: errorMessage }, 'Auth::allow_publish() - Publish forbidden: @{error}');
            callback(err, false);
        }
    }
}
exports.default = FleetbaseAuthPlugin;
