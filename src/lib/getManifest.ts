import {
  HttpClient,
  getDestinyManifest,
  getDestinyManifestSlice
} from "bungie-api-ts-no-const-enum-local/destiny2";

export type VwManifest = Awaited<ReturnType<typeof getManifest>>;

export async function getManifest($http: HttpClient) {
  const destinyManifest = (await getDestinyManifest($http)).Response;
  return getDestinyManifestSlice($http, {
    destinyManifest,
    tableNames: [
      'DestinyCollectibleDefinition',
      'DestinyInventoryItemDefinition',
      'DestinyItemCategoryDefinition',
      'DestinyPresentationNodeDefinition',
      'DestinyVendorDefinition',
      'DestinyVendorGroupDefinition',
    ],
    language: 'en'
  });
}