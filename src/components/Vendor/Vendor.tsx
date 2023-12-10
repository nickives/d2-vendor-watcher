import {
  DestinyInventoryItemDefinition,
  DestinyVendorComponent,
  DestinyVendorDefinition,
} from "bungie-api-ts-no-const-enum-local/destiny2";
import classNames from 'classnames';
import { VendorItem } from "./VendorItem";
import React from "react";

export interface ID2VendorCategory {
  name: string;
  index: number;
  items: DestinyInventoryItemDefinition[];
  isEmpty: () => boolean;
}

export class D2VendorCategory implements ID2VendorCategory {
  public name: string;
  public index: number;
  public items: DestinyInventoryItemDefinition[];
  constructor(name: string, index: number, items: DestinyInventoryItemDefinition[]) {
    this.name = name;
    this.index = index;
    this.items = items;
  }
  public isEmpty = () => this.items.length === 0;
}
export interface ID2Vendor {
  component: DestinyVendorComponent;
  def: DestinyVendorDefinition;
  categories: ID2VendorCategory[];
  isEmpty: () => boolean;
}

export class D2Vendor implements ID2Vendor {
  public component: DestinyVendorComponent;
  public def: DestinyVendorDefinition;
  public categories: ID2VendorCategory[];
  constructor(component: DestinyVendorComponent, def: DestinyVendorDefinition, categories: ID2VendorCategory[]) {
    this.component = component;
    this.def = def;
    this.categories = categories;
  }
  public isEmpty = () => this.categories.every(category => category.isEmpty());
}

const Vendor = ({
  vendor,
  allVendors,
  ownedItemHashes,
  className,
}: {
  vendor: ID2Vendor;
  allVendors: ID2Vendor[];
  ownedItemHashes: Set<number>;
  className?: string;
}): React.ReactElement => {
  return (
    <div className={classNames(className, "text-white bg-black border-solid border-2 border-sky-500 pl-5 pr-5 pb-2")}>
      <div>
        Vendor: {vendor.def.displayProperties.name} hash: {vendor.def.hash} isEmpty: {vendor.isEmpty() ? 'true' : 'false'}
      </div>
      <div className="flex flex-wrap gap-3">
        {vendor.categories.filter(category => !category.isEmpty()).map(category => (
          <VendorCategory
            key={category.index}
            category={category}
            allVendors={allVendors}
            ownedItemHashes={ownedItemHashes}
            className={className}
          />
        ))}
      </div>
    </div>
  );
};

const VendorCategory = (
  {category, allVendors, ownedItemHashes, className}: {
    category: ID2VendorCategory;
    allVendors: ID2Vendor[];
    ownedItemHashes: Set<number>;
    className?: string;
  }
): React.ReactElement => {
  return (
    <div>
      <div id={`category-name-${category.index}`}>
        {category.name} isEmpty: {category.isEmpty() ? 'true' : 'false'} items.length: {category.items.length} items[0]: {category.items[0].displayProperties.name}
      </div>
      <div className="flex flex-row flex-wrap gap-3" aria-labelledby={`category-name-${category.index}`}>
        {category.items.flatMap((item) => {
          if (item.uiItemDisplayStyle === 'ui_display_style_set_container') {
            const vendor = allVendors.find(v => v.def.hash === item.preview?.previewVendorHash);
            if (!vendor) return [];
            return <Vendor
              key={item.hash}
              vendor={vendor}
              allVendors={allVendors}
              ownedItemHashes={ownedItemHashes}
              className={className}
            />;
          }
          return <VendorItem
            key={item.hash}
            item={item}
            owned={ownedItemHashes.has(item.hash)}
          />;
        }
        )}
      </div>
    </div>
  );
};

export default Vendor;