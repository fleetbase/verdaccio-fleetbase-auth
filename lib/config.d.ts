import { Config } from '@verdaccio/legacy-types';
export interface FleetbaseRegistryAuthConfig extends Config {
    fleetbaseHost: string;
    fleetbaseApiKey: string;
    protectedPrefixes: string;
}
