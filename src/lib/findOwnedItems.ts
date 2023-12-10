import {
  ServerResponse,
  DestinyProfileResponse,
  DestinyCollectibleState
} from "bungie-api-ts-no-const-enum-local/destiny2";
import { VwManifest } from "./getManifest";
import focusingItemOutputs from './focusing-item-outputs.json';

export function findOwnedItems(response: ServerResponse<DestinyProfileResponse>, manifest: VwManifest): Set<number> {
  // put all the collectibles from characters together
  const characterCollectablesDict = response.Response.characterCollectibles.data;
  const collectableComponents = characterCollectablesDict
    ? Object.values(characterCollectablesDict).map(c => c.collectibles)
    : [];
  // add on profile wide collectables
  const profileCollectables = response.Response.profileCollectibles.data?.collectibles;
  if (profileCollectables) collectableComponents.push(profileCollectables);
  const ownedItems = new Set(collectableComponents.flatMap(c => Object.entries(c)
    .filter(entry => {
      return !(entry[1].state & DestinyCollectibleState.NotAcquired);
    })
    .map(entry => {
      // we know this conversion is safe, because the input key from collectibles is a number
      const itemHash = manifest['DestinyCollectibleDefinition'][entry[0] as unknown as number].itemHash;
      return itemHash;
    })
  ));
  Object.entries(focusingItemOutputs).forEach(entry => {
    if (ownedItems.has(entry[1])) {
      // console.log(`focused! 0: ${entry[0]} 1: ${entry[1]}`);
      ownedItems.add(parseInt(entry[0]));
    }
  });
  return ownedItems;
}
