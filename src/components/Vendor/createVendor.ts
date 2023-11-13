import { DestinyVendorsResponse } from "bungie-api-ts-no-const-enum-local/destiny2";
import { D2Vendor } from './Vendor';
import { VwManifest } from "../../lib/getManifest";

export interface VendorGroup {
  name: string;
  vendors: D2Vendor[];
}

export function createVendors(vendorsResponse: DestinyVendorsResponse, manifest: VwManifest): VendorGroup[] {
  const vendorGroups = vendorsResponse.vendorGroups.data?.groups;
  const vendorDict = vendorsResponse.vendors.data;
  if (!vendorDict) throw Error('missing vendors!');

  const vendors: VendorGroup[] | undefined = vendorGroups?.map(group => {
    const vendorsForThisGroup: D2Vendor[] = group.vendorHashes
      .map(vendorHash => {
        const vendorComponent = vendorDict[vendorHash];
        const vendorDef = manifest.DestinyVendorDefinition[vendorHash];
        
        const saleItems =  vendorsResponse.sales
          .data?.[vendorHash]
          .saleItems;
        
        const vendorCategories = vendorsResponse.categories
          .data?.[vendorHash]
          .categories;

        const categories: D2Vendor['categories'] = vendorCategories && saleItems
          ? vendorCategories
            .map((vendorCategory) => {
              const items = vendorCategory.itemIndexes
                .map((index) => 
                  manifest.DestinyInventoryItemDefinition[saleItems[index].itemHash]
                );

              return {
                name: vendorDef.displayCategories[vendorCategory.displayCategoryIndex].displayProperties.name,
                index: vendorCategory.displayCategoryIndex,
                items: items
              }})
          : [];

        return {
          component: vendorComponent,
          def: vendorDef,
          categories: categories,
        }
      });

    return {
      name: manifest['DestinyVendorGroupDefinition'][group.vendorGroupHash].categoryName,
      vendors: vendorsForThisGroup || []
    }
  })

  return vendors || [];
}
