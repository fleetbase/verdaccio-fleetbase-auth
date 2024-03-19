import axios, { AxiosInstance } from 'axios';

export interface IFleetbaseClient extends AxiosInstance {}

export const createFleetbaseClient = (): IFleetbaseClient => {
    const fleetbaseHost = process.env.FLEETBASE_HOST;
    const fleetbaseApiKey = process.env.FLEETBASE_API_KEY;

    const instance = axios.create({
        baseURL: fleetbaseHost,
        headers: {
            Authorization: `Bearer ${fleetbaseApiKey}`,
            'Content-Type': 'application/json',
        },
    });

    return instance as IFleetbaseClient;
};
