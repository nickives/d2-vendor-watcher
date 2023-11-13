import React, { useEffect, useState } from "react";
import {
  getProfile,
  getVendors,
  DestinyComponentType
} from "bungie-api-ts-no-const-enum-local/destiny2";
import { authenticatedHttpClient } from "../lib/bungie-api/bungie-service-helper";
import { useSession } from "../components/SessionContext/SessionContext";
import { getLinkedAccounts } from "../lib/bungie-api/destiny2-api";
import Vendor from "../components/Vendor/Vendor";
import { VendorGroup, createVendors } from "../components/Vendor/createVendor";
import { useManifest } from "../components/ManifestContext/ManifestContext";
import { filterVendorGroups } from "../components/Vendor/filterVendors";

const Root = (): React.ReactElement => {
  const {user, membership, updateSessionState} = useSession();
  const [vendorsState, updateVendorsState] = useState<VendorGroup[]>([]);
  const { manifest } = useManifest();

  useEffect(() => {
    async function getUser() {
      const linkedAccounts = await getLinkedAccounts(membership?.membershipId!);
      const mainAccount = linkedAccounts.profiles[0];
      const profile = await getProfile(authenticatedHttpClient, {
        destinyMembershipId: mainAccount.membershipId,
        membershipType: mainAccount.membershipType,
        components: [DestinyComponentType.Characters]
      });
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
    }
    // const tokens = localStorage.getItem('authorization');
    if (!user && membership) {
      getUser();
    }
  }, [user, updateSessionState, membership]);

  useEffect(() => {
    async function getVendorData() {
      // const manifest = await getManifest();
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
      {
        vendorsState.map(vendorGroup => (
          <div>
            <div className="text-2xl">{vendorGroup.name}</div>
            <div>{vendorGroup.vendors.map(v => <Vendor className="mt-5" key={v.def.hash} vendor={v} ownedItemHashes={new Set()} />)} </div>
          </div>
        ))
      }
      <h1>Destiny 2 Vendor Watcher</h1>
    </main>
  );
}
  
export default Root;
