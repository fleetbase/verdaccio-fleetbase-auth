import { IPluginAuth, Callback, Config, RemoteUser, AllowAccess, AuthAccessCallback, PackageAccess } from '@verdaccio/types';
import { FleetbaseRegistryAuthConfig } from './config';
export { FleetbaseRegistryAuthConfig };
export default class FleetbaseAuthPlugin implements IPluginAuth<Config> {
    private config;
    private fleetbaseClient;
    private logger;
    constructor(config: Config, options: any);
    authenticate(identity: string, password: string, callback: Callback): Promise<void>;
    adduser(identity: string, password: string, callback: Callback): Promise<void>;
    allow_access(user: RemoteUser, pkg: (Config & PackageAccess) | (AllowAccess & PackageAccess), callback: AuthAccessCallback): Promise<void>;
    allow_publish(user: RemoteUser, pkg: PackageAccess, callback: Callback): Promise<void>;
}
