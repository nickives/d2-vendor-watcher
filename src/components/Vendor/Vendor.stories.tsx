import type { Meta, StoryObj } from '@storybook/react';
import Vendor, { D2Vendor } from './Vendor';
import { testVendor } from './testVendor';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'App/Vendor',
  component: Vendor,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof Vendor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    vendor: testVendor,
    ownedItemHashes: new Set()
  }
};
