import { AxiosInstance } from 'axios';
import { FleetbaseRegistryAuthConfig } from './config';
export interface IFleetbaseClient extends AxiosInstance {
}
export declare const createFleetbaseClient: (config: FleetbaseRegistryAuthConfig) => IFleetbaseClient;
