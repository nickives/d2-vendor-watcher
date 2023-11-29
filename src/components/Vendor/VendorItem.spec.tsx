import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { DestinyInventoryItemDefinition } from 'bungie-api-ts-no-const-enum-local/destiny2';
import { VendorItem } from './VendorItem';
import importedItem from './vendorItem.json';

// this is from a real request, and the actual API doesn't behave exactly as typed...
const item = importedItem as unknown as DestinyInventoryItemDefinition;

describe('VendorItem is unowned', () => {
  const component = <VendorItem item={item} owned={false} />;
  test('Renders correctly', () => {
    render(component);
    const iconElement = screen.getByAltText(item.displayProperties.name);
    expect(iconElement).toBeInTheDocument();
  });
  test('Does not render checkmark', () => {
    render(component);
    const checkmarkElement = screen.queryByTitle('Owned');
    expect(checkmarkElement).toBeNull();
  });
  test('Opacity is not defined', () => {
    render(component);
    const iconElement = screen.getByAltText(item.displayProperties.name);
    expect(iconElement.classList).not.toContain('opacity-30');
  });
});

describe('VendorItem is owned', () => {
  const component = <VendorItem item={item} owned={true} />;
  test('Renders correctly', () => {
    render(component);
    const iconElement = screen.getByAltText(item.displayProperties.name);
    expect(iconElement).toBeInTheDocument();
  });
  test('Renders checkmark', () => {
    render(component);
    const checkmarkElement = screen.queryByTitle('Owned');
    expect(checkmarkElement).toBeInTheDocument();
  });
  test('Has opacity-30 class', () => {
    render(component);
    const iconElement = screen.getByAltText(item.displayProperties.name);
    expect(iconElement.classList).toContain('opacity-30');
  });
});