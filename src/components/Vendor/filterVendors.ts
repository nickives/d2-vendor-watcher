import { DestinyItemSubType, DestinyItemType } from "bungie-api-ts-no-const-enum-local/destiny2";
import { VwManifest } from "../../lib/getManifest";
import { VendorGroup } from "./createVendor";
import { D2Vendor, D2VendorCategory } from "./Vendor";

export function filterVendorGroups(vendorGroups: VendorGroup[]): VendorGroup[] {
  return vendorGroups.map(group => {
    const filteredVendors: D2Vendor[] = group.vendors.map(vendor => {
      const filteredCategories: D2VendorCategory[] = vendor.categories.map(
        vendorCategory => {
          const filteredItems = vendorCategory.items.filter(
            (i) => i.itemType === DestinyItemType.Armor
              || i.itemType === DestinyItemType.Weapon
              || i.itemType === DestinyItemType.Emblem
              || i.itemType === DestinyItemType.Ship
              || i.itemType === DestinyItemType.Vehicle
              || i.itemType === DestinyItemType.Emote
              || i.itemType === DestinyItemType.Ghost
              || i.itemType === DestinyItemType.Finisher
              || i.itemSubType === DestinyItemSubType.Shader
          );

          return filteredItems.length > 0
            ? {
              name: vendorCategory.name,
              index: vendorCategory.index,
              items: filteredItems,
            }
            : undefined;
        }).filter((x): x is D2VendorCategory => !!x);

      return filteredCategories.length > 0
        ? {
          component: vendor.component,
          categories: filteredCategories,
          def: vendor.def,
        }
        : undefined;
    }).filter((x): x is D2Vendor => !!x);
    
    return filteredVendors.length > 0 
      ? {
        name: group.name,
        vendors: filteredVendors,
      }
      : undefined;
  }).filter((x): x is VendorGroup => !!x);
}