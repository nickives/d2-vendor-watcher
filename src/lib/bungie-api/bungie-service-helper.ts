/* eslint-disable */

// import { t } from 'app/i18next-t';
// import { showNotification } from 'app/notifications/notifications';
// import { DimError } from '../utils/dim-error';
import { errorLog, infoLog } from '../utils/log';
import { PlatformErrorCodes } from 'bungie-api-ts-no-const-enum-local/destiny2';
import { HttpClient, HttpClientConfig } from 'bungie-api-ts-no-const-enum-local/http';
import _ from 'lodash';
// import { DimItem } from '../inventory/item-types';
// import { DimStore } from '../inventory/store-types';
import { FatalTokenError, fetchWithBungieOAuth } from './authenticated-fetch';
import { API_KEY } from './bungie-api-utils';
import {
  BungieError,
  HttpStatusError,
  createFetchWithNonStoppingTimeout,
  createHttpClient,
  responsivelyThrottleHttpClient,
} from './http-client';
import { rateLimitedFetch } from './rate-limiter';

const TIMEOUT = 15000;
const notifyTimeout = _.throttle(
  (startTime: number, timeout: number) => {
    // Only notify if the timeout fired around the right time - this guards against someone pausing
    // the tab and coming back in an hour, for example
    if (navigator.onLine && Math.abs(Date.now() - (startTime + timeout)) <= 1000) {
      // showNotification({
      //   type: 'warning',
      //   title: t('BungieService.Slow'),
      //   body: t('BungieService.SlowDetails'),
      //   duration: 15000,
      // });
    }
  },
  5 * 60 * 1000, // 5 minutes
  { leading: true, trailing: false }
);

const logThrottle = (timesThrottled: number, waitTime: number, url: string) =>
  infoLog(
    'bungie api',
    'Throttled',
    timesThrottled,
    'times, waiting',
    waitTime,
    'ms before calling',
    url
  );

// it would be really great if they implemented the pipeline operator soon
/** used for most Bungie API requests */
export const authenticatedHttpClient = dimErrorHandledHttpClient(
  responsivelyThrottleHttpClient(
    createHttpClient(
      createFetchWithNonStoppingTimeout(
        rateLimitedFetch(fetchWithBungieOAuth),
        TIMEOUT,
        notifyTimeout
      ),
      API_KEY
    ),
    logThrottle
  )
);

/** used to get manifest and global alerts */
export const unauthenticatedHttpClient = dimErrorHandledHttpClient(
  responsivelyThrottleHttpClient(
    createHttpClient(createFetchWithNonStoppingTimeout(fetch, TIMEOUT, notifyTimeout), undefined),
    logThrottle
  )
);

/**
 * wrap HttpClient in handling specific to DIM, using i18n strings, bounce to login, etc
 */
function dimErrorHandledHttpClient(httpClient: HttpClient): HttpClient {
  return async (config: HttpClientConfig) => {
    try {
      return await httpClient(config);
    } catch (e) {
      handleErrors(e);
    }
  };
}

/**
 * if HttpClient throws an error (js, Bungie, http) this enriches it with DIM concepts and then re-throws it
 */
function handleErrors(error: unknown): never {
  throw console.log(error);
}

// Handle "DestinyUniquenessViolation" (1648)
export function handleUniquenessViolation(error: unknown, item: any, store: any): never {
  if (
    error instanceof BungieError &&
    error.code === PlatformErrorCodes.DestinyUniquenessViolation
  ) {
    throw console.log('handleUniquenessViolation');
  }
  throw error;
}
