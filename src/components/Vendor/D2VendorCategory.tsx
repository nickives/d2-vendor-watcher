import { DestinyInventoryItemDefinition } from "bungie-api-ts-no-const-enum-local/destiny2";
import { VendorItem } from "./VendorItem";


export interface D2VendorCategory {
  name: string;
  index: number;
  items: DestinyInventoryItemDefinition[];
}

export const VendorCategory = ({ name, items, ownedItemHashes }: Omit<D2VendorCategory, 'index'> & { ownedItemHashes: Set<number>; }) => (
  <div>
    <div>{name}</div>
    <div className="flex flex-row flex-wrap gap-3">
      {items.map((item) => <VendorItem key={item.hash} item={item} owned={ownedItemHashes.has(item.hash)} />)}
    </div>
  </div>
);
