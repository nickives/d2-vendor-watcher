import type { Meta, StoryObj } from '@storybook/react';
import Vendor, { ID2Vendor } from './Vendor';
import testVendorImport from './testVendor.json';
const testVendor = testVendorImport as unknown as ID2Vendor;
const ownedItemHashes = new Set<number>()
  .add(1012434138)
  .add(2609397864)
  .add(1781477733)

const meta = {
  title: 'App/Vendor',
  component: Vendor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Vendor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    vendor: testVendor,
    ownedItemHashes: ownedItemHashes,
    allVendors: []
  }
};
