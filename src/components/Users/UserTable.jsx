import formatDate from '../../utils/formatDate';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ToggleStatusButton from './ToggleStatusButton';
import { HiChevronUp, HiChevronDown, HiSelector } from 'react-icons/hi';
import ActionMenu from '../ActionMenu';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const UserTable = ({ data, onRefresh, searchParams, setSearchParams, onEdit }) => {
  const sort = searchParams.get('sort') || 'name';
  const order = searchParams.get('order') || 'asc';

  const handleSort = (key) => {
    const currentSort = searchParams.get('sort');
    const currentOrder = searchParams.get('order') || 'asc';
    const newOrder = currentSort === key && currentOrder === 'asc' ? 'desc' : 'asc';
    setSearchParams({ sort: key, order: newOrder, page: '1' });
  };

  const onToggle = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/users/${id}/status`, {
        is_active: newStatus,
        updated_at: new Date().toISOString(),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      MySwal.fire({
        title: 'Berhasil!',
        text: `Status telah diubah.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      onRefresh(); // refresh data dari parent
    } catch (error) {
      console.error('Gagal mengubah status:', error);
      MySwal.fire({
        title: 'Gagal!',
        text: `Status gagal diubah.`,
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const renderSortIndicator = (key) => {
    if (sort !== key) return <HiSelector className="inline text-gray-400 ml-1" />;
    return order === 'asc'
      ? <HiChevronUp className="inline text-blue-500 ml-1" />
      : <HiChevronDown className="inline text-blue-500 ml-1" />;
  };

  return (
    <div className="mt-4">
      <table className="table-auto w-full min-w-full bg-white border border-gray-200 rounded shadow text-sm text-gray-500 border-separate border-spacing-0">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('userid')}>
              User ID{renderSortIndicator('userid')}
            </th>
            <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('name')}>
              Name{renderSortIndicator('name')}
            </th>
            <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('role')}>
              Role{renderSortIndicator('role')}
            </th>
            <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('is_active')}>
              Status{renderSortIndicator('is_active')}
            </th>
            <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('created_at')}>
              Created At{renderSortIndicator('created_at')}
            </th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map(user => (
              <tr key={user.userid}>
                <td className="px-4 py-1 border border-gray-200">{user.userid}</td>
                <td className="px-4 py-1 border border-gray-200">{user.name}</td>
                <td className="px-4 py-1 border border-gray-200 text-center">
                  <div className={`flex items-center justify-center text-center rounded-full px-3 py-1 ${
                    user.role === 'ADMIN' ? 'bg-red-400' :
                    user.role === 'GURU' ? 'bg-blue-400' :
                    'bg-green-400'
                  }`}>
                    <span className="text-white text-xs font-medium">{user.role}</span>
                  </div>
                </td>
                <td className="flex justify-center px-4 py-1 border border-gray-200">
                  <ToggleStatusButton
                    label={user.name}
                    isActive={user.is_active}
                    onConfirm={(newStatus) => onToggle(user.id, newStatus)}
                  />
                </td>
                <td className="px-4 py-1 border border-gray-200 text-center">{formatDate(user.created_at)}</td>
                <td className="px-4 py-1 border border-gray-200 text-center"><ActionMenu userId={user.id} onEdit={onEdit} /></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-1 text-center text-gray-500">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
