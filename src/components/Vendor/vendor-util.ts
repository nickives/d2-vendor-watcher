import { DestinyVendorComponent, DestinyVendorDefinition, DestinyVendorSaleItemComponent, DestinyVendorCategory, DestinyVendorsResponse, DestinyVendorGroup, DestinyInventoryItemDefinition, DestinyItemSubType, DestinyItemType } from "bungie-api-ts-no-const-enum-local/destiny2";
import { VwManifest } from "../../lib/getManifest";
import { D2Vendor, D2VendorCategory, ID2Vendor, ID2VendorCategory } from "./Vendor";
import focusingItemOutputs from "../../lib/focusing-item-outputs.json";


export interface VendorGroup {
  name: string;
  vendors: ID2Vendor[];
}

export function createVendor(
  vendorComponent: DestinyVendorComponent,
  vendorDef: DestinyVendorDefinition,
  manifest: VwManifest,
  saleItems?: { [key: number]: DestinyVendorSaleItemComponent; },
  vendorCategories?: DestinyVendorCategory[]
): ID2Vendor {
  const categories: ID2Vendor['categories'] = vendorCategories && saleItems
    ? vendorCategories
      .map((vendorCategory) => {
        const items = vendorCategory.itemIndexes
          .map((index) => manifest.DestinyInventoryItemDefinition[saleItems[index].itemHash]
          );
        return new D2VendorCategory(
          vendorDef.displayCategories[vendorCategory.displayCategoryIndex].displayProperties.name,
          vendorCategory.displayCategoryIndex,
          items
        );
      })
    : [];

  return new D2Vendor(vendorComponent, vendorDef,categories);
}


/**
 * BIG TODO: GO BACK TO SQUARE 1(ish) -- DONE
 *
 * We need to start out by just constructing all the vendors. THEN we can group them and easily attach child vendors to
 * their parents (e.g. focused decoding)
 * 
 * NEXT BIG TODO: WE HAVE TO FIGURE OUT IF CHILD VENDORS ARE EMPTY ***BEFORE*** PARENTS!
 * Currently we're constructing all vendors, and then filtering sub vendors out of their parents if said child is empty.
 * However, this is broken for ability vendors that form nested trees of sub vendors.
 * 
 * To resolve this, we probably have to build tree and resolve the emptiness from the deepest children nodes back up to the root parent
 */

export function processVendorsResponse(vendorsResponse: DestinyVendorsResponse, manifest: VwManifest): Parameters<typeof createVendor>[] {
  const vendorDict = vendorsResponse.vendors.data;
  if (!vendorDict) throw Error('missing vendors!');
  return Object.values(vendorDict).map((v) => {
    const vendorComponent = vendorDict[v.vendorHash];
    const vendorDef = manifest.DestinyVendorDefinition[v.vendorHash];
    const saleItems = vendorsResponse.sales
      .data?.[v.vendorHash]
      .saleItems;

    const vendorCategories = vendorsResponse.categories
      .data?.[v.vendorHash]
      .categories;

    return [vendorComponent, vendorDef, manifest, saleItems, vendorCategories];
  });
}

export function createVendorGroups(groups: DestinyVendorGroup[], vendors: ID2Vendor[], manifest: VwManifest): VendorGroup[] {
  return groups.map(group => ({
    name: manifest['DestinyVendorGroupDefinition'][group.vendorGroupHash].categoryName,
    vendors: vendors.filter(v => group.vendorHashes.includes(v.def.hash))
  })) || [];
}

export function filterVendorItems(vendor: ID2Vendor): ID2Vendor {
  // there's no tidy way to distinguish these from focusing engrams, so we just have to know all the hashes
  const focusingItems = new Set(Object.keys(focusingItemOutputs));
  const filteredCategories: ID2VendorCategory[] = vendor.categories.map(
    vendorCategory => {
      const filteredItems: DestinyInventoryItemDefinition[] = vendorCategory.items.filter(
        (i) => i.itemType === DestinyItemType.Armor
          || i.itemType === DestinyItemType.Weapon
          || i.itemType === DestinyItemType.Emblem
          || i.itemType === DestinyItemType.Ship
          || i.itemType === DestinyItemType.Vehicle
          || i.itemType === DestinyItemType.Emote
          || i.itemType === DestinyItemType.Ghost
          || i.itemType === DestinyItemType.Finisher
          // || i.itemType === DestinyItemType.Mod // abilities, but also ornaments? Investigate way to distinguish
          || i.itemSubType === DestinyItemSubType.Shader
          || focusingItems.has(i.hash.toString())
          || i.uiItemDisplayStyle === 'ui_display_style_set_container');

      return new D2VendorCategory(vendorCategory.name, vendorCategory.index, filteredItems);
    });

  return new D2Vendor(vendor.component, vendor.def, filteredCategories);
}

export function filterVendorGroups(vendorGroups: VendorGroup[]): VendorGroup[] {
  return vendorGroups.filter(group => group.vendors.length > 0);
}

export function filterSubVendors(vendor: ID2Vendor, allVendors: ID2Vendor[]): ID2Vendor {
  const filteredCategories = vendor.categories.map(category => {
    const filteredItems = category.items.filter(item => {
      // ignore regular items
      if (item.uiItemDisplayStyle !== 'ui_display_style_set_container') {
        return true;
      }
      const subVendor = allVendors
        .find(v => v.def.hash === item.preview?.previewVendorHash);
      if (!subVendor) return false;
      if (item.preview?.previewVendorHash === 3529215660) {
        console.log(`found 3529215660 isEmpty ${subVendor.isEmpty()}`);
      }
      return !subVendor.isEmpty();
    });
    return new D2VendorCategory(category.name, category.index, filteredItems);
  });
  return new D2Vendor(vendor.component, vendor.def, filteredCategories);
}

