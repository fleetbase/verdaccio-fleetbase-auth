import { IPluginAuth, AuthPluginPackage, Callback, Config, RemoteUser, AllowAccess, AuthAccessCallback, PackageAccess, Logger } from '@verdaccio/types';
import { getConflict, getForbidden } from '@verdaccio/commons-api';
import { createFleetbaseClient, IFleetbaseClient } from './fleetbaseClient';
import { FleetbaseRegistryAuthConfig } from './config';
import { Application } from 'express';
import getConfigValue from './getConfigValue';

export { FleetbaseRegistryAuthConfig };
export default class FleetbaseAuthPlugin implements IPluginAuth<Config> {
    private config: FleetbaseRegistryAuthConfig;
    private fleetbaseClient: IFleetbaseClient;
    private logger: Logger;

    public constructor(config: Config, options: any) {
        this.config = Object.assign(config, config.auth['@fleetbase/verdaccio-fleetbase-auth']);
        this.logger = options.logger;
        this.logger.debug(
            {
                config: JSON.stringify(
                    {
                        fleetbaseHost: getConfigValue('FLEETBASE_HOST', this.config),
                        fleetbaseApiKey: getConfigValue('FLEETBASE_API_KEY', this.config),
                    },
                    null,
                    4
                ),
            },
            'FLEETBASE CLIENT ENV/CONFIG VARS: @{config}'
        );
        this.fleetbaseClient = createFleetbaseClient(this.config);
    }

    public async authenticate(identity: string, password: string, callback: Callback): Promise<void> {
        this.logger.debug({ identity }, 'Auth::authenticate() - Authenticating user with identity: @{identity}');

        try {
            const response = await this.fleetbaseClient.post('auth/authenticate', { identity, password });
            this.logger.debug({ response: response.data }, 'Auth::authenticate() - Response from Fleetbase: @{response}');
            const { groups } = response.data;
            this.logger.debug({ groups: JSON.stringify(groups) }, 'Auth::authenticate() -Groups: @{groups}');

            callback(null, groups ?? []);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Authentication failed for creating developer account';
            const conflict = getConflict(errorMessage);
            this.logger.debug({ error: errorMessage }, 'Auth::authenticate() - Authentication failed with error: @{error}');
            callback(conflict);
        }
    }

    public async adduser(identity: string, password: string, callback: Callback): Promise<void> {
        this.logger.debug({ identity, password }, 'Auth::addUser() - Creating registry user with identity: @{identity} and password: @{password}');
        try {
            const response = await this.fleetbaseClient.post('auth/add-user', { identity, password });
            this.logger.debug({ response: response.data }, 'Auth::addUser() - Response from Fleetbase: @{response}');
            const { token } = response.data;
            this.logger.debug({ token }, 'Auth::addUser() - Token Generated: @{token}');

            callback(null, true);
        } catch (error) {
            // Handle errors and call the callback with the error
            callback(error);
        }
    }

    public async allow_access(user: RemoteUser, pkg: (Config & PackageAccess) | (AllowAccess & PackageAccess), callback: AuthAccessCallback): Promise<void> {
        // Allow access should check with Fleetbase API and see that registry user has access to the extension
        this.logger.debug({ user }, 'Auth::allow_access() - User: @{user}');
        this.logger.debug({ pkg }, 'Auth::allow_access() - Package: @{pkg}');
        try {
            const response = await this.fleetbaseClient.post('auth/check-access', { identity: user.name });
            this.logger.debug({ response: response.data }, 'Auth::allow_access() - Response from Fleetbase: @{response}');
            const { allowed } = response.data;
            this.logger.debug({ allowed }, 'Auth::allow_access() - Allowed: @{allowed}');

            callback(null, allowed);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Access denied';
            const err = getForbidden(errorMessage);
            this.logger.debug({ error: errorMessage }, 'Auth::allow_access() - Access not granted: @{error}');
            callback(err, false);
        }
    }

    public async allow_publish(user: RemoteUser, pkg: (Config & PackageAccess) | (AllowAccess & PackageAccess), callback: Callback): Promise<void> {
        // Allow publish should check with Fleetbase API for the extension and check the status for approved
        // After publish registry should update the extension as published
        this.logger.debug({ user }, 'Auth::allow_publish() - User: @{user}');
        this.logger.debug({ pkg }, 'Auth::allow_publish() - Package: @{pkg}');
        try {
            const response = await this.fleetbaseClient.post('auth/check-publish', { identity: user.name, package: pkg.name });
            this.logger.debug({ response: response.data }, 'Auth::allow_publish() - Response from Fleetbase: @{response}');
            const { allowed } = response.data;
            this.logger.debug({ allowed }, 'Auth::allow_publish() - Allowed: @{allowed}');

            callback(null, allowed);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Publish forbidden';
            const err = getForbidden(errorMessage);
            this.logger.debug({ error: errorMessage }, 'Auth::allow_publish() - Publish forbidden: @{error}');
            callback(err, false);
        }
    }
}
