import { IPluginAuth, AuthPluginPackage, Callback, Config, RemoteUser, AllowAccess, AuthAccessCallback, PackageAccess, Logger } from '@verdaccio/types';
import { getConflict } from '@verdaccio/commons-api';
import { createFleetbaseClient, IFleetbaseClient } from './fleetbaseClient';
import { FleetbaseRegistryAuthConfig } from './config';
import { Application } from 'express';

export { FleetbaseRegistryAuthConfig };
export default class FleetbaseAuthPlugin implements IPluginAuth<Config> {
    private config: FleetbaseRegistryAuthConfig;
    private fleetbaseClient: IFleetbaseClient;
    private logger: Logger;

    public constructor(config: Config, options: any) {
        this.config = Object.assign(config, config.auth['@fleetbase/verdaccio-fleetbase-auth']);
        this.logger = options.logger;
        this.fleetbaseClient = createFleetbaseClient(this.config);
    }

    public async authenticate(identity: string, password: string, callback: Callback): Promise<void> {
        this.logger.debug({ identity }, 'Auth::authenticate() - Authenticating user with identity: @{identity}');

        try {
            const response = await this.fleetbaseClient.post('auth/authenticate', { identity, password });
            const { groups } = response.data;

            callback(null, groups);
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
            this.logger.debug({ response }, 'Auth::addUser() - Respone from Fleetbase: @{response}');
            const { token } = response.data;
            this.logger.debug({ token }, 'Auth::addUser() - Token Generated: @{token}');

            callback(null, true);
        } catch (error) {
            // Handle errors and call the callback with the error
            callback(error);
        }
    }

    public allow_access(user: RemoteUser, pkg: (Config & PackageAccess) | (AllowAccess & PackageAccess), cb: AuthAccessCallback): void {
        // Example implementation, modify based on your access logic
    }

    public allow_publish(user: RemoteUser, pkg: PackageAccess, cb: Callback): void {
        // Example implementation, adjust according to your publish logic
    }
}
