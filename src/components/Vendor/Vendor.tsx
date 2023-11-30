import {
  DestinyInventoryItemDefinition,
  DestinyVendorComponent,
  DestinyVendorDefinition,
} from "bungie-api-ts-no-const-enum-local/destiny2";
import classNames from 'classnames';
import { VendorItem } from "./VendorItem";

export interface D2VendorCategory {
  name: string;
  index: number;
  items: DestinyInventoryItemDefinition[];
}

export interface D2Vendor {
  component: DestinyVendorComponent;
  def: DestinyVendorDefinition;
  categories: D2VendorCategory[];
}

const Vendor = ({
  vendor,
  ownedItemHashes,
  className,
}: {
  vendor: D2Vendor;
  ownedItemHashes: Set<number>;
  className?: string;
}): React.ReactElement => {
  return (
    <div className={classNames(className, "text-white bg-black border-solid border-2 border-sky-500 pl-5 pr-5 pb-2")}>
      <div>
        Vendor: {vendor.def.displayProperties.name}
      </div>
      <div className="flex flex-wrap gap-3">
        {vendor.categories.map(category => (
          <div key={category.index}>
            <div id={`category-name-${category.index}`}>{category.name}</div>
            <div className="flex flex-row flex-wrap gap-3" aria-labelledby={`category-name-${category.index}`}>
              {category.items.map((item) =>
                <VendorItem key={item.hash} item={item} owned={ownedItemHashes.has(item.hash)} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vendor;