import { HttpClientConfig, HttpQueryParams } from 'bungie-api-ts-no-const-enum-local/http';

export const API_KEY = process.env.REACT_APP_BUNGIE_API_KEY || 'missing-api-key';

export function bungieApiUpdate(path: string, data?: Record<string, any>): HttpClientConfig {
  return {
    method: 'POST',
    url: `https://www.bungie.net${path}`,
    body: data,
  };
}

export function bungieApiQuery(path: string, params?: HttpQueryParams): HttpClientConfig {
  return {
    method: 'GET',
    url: `https://www.bungie.net${path}`,
    params,
  };
}

export function oauthClientId(): string {
  return process.env.REACT_APP_BUNGIE_CLIENT_ID || 'missing-client-id-env';
}

export function oauthClientSecret(): string {
  return process.env.REACT_APP_BUNGIE_SECRET || 'missing-client-id-env';
}
