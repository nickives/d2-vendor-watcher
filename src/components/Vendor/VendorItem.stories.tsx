import type { Meta, StoryObj } from '@storybook/react';
import { VendorItem } from "./VendorItem";
import { DestinyInventoryItemDefinition } from 'bungie-api-ts-no-const-enum-local/destiny2';
import importedItem from './vendorItem.json';

// this is from a real request, and the actual API doesn't behave exactly as typed...
const item = importedItem as unknown as DestinyInventoryItemDefinition;

const meta = {
  title: 'App/Vendor/VendorItem',
  component: VendorItem,
  parameters: {

    layout: 'centered',
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    owned: { control: 'boolean' },
    item: { control: 'object' },
  },
} satisfies Meta<typeof VendorItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unowned: Story = {
  args: {
    item: item,
    owned: false,
  },
};

export const Owned: Story = {
  args: {
    item: item,
    owned: true,
  },
};