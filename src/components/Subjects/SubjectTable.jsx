import { HiChevronUp, HiChevronDown, HiSelector } from 'react-icons/hi';
import ActionMenu from '../ActionMenu';
import PropTypes from 'prop-types';

const SubjectTable = ({ data, onRefresh, searchParams, setSearchParams, onEdit }) => {
  const sort = searchParams.get('sort') || 'title';
  const order = searchParams.get('order') || 'asc';

  const handleSort = (key) => {
    const currentSort = searchParams.get('sort');
    const currentOrder = searchParams.get('order') || 'asc';
    const newOrder = currentSort === key && currentOrder === 'asc' ? 'desc' : 'asc';
    setSearchParams({ sort: key, order: newOrder, page: '1' });
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
            <th className="px-4 py-2 text-center">No</th>
            <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('nama')}>
              Nama{renderSortIndicator('name')}
            </th>
            <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('class_id')}>
              Kelas{renderSortIndicator('class_id')}
            </th>
            <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('description')}>
              Deskripsi{renderSortIndicator('description')}
            </th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((subject, index) => (
              
              <tr key={subject.id}>
                <td className="px-4 py-2 border border-gray-200 text-center">{index + 1}</td>
                <td className="px-4 py-2 border border-gray-200">{subject.name}</td>
                <td className="px-4 py-2 border border-gray-200">Kelas {subject.class_id}</td>
                <td className="px-4 py-2 border border-gray-200">{subject.description}</td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  <ActionMenu itemId={subject.id} onEdit={onEdit} menu="subjects"/>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center text-gray-500">No subjects found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
SubjectTable.propTypes = {
  data: PropTypes.array.isRequired,
  onRefresh: PropTypes.func,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  onEdit: PropTypes.func
};

export default SubjectTable;
