// File path: /client/src/components/dynamic/TableRenderer.jsx
// Purpose:  THE MAGIC TABLE RENDERER 
// Reads table config and automatically renders data tables with sorting, filters, pagination
// Supports column types: text, image, badge, status-badge, trust-score, currency, date, actions

import React, { useState, useEffect } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { apiService } from '../../services/api';

export default function TableRenderer({ tableId, onRowClick, onAction }) {
  const { getTable, config } = useConfig();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Get table config
  const tableConfig = getTable(tableId);
  
  if (!tableConfig) {
    return <div className="error-message">Table configuration not found: {tableId}</div>;
  }

  // Fetch data from API
  useEffect(() => {
    loadData();
  }, [tableId, filters, search, page, sortField, sortDirection]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        ...filters,
        search,
        page,
        limit: tableConfig.pagination?.pageSize || 20,
        sort: sortField ? `${sortField}:${sortDirection}` : undefined
      };
      
      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });
      
      const response = await apiService.get(tableConfig.endpoint, { params });
      
      if (response.success) {
        setData(response.data.items || response.data);
        setTotal(response.data.total || response.data.length);
      }
    } catch (err) {
      console.error('Failed to load table data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page
  };

  // Render cell based on column type
  const renderCell = (column, row) => {
    const value = row[column.key];
    
    switch (column.type) {
      case 'image':
        return value ? (
          <img src={value} alt="" className="table-image" style={{ width: column.width || '40px' }} />
        ) : (
          <div className="table-image-placeholder">No image</div>
        );
      
      case 'badge':
        return <span className={`badge badge-${value}`}>{value}</span>;
      
      case 'status-badge':
        const statusColors = {
          draft: 'gray',
          payment_pending: 'yellow',
          approved: 'green',
          verified: 'blue',
          suspended: 'red',
          rejected: 'red',
          active: 'green',
          filled: 'blue',
          closed: 'gray',
          pending: 'yellow',
          confirmed: 'green',
          failed: 'red'
        };
        return (
          <span className={`badge badge-${statusColors[value] || 'gray'}`}>
            {value?.replace('_', ' ')}
          </span>
        );
      
      case 'trust-score':
        const score = value?.total || 0;
        const tier = value?.tier || 'new';
        const tierColors = {
          premium: 'green',
          verified: 'blue',
          inProgress: 'yellow',
          new: 'gray'
        };
        return (
          <div className={`trust-score-badge trust-score-${tierColors[tier]}`}>
            <span className="score">{score}</span>
            <span className="tier">{tier}</span>
          </div>
        );
      
      case 'currency':
        return <span className="currency">{value} ETB</span>;
      
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-';
      
      case 'actions':
        return (
          <div className="table-actions">
            {column.actions?.map(action => (
              <button
                key={action}
                onClick={() => onAction?.(action, row)}
                className={`btn-action btn-action-${action}`}
              >
                {action}
              </button>
            ))}
          </div>
        );
      
      case 'number':
        return value ?? 0;
      
      case 'badges':
        return Array.isArray(value) ? (
          <div className="badge-list">
            {value.map((item, i) => (
              <span key={i} className="badge">{item}</span>
            ))}
          </div>
        ) : value;
      
      default:
        return value || '-';
    }
  };

  return (
    <div className="dynamic-table">
      <div className="table-header">
        <h2>{tableConfig.title}</h2>
      </div>
      
      {/* Filters */}
      {tableConfig.filters && (
        <div className="table-filters">
          {tableConfig.filters.map(filter => (
            <div key={filter.key} className="filter-group">
              <label>{filter.label}</label>
              {filter.type === 'select' && (
                <select
                  value={filters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="filter-select"
                >
                  <option value="">All</option>
                  {filter.options?.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              {filter.type === 'checkbox' && (
                <input
                  type="checkbox"
                  checked={filters[filter.key] || false}
                  onChange={(e) => handleFilterChange(filter.key, e.target.checked)}
                />
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Search */}
      {tableConfig.search && (
        <div className="table-search">
          <input
            type="text"
            placeholder={tableConfig.search.placeholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="search-input"
          />
        </div>
      )}
      
      {/* Table */}
      {loading ? (
        <div className="table-loading">Loading...</div>
      ) : error ? (
        <div className="table-error">Error: {error}</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                {tableConfig.columns.map(column => (
                  <th
                    key={column.key}
                    onClick={() => column.sortable && handleSort(column.key)}
                    className={column.sortable ? 'sortable' : ''}
                    style={{ width: column.width }}
                  >
                    {column.label}
                    {sortField === column.key && (
                      <span className="sort-indicator">
                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={tableConfig.columns.length} className="no-data">
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr
                    key={row.id || index}
                    onClick={() => onRowClick?.(row)}
                    className={onRowClick ? 'clickable' : ''}
                  >
                    {tableConfig.columns.map(column => (
                      <td key={column.key}>
                        {renderCell(column, row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          {total > (tableConfig.pagination?.pageSize || 20) && (
            <div className="table-pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {Math.ceil(total / (tableConfig.pagination?.pageSize || 20))}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / (tableConfig.pagination?.pageSize || 20))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}