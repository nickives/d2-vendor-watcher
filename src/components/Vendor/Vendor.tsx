import {
  DestinyInventoryItemDefinition,
  DestinyVendorComponent,
  DestinyVendorDefinition,
} from "bungie-api-ts-no-const-enum-local/destiny2";
import classNames from 'classnames';

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
  <div className="border-dashed border-2 border-sky-500">
    {
      owned
        ? <div>OWNED</div>
        : <div>NOT OWNED</div>
    }
    <img src={`https://bungie.net${item.displayProperties.icon}`} alt={item.displayProperties.name}/>
    <div>{item.hash}</div>
    <div>{item.collectibleHash}</div>
  </div>
);

export default Vendor;