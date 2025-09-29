import React from "react";
import formatDateOnly from "../../utils/formatDateOnly";
import { HiChevronUp, HiChevronDown, HiSelector } from "react-icons/hi";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import ActionMenu from "../ActionMenu";

const SubmittedExamTable = ({ data, searchParams, setSearchParams }) => {
  const navigate = useNavigate();
  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") || "desc";

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
              onClick={() => handleSort("exam.title")}
            >
              Exam Title{renderSortIndicator("exam.title")}
            </th>
            <th
              className="px-4 py-2 text-center cursor-pointer"
              onClick={() => handleSort("exam.subject")}
            >
              Subject{renderSortIndicator("exam.subject")}
            </th>
            <th
              className="px-4 py-2 text-center cursor-pointer"
              onClick={() => handleSort("created_at")}
            >
              Submitted At{renderSortIndicator("created_at")}
            </th>
            <th className="px-4 py-2 text-center">Score</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((submission, index) => (
              <tr key={submission.id}>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {submission.exam?.title || "-"}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {submission.exam?.subjects?.name || "-"}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {formatDateOnly(submission.created_at)}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {submission.score ?? "-"}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
									<ActionMenu itemId={submission.id} menu={"submittedExam"} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="px-4 py-2 text-center text-gray-500"
              >
                Belum ada ujian yang disubmit
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

SubmittedExamTable.propTypes = {
  data: PropTypes.array.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
};

export default SubmittedExamTable;
