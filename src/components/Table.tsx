import { useState, useEffect } from 'react';
import '../styles/Table.css'

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  data: User[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

type SortDirection = 'asc' | 'desc';
type SortField = keyof User | null;

const Table = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.razzakfashion.com/?paginate=${itemsPerPage}&page=${currentPage}&search=${searchTerm}`
      );
      const data: ApiResponse = await response.json();
      setUsers(data.data);
      setTotalPages(data.last_page);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, itemsPerPage, currentPage]);

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }

    const sortedUsers = [...users].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });

    setUsers(sortedUsers);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === users.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(users.map(user => user.id)));
    }
  };

  const handleSelectRow = (id: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const SortIcon = ({ field }: { field: keyof User }) => {
    if (sortField !== field) return <span className="sort-icon">⇅</span>;
    return sortDirection === 'asc' ? 
      <span className="sort-icon">↑</span> : 
      <span className="sort-icon">↓</span>;
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => handleSearch('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.size === users.length && users.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th onClick={() => handleSort('id')}>
              ID <SortIcon field="id" />
            </th>
            <th onClick={() => handleSort('name')}>
              Name <SortIcon field="name" />
            </th>
            <th onClick={() => handleSort('email')}>
              Email <SortIcon field="email" />
            </th>
            <th onClick={() => handleSort('created_at')}>
              Created At <SortIcon field="created_at" />
            </th>
            <th onClick={() => handleSort('updated_at')}>
              Updated At <SortIcon field="updated_at" />
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6}>Loading...</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr 
                key={user.id}
                className={selectedRows.has(user.id) ? 'selected' : ''}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(user.id)}
                    onChange={() => handleSelectRow(user.id)}
                  />
                </td>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>{new Date(user.updated_at).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <div className="items-per-page">
          Rows per page:
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        
        <div className="page-info">
          Page {currentPage} of {totalPages}
        </div>
        
        <div className="page-controls">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            ⟪
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ⟨
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            ⟩
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            ⟫
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;