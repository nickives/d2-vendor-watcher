import React, { useEffect, useState } from "react";
import {
  getProfile as getProfileApi,
  getVendors,
  DestinyComponentType,
  BungieMembershipType,
} from "bungie-api-ts-no-const-enum-local/destiny2";
import { authenticatedHttpClient } from "../lib/bungie-api/bungie-service-helper";
import { useSession } from "../components/SessionContext/SessionContext";
import { getLinkedAccounts } from "../lib/bungie-api/destiny2-api";
import Vendor, { ID2Vendor } from "../components/Vendor/Vendor";
import { VendorGroup, createVendor, createVendorGroups, filterSubVendors, processVendorsResponse } from "../components/Vendor/vendor-util";
import { useManifest } from "../components/ManifestContext/ManifestContext";
import { filterVendorGroups, filterVendorItems } from "../components/Vendor/vendor-util";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { findOwnedItems } from "../lib/findOwnedItems";

async function getProfile(membershipId: string, membershipType: BungieMembershipType) {
  return getProfileApi(authenticatedHttpClient, {
    destinyMembershipId: membershipId,
    membershipType: membershipType,
    components: [DestinyComponentType.Characters, DestinyComponentType.Collectibles]
  });
}

const Root = (): React.ReactElement => {
  const {user, membership, updateSessionState} = useSession();
  const [vendorGroups, updateVendorGroups] = useState<VendorGroup[]>([]);
  const [allVendors, updateAllVendors] = useState<ID2Vendor[]>([]);
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
      getUser();
    }
  }, [user, updateSessionState, updateOwnedItemsHashes, membership, manifest]);

  useEffect(() => {
    async function getCollections() {
      const profile = await getProfile(membership!.membershipId, membership!.membershipType);
      const ownedItems = findOwnedItems(profile, manifest!);
      updateOwnedItemsHashes(ownedItems);
      // console.log(`ownedItem.has(1950526212): ${ownedItems.has(1950526212)}`);
    }
    if (user && membership && manifest) {
      getCollections();
    }
  },[user, membership, manifest, updateOwnedItemsHashes])

  useEffect(() => {
    async function getVendorData() {
      const data = await getVendors(authenticatedHttpClient, {
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
      const vendors = processVendorsResponse(data.Response, manifest!)
        .map(vendorArgs => createVendor(...vendorArgs))
        .map(filterVendorItems)
        .filter(v => !v.isEmpty())
        .map((vendor, _, array) => filterSubVendors(vendor, array));
  
      updateAllVendors(vendors);
      
      const groups = data.Response.vendorGroups.data?.groups;
      if (!groups) throw new Error("Missing vendor groups from response");
      const filteredVendors = filterVendorGroups(createVendorGroups(groups, vendors, manifest!));
      updateVendorGroups(filteredVendors);
    }

    if (user?.characterIds && manifest) {
      getVendorData();
    }
  }, [user, membership, manifest]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Owned: {ownedItemsHashes?.size}</div>
      {
        vendorGroups.length !== 0
          ? vendorGroups.map(vendorGroup => (
            <div key={vendorGroup.name}>
              <div className="text-2xl mt-5">{vendorGroup.name}</div>
              <div>{vendorGroup.vendors.filter(v => !v.isEmpty()).map(v =>
                <Vendor
                  className="mt-1"
                  key={v.def.hash}
                  vendor={v}
                  allVendors={allVendors}
                  ownedItemHashes={ownedItemsHashes}
                />
              )} </div>
            </div>
          ))
          : <LoadingSpinner />
      }
      <h1>Destiny 2 Vendor Watcher</h1>
    </main>
  );
}
  
export default Root;
