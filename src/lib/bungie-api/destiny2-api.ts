/* eslint-disable */
// import { t } from 'app/i18next-t';
// import { InGameLoadout } from 'app/loadout-drawer/loadout-types';
// import { DimError } from 'app/utils/dim-error';
import { errorLog } from '../utils/log';
import {
  AwaAuthorizationResult,
  awaGetActionToken,
  awaInitializeRequest,
  AwaType,
  BungieMembershipType,
  clearLoadout,
  DestinyComponentType,
  DestinyLinkedProfilesResponse,
  DestinyManifest,
  DestinyProfileResponse,
  DestinyVendorsResponse,
  equipItem,
  equipItems as equipItemsApi,
  equipLoadout,
  getDestinyManifest,
  getLinkedProfiles,
  getProfile as getProfileApi,
  getVendors as getVendorsApi,
  PlatformErrorCodes,
  pullFromPostmaster,
  ServerResponse,
  setItemLockState,
  setQuestTrackedState,
  snapshotLoadout,
  transferItem,
  updateLoadoutIdentifiers,
} from 'bungie-api-ts-no-const-enum-local/destiny2';
import _ from 'lodash';
// import { DimItem } from '../inventory/item-types';
// import { DimStore } from '../inventory/store-types';
// import { reportException } from '../utils/sentry';
import {
  authenticatedHttpClient,
  handleUniquenessViolation,
  unauthenticatedHttpClient,
} from './bungie-service-helper';


/** A specific Destiny account (one per platform and Destiny version) */
export interface DestinyAccount {
  /** Bungie Name */
  readonly displayName: string;
  /** The platform type this account started on. It may not be exclusive to this platform anymore, but this is what gets used to call APIs. */
  readonly originalPlatformType: BungieMembershipType;
  /** readable platform name */
  readonly platformLabel: string;
  /** Destiny platform membership ID. */
  readonly membershipId: string;
  /** Which version of Destiny is this account for? */
  readonly destinyVersion: 1 | 2;
  /** All the platforms this account plays on (post-Cross-Save) */
  readonly platforms: BungieMembershipType[];

  /** When was this account last used? */
  readonly lastPlayed: Date;
}

/**
 * APIs for interacting with Destiny 2 game data.
 *
 * Destiny2 Service at https://destinydevs.github.io/BungieNetPlatform/docs/Endpoints
 */

/**
 * Get the information about the current manifest.
 */
export async function getManifest(): Promise<DestinyManifest> {
  const response = await getDestinyManifest(unauthenticatedHttpClient);
  return response.Response;
}

export async function getLinkedAccounts(
  bungieMembershipId: string
): Promise<DestinyLinkedProfilesResponse> {
  const response = await getLinkedProfiles(authenticatedHttpClient, {
    membershipId: bungieMembershipId,
    membershipType: BungieMembershipType.BungieNext,
    getAllMemberships: true,
  });
  return response.Response;
}

/**
 * Get just character info for all a user's characters on the given platform. No inventory, just enough to refresh stats.
 */
export function getCharacters(platform: DestinyAccount): Promise<DestinyProfileResponse> {
  return getProfile(platform, DestinyComponentType.Characters);
}

/**
 * Get parameterized profile information for the whole account. Pass in components to select what
 * you want. This can handle just characters, full inventory, vendors, kiosks, activities, etc.
 */
async function getProfile(
  platform: DestinyAccount,
  ...components: DestinyComponentType[]
): Promise<DestinyProfileResponse> {
  const response = await getProfileApi(authenticatedHttpClient, {
    destinyMembershipId: platform.membershipId,
    membershipType: platform.originalPlatformType,
    components,
  });
  // TODO: what does it actually look like to not have an account?
  // if (Object.keys(response.Response).length === 0) {
  //   throw new DimError(
  //     'BungieService.NoAccountForPlatform',
  //     t('BungieService.NoAccountForPlatform', {
  //       platform: platform.platformLabel,
  //     })
  //   );
  // }
  return response.Response;
}

export async function getVendors(
  account: DestinyAccount,
  characterId: string
): Promise<DestinyVendorsResponse> {
  const response = await getVendorsApi(authenticatedHttpClient, {
    characterId,
    destinyMembershipId: account.membershipId,
    membershipType: account.originalPlatformType,
    components: [
      DestinyComponentType.Vendors,
      DestinyComponentType.VendorSales,
      DestinyComponentType.ItemInstances,
      DestinyComponentType.ItemObjectives,
      DestinyComponentType.ItemSockets,
      DestinyComponentType.ItemCommonData,
      DestinyComponentType.CurrencyLookups,
      DestinyComponentType.ItemPlugStates,
      DestinyComponentType.ItemReusablePlugs,
      // TODO: We should try to defer this until the popup is open!
      DestinyComponentType.ItemPlugObjectives,
    ],
  });
  return response.Response;
}

