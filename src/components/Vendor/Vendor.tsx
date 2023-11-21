import {
  DestinyInventoryItemDefinition,
  DestinyVendorComponent,
  DestinyVendorDefinition,
} from "bungie-api-ts-no-const-enum-local/destiny2";
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

export interface D2VendorCategory {
  name: string;
  index: number;
  items: DestinyInventoryItemDefinition[]
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
        {vendor.categories.map(category => <VendorCategory key={category.index} name={category.name} items={category.items} ownedItemHashes={ownedItemHashes} />)}
      </div>
    </div>
  );
};

const VendorCategory = ({ name, items, ownedItemHashes }: Omit<D2VendorCategory, 'index'> & { ownedItemHashes: Set<number> } ) => {

  return (
    <div>
      <div>{name}</div>
      <div className="flex flex-row flex-wrap gap-3">
        {items.map((item) => <VendorItem key={item.hash} item={item} owned={ ownedItemHashes.has(item.hash) } />)}
      </div>
    </div>
  );
}

const VendorItem = ({ item, owned }: { item: D2VendorCategory['items'][0], owned: boolean}) =>(
  <div className="relative border-dashed border-2 border-sky-500">
    <img
      src={`https://bungie.net${item.displayProperties.icon}`}
      alt={item.displayProperties.name}
      className={ classNames("h-auto w-18 z-0", { "opacity-30": owned })}
    />
    {
      owned 
        ? <FontAwesomeIcon className="absolute bottom-2 end-2 z-1" icon={solid("circle-check")} style={{color: "#16d309",}} />
        : <></>
    }
  </div>
);

export default Vendor;