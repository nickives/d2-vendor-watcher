import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { D2VendorCategory } from "./Vendor";


export const VendorItem = ({ item, owned }: { item: D2VendorCategory['items'][0]; owned: boolean; }) => (
  <div className="relative border-dashed border-2 border-sky-500">
    <img
      src={`https://bungie.net${item.displayProperties.icon}`}
      alt={item.displayProperties.name}
      className={classNames("h-auto w-18 z-0", { "opacity-30": owned })} />
    {owned
      ? <FontAwesomeIcon 
        className="absolute bottom-2 end-2 z-1"
        icon={solid("circle-check")}
        style={{ color: "#16d309", }}
        title='Owned'
      />
      : <></>}
  </div>
);
