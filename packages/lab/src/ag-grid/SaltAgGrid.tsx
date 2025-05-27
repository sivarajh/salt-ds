import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional theme (though Salt theme is primary)
import '@salt-ds/ag-grid-theme/salt-ag-theme.css';
import { Input, Button, FlexLayout, Switch } from '@salt-ds/core';

// Row Data Interface
interface IRow {
  make: string;
  model: string;
  price: number;
  year: number;
  color: string;
}

// Initial Column Definitions
const initialColumnDefs: ColDef<IRow>[] = [
  { field: 'make', headerName: 'Make', filter: 'agTextColumnFilter' },
  { field: 'model', headerName: 'Model', filter: 'agTextColumnFilter' },
  { 
    field: 'price', 
    headerName: 'Price', 
    valueFormatter: (params: any) => '$' + params.value.toLocaleString(),
    filter: 'agNumberColumnFilter' 
  },
  { field: 'year', headerName: 'Year', filter: 'agNumberColumnFilter' },
  { field: 'color', headerName: 'Color', filter: 'agTextColumnFilter' },
];

const defaultColDef: ColDef = {
  flex: 1,
  minWidth: 150, // Increased minWidth for better readability
  sortable: true,
  filter: true, // Default filter enabled for all columns
  resizable: true,
};

export const SaltAgGrid: React.FC<AgGridReactProps<IRow>> = (props) => {
  const [gridApi, setGridApi] = useState<GridApi<IRow> | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [isGroupedByMake, setIsGroupedByMake] = useState<boolean>(false);

  const [rowData] = useState<IRow[]>([
    { make: 'Toyota', model: 'Celica', price: 35000, year: 2003, color: 'Red' },
    { make: 'Ford', model: 'Mondeo', price: 32000, year: 2019, color: 'Blue' },
    { make: 'Porsche', model: 'Boxster', price: 72000, year: 2020, color: 'Yellow' },
    { make: 'BMW', model: 'M50', price: 60000, year: 2021, color: 'Black' },
    { make: 'Mercedes', model: 'C-Class', price: 55000, year: 2018, color: 'Silver' },
    { make: 'Toyota', model: 'Supra', price: 45000, year: 2022, color: 'White' },
    { make: 'Ford', model: 'Mustang', price: 52000, year: 2023, color: 'Red' },
    { make: 'Porsche', model: '911', price: 120000, year: 2021, color: 'Black' },
    { make: 'BMW', model: 'X5', price: 75000, year: 2020, color: 'Blue' },
    { make: 'Mercedes', model: 'E-Class', price: 65000, year: 2022, color: 'White' },
  ]);

  const [columnDefs, setColumnDefs] = useState<ColDef<IRow>[]>(initialColumnDefs);

  const onGridReady = useCallback((event: GridReadyEvent<IRow>) => {
    setGridApi(event.api);
  }, []);

  useEffect(() => {
    if (gridApi) {
      gridApi.setGridOption('quickFilterText', searchText);
    }
  }, [searchText, gridApi]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const toggleGroupByMake = () => {
    setIsGroupedByMake(prev => {
      const newGroupingState = !prev;
      const newColumnDefs = initialColumnDefs.map(col => {
        if (col.field === 'make') {
          return { ...col, rowGroup: newGroupingState, hide: newGroupingState };
        }
        return col;
      });
      setColumnDefs(newColumnDefs);
      // Ensure the grid re-evaluates columns for grouping
      if(gridApi) {
        gridApi.setGridOption('columnDefs', newColumnDefs); 
      }
      return newGroupingState;
    });
  };
  
  const autoGroupColumnDef: ColDef = {
    headerName: 'Make', // Group column will be titled "Make"
    minWidth: 250, // Wider group column
    cellRendererParams: {
      suppressCount: false, // Show count of items in group
      checkbox: true, // Optional: if you want checkboxes for group selection
    },
  };

  return (
    <div style={{ width: '100%', height: '600px', display: 'flex', flexDirection: 'column' }}>
      <FlexLayout direction="row" gap={1} align="center" style={{ paddingBottom: 'var(--salt-spacing-200)' }}>
        <Input 
          placeholder="Search across all columns..." 
          value={searchText}
          onChange={handleSearchChange}
          style={{ flexGrow: 1 }} 
        />
        <FlexLayout direction="row" gap={1} align="center">
           <label htmlFor="group-by-make-switch" style={{cursor: 'pointer'}}>Group by Make</label>
           <Switch 
            id="group-by-make-switch"
            checked={isGroupedByMake}
            onChange={toggleGroupByMake}
          />
        </FlexLayout>
      </FlexLayout>
      <div className="ag-theme-salt" style={{ height: '100%', width: '100%' }}>
        <AgGridReact<IRow>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          rowSelection="multiple"
          animateRows={true}
          groupDisplayType="groupRows" // Display groups as expandable rows
          autoGroupColumnDef={autoGroupColumnDef} // Configuration for the auto-generated group column
          {...props} // Spread any additional props
        />
      </div>
    </div>
  );
};

export default SaltAgGrid;
