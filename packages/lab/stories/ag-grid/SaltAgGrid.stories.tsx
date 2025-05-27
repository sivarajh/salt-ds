import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { SaltAgGrid } from '@salt-ds/lab'; // Assuming SaltAgGrid is exported from the root of @salt-ds/lab

export default {
  title: 'Lab/AG Grid/SaltAgGrid',
  component: SaltAgGrid,
  argTypes: {
    // Example of how to document props if needed, though SaltAgGridProps are extensive
    // rowData: { control: 'object' },
    // columnDefs: { control: 'object' },
    // defaultColDef: { control: 'object' },
    // You might not want to expose all AG Grid props directly in Storybook controls
    // as they can be very complex. Focus on custom props if any, or key examples.
  },
} as Meta<typeof SaltAgGrid>;

const Template: StoryFn<typeof SaltAgGrid> = (args) => (
  <div style={{ 
    height: 'calc(100vh - 40px)', // Use viewport height minus some padding
    width: '100%', 
    padding: '20px', // Add some padding around the grid
    boxSizing: 'border-box'
  }}>
    {/* The SaltAgGrid component itself has internal styling for height/width */}
    {/* So we ensure its parent div provides a bounded area. */}
    <SaltAgGrid {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  // No specific args needed here if the component's internal defaults are sufficient for a demo.
  // If `SaltAgGrid` expected certain props for basic operation, they would go here.
  // For example, if rowData or columnDefs were not defaulted internally:
  // rowData: [
  //   { make: "Toyota", model: "Celica", price: 35000, year: 2003, color: "Red" },
  //   { make: "Ford", model: "Mondeo", price: 32000, year: 2019, color: "Blue" },
  // ],
  // columnDefs: [
  //   { field: "make" }, { field: "model" }, { field: "price" }, { field: "year" }, { field: "color" }
  // ]
};

export const WithPredefinedSearch = Template.bind({});
WithPredefinedSearch.args = {
  // Demonstrating how one might pass initial state or config if the component supported it via props
  // Note: SaltAgGrid currently handles search via internal state.
  // This story is more conceptual unless SaltAgGrid is modified to accept initialSearchText prop.
  // For now, this will render the same as Default, but serves as a placeholder for future enhancements.
};
WithPredefinedSearch.parameters = {
  docs: {
    description: {
      story: 'Demonstrates the grid with a (conceptual) predefined search. Currently, search is internal. This story shows the default state.',
    },
  },
};

export const InitiallyGrouped = Template.bind({});
InitiallyGrouped.args = {
  // As with search, grouping is internal. If we wanted to control initial grouping via props,
  // SaltAgGrid would need e.g. `initialIsGroupedByMake={true}`.
  // This story shows the default state.
};
InitiallyGrouped.parameters = {
  docs: {
    description: {
      story: 'Demonstrates the grid with (conceptual) initial grouping. Currently, grouping is toggled internally. This story shows the default state.',
    },
  },
};
