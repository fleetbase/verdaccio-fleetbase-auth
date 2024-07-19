import { IPluginAuth, Callback, Config, RemoteUser, AllowAccess, AuthAccessCallback, PackageAccess } from '@verdaccio/types';
import { FleetbaseRegistryAuthConfig } from './config';
export { FleetbaseRegistryAuthConfig };
export default class FleetbaseAuthPlugin implements IPluginAuth<Config> {
    private config;
    private fleetbaseClient;
    private logger;
    private protectedPrefixes;
    private defaultProtectedPrefixes;
    constructor(config: Config, options: any);
    isNotProtectedPackage(packageName: string): boolean;
    authenticate(identity: string, password: string, callback: Callback): Promise<void>;
    adduser(identity: string, password: string, callback: Callback): Promise<void>;
    allow_access(user: RemoteUser, pkg: (Config & PackageAccess) | (AllowAccess & PackageAccess), callback: AuthAccessCallback): Promise<void>;
    allow_publish(user: RemoteUser, pkg: (Config & PackageAccess) | (AllowAccess & PackageAccess), callback: Callback): Promise<void>;
}
