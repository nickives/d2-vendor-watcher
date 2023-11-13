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
  ownedItemHashes?: Set<number>;
  className?: string;
}): React.ReactElement => {
  return (
    <div className={classNames(className, "text-white bg-black border-solid border-2 border-sky-500")}>
      <div>
        Vendor: {vendor.def.displayProperties.name}
      </div>
      <div className="flex space-x-5 flex-wrap">
        {vendor.categories.map(category => <VendorCategory key={category.index} name={category.name} items={category.items} />)}
      </div>
    </div>
  );
};

const VendorCategory = ({ name, items }: Omit<D2VendorCategory, 'index'>  ) => {

  return (
    <div>
      <div>{name}</div>
      <div className="flex flex-row flex-wrap gap-3">{items.map((item) => <VendorItem key={item.hash} item={item} />)}</div>
    </div>
  );
}

const VendorItem = ({ item }: { item: D2VendorCategory['items'][0]}) =>(
  <div className="border-dashed border-2 border-sky-500">
    <img src={`https://bungie.net${item.displayProperties.icon}`} alt={item.displayProperties.name}/>
  </div>
);

export default Vendor;