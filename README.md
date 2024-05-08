# Cache Utils Plugin for GraphQL Mesh

Cache Utils Plugin is a plugin for GraphQL Mesh that introduces additional routes to manage the cache keys directly through the GraphQL interface. This plugin provides functionalities to search for cache keys and clear them, enhancing control over the caching behavior of your GraphQL services.

## Installation

Before you can use the Cache Utils Plugin, you need to install it along with GraphQL Mesh if you haven't already done so. You can install these using npm or yarn.

```bash
npm install @dmamontov/graphql-mesh-cache-utils-plugin
```

or

```bash
yarn add @dmamontov/graphql-mesh-cache-utils-plugin
```

## Configuration

### Modifying tsconfig.json

To make TypeScript recognize the Cache Utils Plugin, you need to add an alias in your tsconfig.json.

Add the following paths configuration under the compilerOptions in your tsconfig.json file:

```json
{
  "compilerOptions": {
    "paths": {
       "cacheUtils": ["node_modules/@dmamontov/graphql-mesh-cache-utils-plugin"]
    }
  }
}
```

### Adding the Plugin to GraphQL Mesh

You need to include the Cache Utils Plugin in your GraphQL Mesh configuration file (usually .meshrc.yaml). Below is an example configuration that demonstrates how to use this plugin:

```yaml
plugins:
  - cacheUtils:
      enabled: true
      apiKey: 6dd7840a-7ccf-4b6b-813e-98d48874df3c
```

## Usage

The plugin adds two new routes to your GraphQL Mesh server:

- /utils/cache: Used for searching cache keys.
- /utils/cache/clear: Used to clear cache keys.

### Query Parameters

- prefix: The prefix of the cache keys you want to search or clear.
- apiKey: The API key required to authorize access to the routes.

### Examples

#### Search Cache Keys

To search for cache keys:

```bash
curl "http://localhost/utils/cache?prefix=user&apiKey=your-api-key"
```

This will return all cache keys that start with the prefix user.

#### Clear Cache Keys

To clear cache keys:

```bash
curl "http://localhost:4000/utils/cache/clear?prefix=user&apiKey=your-api-key"
```

This will clear all cache keys that start with the prefix user.

## Conclusion

Remember, always test your configurations in a development environment before applying them in production to ensure that everything works as expected.