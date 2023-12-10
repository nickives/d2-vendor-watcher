import { render, screen, within } from '@testing-library/react';
import Vendor, { ID2Vendor } from './Vendor';
import testVendorImport from './testVendor.json';
const testVendor = testVendorImport as unknown as ID2Vendor;
const ownedItemHashes = new Set<number>()
  .add(1012434138)
  .add(2609397864)
  .add(1781477733);

describe('Vendor renders', () => {
  const component = <Vendor vendor={testVendor} ownedItemHashes={ownedItemHashes} allVendors={[]} />;
  test('Displays name once', () => {
    render(component);
    const nameElement = screen.getByText(new RegExp(testVendor.def.displayProperties.name, "i"));
    expect(nameElement).toBeInTheDocument();
  });
  test.each(testVendor.categories)('Displays each category name once', (category) => {
    render(component);
    const categoryNameElement = screen.getByText(new RegExp(category.name, "i"));
    expect(categoryNameElement).toBeInTheDocument();
  });
  test.each(testVendor.categories)('Displays correct number of items', (category) => {
    render(component);
    const categoryIconsElement = screen.getByLabelText(new RegExp(category.name, "i"));
    // get icon images, excluding 'owned' check marks
    const iconElements = within(categoryIconsElement)
      .getAllByRole('img', {name: (text) => !new RegExp('owned', 'i').test(text)});
    expect(iconElements.length).toEqual(category.items.length);
  });
  test.each(testVendor.categories)('Displays one tick for each owned item', (category) => {
    render(component);
    const categoryIconsElement = screen.getByLabelText(new RegExp(category.name, "i"));
    // get 'owned' check marks, excluding icon images
    const iconElements = within(categoryIconsElement).getAllByRole('img', {name: /owned/i});
    expect(iconElements.length).toEqual(ownedItemHashes.size);
  });
});