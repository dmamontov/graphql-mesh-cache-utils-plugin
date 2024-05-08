import { type Plugin } from 'graphql-yoga';
import { stringInterpolator } from '@graphql-mesh/string-interpolation';
import { type MeshPlugin, type MeshPluginOptions } from '@graphql-mesh/types';
import { type CacheUtilsPluginConfig } from './types';

export default function useCacheUtils(
    options: MeshPluginOptions<CacheUtilsPluginConfig>,
): MeshPlugin<any> {
    const { apiKey, cache } = options;

    const enabled =
        typeof options.enabled === 'string'
            ? stringInterpolator.parse(options.enabled, { env: process.env }) === 'true'
            : options.enabled;

    if (!enabled) {
        return {};
    }

    const parsedApiKey = stringInterpolator.parse(apiKey, { env: process.env }).trim();

    return {
        onPluginInit({ addPlugin }) {
            addPlugin({
                async onRequest({ url, fetchAPI, endResponse }) {
                    // @ts-expect-error
                    const params = url?.searchParams?.params;
                    if (
                        !params ||
                        !Object.keys(params).includes('apiKey') ||
                        params.apiKey.toString().trim() !== parsedApiKey ||
                        !['/utils/cache', '/utils/cache/clear'].includes(url.pathname)
                    ) {
                        return;
                    }

                    const prefix = Object.keys(params).includes('prefix') ? params.prefix : '';

                    const keys = await cache.getKeysByPrefix(prefix);

                    if (url.pathname === '/utils/cache') {
                        const result: Record<string, any> = {};
                        for (const key of keys) {
                            result[key] = await cache.get(key);
                        }

                        endResponse(
                            new fetchAPI.Response(JSON.stringify(result, null, 2), {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }),
                        );

                        return;
                    }

                    if (url.pathname === '/utils/cache/clear') {
                        for (const key of keys) {
                            await cache.delete(key);
                        }

                        endResponse(
                            new fetchAPI.Response(JSON.stringify(keys, null, 2), {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }),
                        );
                    }
                },
            } as Plugin);
        },
    };
}
