import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SaltAgGrid } from '../SaltAgGrid';
import { SaltProvider } from '@salt-ds/core';
import { AgGridReactProps } from 'ag-grid-react';

// Mock AG Grid's core functionality to simplify testing and avoid heavy rendering.
// We are interested in how SaltAgGrid interacts with its props, not testing AG Grid itself.
const mockSetGridOption = jest.fn();
const mockSetColumnDefs = jest.fn();

jest.mock('ag-grid-react', () => ({
  AgGridReact: jest.fn((props: AgGridReactProps) => {
    // Call onGridReady with a mock API to allow testing of gridApi interactions
    if (props.onGridReady && typeof props.onGridReady === 'function') {
      const mockGridApi = {
        setGridOption: mockSetGridOption,
        setColumnDefs: mockSetColumnDefs, // Mock this to check if column defs are updated
        // Add other Grid API methods if needed for tests
      };
      props.onGridReady({ api: mockGridApi, columnApi: {} as any } as any);
    }

    // Store columnDefs for inspection
    (global as any).mockAgGridColumnDefs = props.columnDefs;

    return (
      <div data-testid="mock-ag-grid">
        <div className="ag-root-wrapper">Mock AG Grid Content</div>
        {/* Render column names to help with debugging or very basic validation */}
        {props.columnDefs?.map((col: any, index: number) => (
          <div key={index} data-testid={`col-${col.field}`}>{col.headerName}</div>
        ))}
      </div>
    );
  }),
}));


describe('SaltAgGrid', () => {
  const renderComponent = () =>
    render(
      <SaltProvider>
        <SaltAgGrid />
      </SaltProvider>
    );

  beforeEach(() => {
    // Reset mocks before each test
    mockSetGridOption.mockClear();
    mockSetColumnDefs.mockClear();
    (global as any).mockAgGridColumnDefs = undefined;
  });

  test('renders correctly with initial controls', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Search across all columns...')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: /group by make/i })).toBeInTheDocument();
    expect(screen.getByTestId('mock-ag-grid')).toBeInTheDocument();
    expect(document.querySelector('.ag-root-wrapper')).toBeInTheDocument(); // Check for AG Grid presence
  });

  test('search input updates value and calls setGridOption', async () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText('Search across all columns...') as HTMLInputElement;
    
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });
    expect(searchInput.value).toBe('Toyota');

    // Wait for the useEffect in SaltAgGrid to trigger setGridOption
    await waitFor(() => {
      expect(mockSetGridOption).toHaveBeenCalledWith('quickFilterText', 'Toyota');
    });
  });

  test('group by make switch toggles grouping state and updates columnDefs', async () => {
    renderComponent();
    const groupBySwitch = screen.getByRole('switch', { name: /group by make/i });

    // Check initial column defs (Make is not grouped)
    let makeColumn = (global as any).mockAgGridColumnDefs.find((col: any) => col.field === 'make');
    expect(makeColumn.rowGroup).toBeUndefined();
    expect(makeColumn.hide).toBeUndefined();

    // Click to group
    fireEvent.click(groupBySwitch);

    await waitFor(() => {
      // Check that AgGridReact received updated columnDefs
      makeColumn = (global as any).mockAgGridColumnDefs.find((col: any) => col.field === 'make');
      expect(makeColumn.rowGroup).toBe(true);
      expect(makeColumn.hide).toBe(true);
      // Also check if gridApi.setColumnDefs was called (new behavior in SaltAgGrid)
      expect(mockSetColumnDefs).toHaveBeenCalled(); 
    });
    
    // Ensure the switch itself has changed its checked state
    expect(groupBySwitch).toBeChecked();

    // Click to ungroup
    fireEvent.click(groupBySwitch);

    await waitFor(() => {
      makeColumn = (global as any).mockAgGridColumnDefs.find((col: any) => col.field === 'make');
      expect(makeColumn.rowGroup).toBe(false);
      expect(makeColumn.hide).toBe(false);
      expect(mockSetColumnDefs).toHaveBeenCalledTimes(2); // Called again for ungrouping
    });
    expect(groupBySwitch).not.toBeChecked();
  });

  test('renders initial columns correctly', () => {
    renderComponent();
    expect(screen.getByTestId('col-make')).toHaveTextContent('Make');
    expect(screen.getByTestId('col-model')).toHaveTextContent('Model');
    expect(screen.getByTestId('col-price')).toHaveTextContent('Price');
    expect(screen.getByTestId('col-year')).toHaveTextContent('Year');
    expect(screen.getByTestId('col-color')).toHaveTextContent('Color');
  });
});
