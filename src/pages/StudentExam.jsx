import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import SearchBar from "../components/Users/SearchBar";
import Pagination from "../components/Paginate";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import StudentExamTable from "../components/Exams/StudentExamTable"; // bisa bikin table khusus student

const MySwal = withReactContent(Swal);

const StudentExams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0 });
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "title";
  const order = searchParams.get("order") || "asc";
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 10;

  const fetchStudentExams = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/exams/today", {
        params: { search, sort, order, page, limit: pageSize },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const examList = Array.isArray(res.data?.data) ? res.data.data : [];
      const metaInfo = res.data?.meta || { total: 0 };

      setExams(examList);
      setMeta(metaInfo);
    } catch (err) {
      MySwal.fire({
        title: "Error",
        text: "Gagal mengambil data ujian siswa.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setSearchParams({ search: "", sort: "title", order: "asc", page: "1" });
      setExams([]);
      setMeta({ total: 0 });
      console.error("Failed to fetch student exams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentExams();
  }, [search, sort, order, page]);

  return (
    <Sidebar>
      <div className="p-6 min-h-screen bg-white rounded shadow max-w-screen-xl mx-auto overflow-hidden">
        <h3 className="font-bold mb-4">Ujian Hari Ini</h3>

        {/* 🔍 Search Bar */}
        <SearchBar value={search} />

        {loading ? (
          <p className="mt-4">Loading...</p>
        ) : (
          <>
            <StudentExamTable
              data={exams}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onRefresh={fetchStudentExams}
              isStudentView={true} // kalau butuh bedain tampilan
            />

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                {meta.total > 0 && (
                  <span>
                    Showing <strong>{(page - 1) * pageSize + 1}</strong> to{" "}
                    <strong>{Math.min(page * pageSize, meta.total)}</strong> of{" "}
                    <strong>{meta.total}</strong> entries
                  </span>
                )}
              </div>
              <Pagination
                current={page}
                total={meta.total}
                pageSize={pageSize}
                onPageChange={(p) => setSearchParams({ 
                  search, sort, order, page: p.toString() 
                })}
              />
            </div>
          </>
        )}
      </div>
    </Sidebar>
  );
};

export default StudentExams;
