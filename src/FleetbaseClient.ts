import axios, { AxiosInstance } from 'axios';
import { FleetbaseRegistryAuthConfig } from './config';

export interface IFleetbaseClient extends AxiosInstance {}

export const createFleetbaseClient = (config: FleetbaseRegistryAuthConfig): IFleetbaseClient => {
    const instance = axios.create({
        baseURL: `${config.fleetbaseHost}/~registry/v1/`,
        headers: {
            Authorization: `Bearer ${config.fleetbaseApiKey}`,
            'Content-Type': 'application/json',
        },
    });

    return instance as IFleetbaseClient;
};
