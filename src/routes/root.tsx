import React, { useEffect, useState } from "react";
import {
  getProfile as getProfileApi,
  getVendors,
  DestinyComponentType,
  ServerResponse,
  DestinyProfileResponse,
  DestinyCollectibleState,
  BungieMembershipType,
} from "bungie-api-ts-no-const-enum-local/destiny2";
import { authenticatedHttpClient } from "../lib/bungie-api/bungie-service-helper";
import { useSession } from "../components/SessionContext/SessionContext";
import { getLinkedAccounts } from "../lib/bungie-api/destiny2-api";
import Vendor from "../components/Vendor/Vendor";
import { VendorGroup, createVendors } from "../components/Vendor/createVendor";
import { useManifest } from "../components/ManifestContext/ManifestContext";
import { filterVendorGroups } from "../components/Vendor/filterVendors";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { VwManifest } from "../lib/getManifest";

function findOwnedItems(response: ServerResponse<DestinyProfileResponse>, manifest: VwManifest): number[] {
  const profileCollectables = response.Response.profileCollectibles.data?.collectibles;
  const characterCollectablesDict = response.Response.characterCollectibles.data;
  const collectableComponents = characterCollectablesDict
    ? Object.values(characterCollectablesDict).map(c => c.collectibles)
    : [];
  if (profileCollectables) collectableComponents.push(profileCollectables);

  return collectableComponents.flatMap(c => Object.entries(c)
    .filter(entry => {
      return !(entry[1].state & DestinyCollectibleState.NotAcquired);
    })
    .map(entry => {
      // we know this conversion is safe, because the input key from collectibles is a number
      const itemHash = manifest['DestinyCollectibleDefinition'][entry[0] as unknown as number].itemHash;
      return itemHash;
    })
  );
}

async function getProfile(membershipId: string, membershipType: BungieMembershipType) {
  return getProfileApi(authenticatedHttpClient, {
    destinyMembershipId: membershipId,
    membershipType: membershipType,
    components: [DestinyComponentType.Characters, DestinyComponentType.Collectibles]
  });
}

const Root = (): React.ReactElement => {
  const {user, membership, updateSessionState} = useSession();
  const [vendorsState, updateVendorsState] = useState<VendorGroup[] | undefined>(undefined);
  const [ownedItemsHashes, updateOwnedItemsHashes] = useState<Set<number>>(new Set());
  const { manifest } = useManifest();

  useEffect(() => {
    async function getUser() {
      const linkedAccounts = await getLinkedAccounts(membership?.membershipId!);
      const mainAccount = linkedAccounts.profiles[0];
      const profile = await getProfile(membership!.membershipId, membership!.membershipType);
      const characterIds: string[] = profile.Response.characters.data
        ? Object.keys(profile.Response.characters.data)
        : [];

      updateSessionState({
        user: {
          name: mainAccount.bungieGlobalDisplayName,
          characterIds: characterIds,
        },
        membership: {
          membershipId: mainAccount.membershipId,
          membershipType: mainAccount.membershipType
        }
      });

      const ownedItems = findOwnedItems(profile, manifest!);
      if (ownedItems) updateOwnedItemsHashes(new Set(ownedItems));
    }

    // this will only run after initial log in - not after browser refresh and
    // restoring state from localStorage
    if (!user && membership) {
      console.log('effect');
      getUser();
    }
  }, [user, updateSessionState, updateOwnedItemsHashes, membership, manifest]);

  useEffect(() => {
    async function getCollections() {
      const profile = await getProfile(membership!.membershipId, membership!.membershipType);

      const ownedItems = findOwnedItems(profile, manifest!);
      updateOwnedItemsHashes(new Set(ownedItems));
    }
    console.log('effect2');
    if (user && membership && manifest) {
      getCollections();
    }
  },[user, membership, manifest, updateOwnedItemsHashes])

  useEffect(() => {
    async function getVendorData() {
      const vendorData = await getVendors(authenticatedHttpClient, {
        characterId: user?.characterIds[0]!,
        components: [
          DestinyComponentType.Vendors,
          DestinyComponentType.VendorCategories,
          DestinyComponentType.VendorSales,
          DestinyComponentType.ItemInstances,
        ],
        destinyMembershipId: membership?.membershipId!,
        membershipType: membership?.membershipType!,
      });
      const vendors = filterVendorGroups(createVendors(vendorData.Response, manifest!));
      updateVendorsState(vendors);
    }

    if (user?.characterIds && manifest) {
      getVendorData();
    }
  }, [user, membership, manifest]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Owned: {ownedItemsHashes?.size}</div>
      {
        vendorsState
          ? vendorsState.map(vendorGroup => (
            <div key={vendorGroup.name}>
              <div className="text-2xl mt-5">{vendorGroup.name}</div>
              <div>{vendorGroup.vendors.map(v => <Vendor className="mt-1" key={v.def.hash} vendor={v} ownedItemHashes={ownedItemsHashes} />)} </div>
            </div>
          ))
          : <LoadingSpinner />
      }
      <h1>Destiny 2 Vendor Watcher</h1>
    </main>
  );
}
  
export default Root;
