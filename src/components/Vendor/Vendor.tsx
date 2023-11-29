import {
  DestinyVendorComponent,
  DestinyVendorDefinition,
} from "bungie-api-ts-no-const-enum-local/destiny2";
import classNames from 'classnames';
import { D2VendorCategory, VendorCategory } from "./D2VendorCategory";

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
        {vendor.categories.map(category =>
          <VendorCategory
            key={category.index}
            name={category.name}
            items={category.items}
            ownedItemHashes={ownedItemHashes}
          />)}
      </div>
    </div>
  );
};

export default Vendor;