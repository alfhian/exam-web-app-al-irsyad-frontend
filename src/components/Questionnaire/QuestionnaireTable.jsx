import { HiChevronUp, HiChevronDown, HiSelector } from "react-icons/hi";
import ActionMenu from "../ActionMenu";
import PropTypes from "prop-types";

const QuestionnaireTable = ({ data, onRefresh, searchParams, setSearchParams, onEdit }) => {
  const sort = searchParams.get("sort") || "question";
  const order = searchParams.get("order") || "asc";

  const handleSort = (key) => {
    const currentSort = searchParams.get("sort");
    const currentOrder = searchParams.get("order") || "asc";
    const newOrder =
      currentSort === key && currentOrder === "asc" ? "desc" : "asc";
    setSearchParams({ sort: key, order: newOrder, page: "1" });
  };

  const renderSortIndicator = (key) => {
    if (sort !== key)
      return <HiSelector className="inline text-gray-400 ml-1" />;
    return order === "asc" ? (
      <HiChevronUp className="inline text-blue-500 ml-1" />
    ) : (
      <HiChevronDown className="inline text-blue-500 ml-1" />
    );
  };

  return (
    <div className="mt-4">
      <table className="table-auto w-full min-w-full bg-white border border-gray-200 rounded shadow text-sm text-gray-500 border-separate border-spacing-0">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-center">No</th>
            <th
              className="px-4 py-2 text-center cursor-pointer"
              onClick={() => handleSort("question")}
            >
              Question{renderSortIndicator("question")}
            </th>
            <th
              className="px-4 py-2 text-center cursor-pointer"
              onClick={() => handleSort("type")}
            >
              Type{renderSortIndicator("type")}
            </th>
            <th className="px-4 py-2 text-center">Options</th>
            <th className="px-4 py-2 text-center">Answer</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((q, index) => (
              <tr key={q.id}>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {q.question}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {q.type}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {q.type === "multiple_choice"
                    ? Array.isArray(q.options)
                      ? q.options.join(", ")
                      : q.options
                    : "-"}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {q.answer || "-"}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  <ActionMenu itemId={q.id} onEdit={onEdit} menu={"questionnaire"} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="px-4 py-2 text-center text-gray-500"
              >
                No questionnaires found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

QuestionnaireTable.propTypes = {
  data: PropTypes.array.isRequired,
  onRefresh: PropTypes.func,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
};

export default QuestionnaireTable;
