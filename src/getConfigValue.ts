import { FleetbaseRegistryAuthConfig } from './config';

function toCamelCase(str: string): string {
    return str
        .split(/[-_ ]+/)
        .map((word, index) => (index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
        .join('');
}

export default (key: string, config: FleetbaseRegistryAuthConfig): string => {
    const envValue = process.env[key];
    const configKey = toCamelCase(key);
    return envValue || config[configKey];
};
