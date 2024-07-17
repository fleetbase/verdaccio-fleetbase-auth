# Fleetbase Verdaccio Authentication Plugin

The Fleetbase Verdaccio Authentication Plugin provides robust authentication management for the Fleetbase registry, leveraging the Fleetbase API to authenticate users. This plugin is an essential component of the official Fleetbase registry ([https://registry.fleetbase.io](https://registry.fleetbase.io)), which supports both npm and composer protocols and includes specific enhancements for the Fleetbase ecosystem.

## Key Features

- **API-based Authentication**: Integrates directly with the Fleetbase API to authenticate users, ensuring secure access to the registry.
- **Support for Multiple Protocols**: Compatible with both npm and composer protocols, enabling flexible usage across different project types within the Fleetbase ecosystem.

## Installation

To install the plugin, execute the following command in your terminal:

```bash
npm install @fleetbase/verdaccio-fleetbase-auth
```

## Configuration

Configure the plugin by adding the following settings to your Verdaccio server's `config.yaml` file:

```yaml
auth:
  '@fleetbase/verdaccio-fleetbase-auth':
    fleetbaseHost: https://api.fleetbase.io
    fleetbaseApiKey: 1234567e
```

Ensure that the `fleetbaseHost` and `fleetbaseApiKey` are set to your Fleetbase API host and your specific API key respectively.

## Environment Variables

For additional security and flexibility, you can also configure the plugin using environment variables. Set the following variables in your environment:

```plaintext
FLEETBASE_HOST=https://api.fleetbase.io
FLEETBASE_API_KEY=your_fleetbase_api_key_here
```

These variables allow you to manage sensitive information outside of the repository, enhancing security.

## Usage

After installation and configuration, the plugin will automatically handle authentication for the Fleetbase registry using the specified API credentials. This process is transparent to end users but requires valid credentials for access.

## Contributing

Contributions are welcome! If you have suggestions or improvements, please fork the repository and submit a pull request. For detailed instructions, refer to our [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the AGPL v3 License. See the [LICENSE.md](LICENSE.md) file for more details.

## Support

If you encounter any issues or require assistance, please open an issue on our GitHub repository at [https://github.com/fleetbase/verdaccio-fleetbase-auth/issues](https://github.com/fleetbase/verdaccio-fleetbase-auth/issues).

## Acknowledgments

- Thanks to the Verdaccio community for providing the foundation for this plugin.
