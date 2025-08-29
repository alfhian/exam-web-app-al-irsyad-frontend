import formatDate from '../../utils/formatDate';
import { HiChevronUp, HiChevronDown, HiSelector } from 'react-icons/hi';
import ActionMenu from '../ActionMenu';
import PropTypes from 'prop-types';

const ExamTable = ({ data, onRefresh, searchParams, setSearchParams, onEdit }) => {
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
      <table className="table-auto w-full bg-white border border-gray-200 rounded shadow text-sm text-gray-700 border-separate border-spacing-0">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-center">No</th>
            <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('title')}>
              Title{renderSortIndicator('title')}
            </th>
            <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('subject')}>
              Subject{renderSortIndicator('subject')}
            </th>
            <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('date')}>
              Date{renderSortIndicator('date')}
            </th>
            <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('duration')}>
              Duration (min){renderSortIndicator('duration')}
            </th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((exam, index) => (
              <tr key={exam.id}>
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border">{exam.title}</td>
                <td className="px-4 py-2 border text-center">{exam.subject?.name || '-'}</td>
                <td className="px-4 py-2 border text-center">{formatDate(exam.date)}</td>
                <td className="px-4 py-2 border text-center">{exam.duration}</td>
                <td className="px-4 py-2 border text-center">
                  <ActionMenu itemId={exam.id} onEdit={onEdit} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center text-gray-500">No exams found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
ExamTable.propTypes = {
  data: PropTypes.array.isRequired,
  onRefresh: PropTypes.func,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  onEdit: PropTypes.func
};

export default ExamTable;
