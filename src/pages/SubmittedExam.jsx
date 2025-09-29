import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import SearchBar from "../components/Users/SearchBar";
import Pagination from "../components/Paginate";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SubmittedExamTable from "../components/Exams/SubmittedExamTable"; // buat tabel khusus hasil ujian siswa

const MySwal = withReactContent(Swal);

const SubmittedExams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0 });

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") || "desc";
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 10;

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:3000/api/exam-submissions/me",
        {
          params: { search, sort, order, page, limit: pageSize },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const submissionList = Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      const metaInfo = res.data?.meta || { total: 0 };

      setSubmissions(submissionList);
      setMeta(metaInfo);
    } catch (err) {
      MySwal.fire({
        title: "Error",
        text: "Gagal mengambil data hasil ujian.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setSearchParams({ search: "", sort: "created_at", order: "desc", page: "1" });
      setSubmissions([]);
      setMeta({ total: 0 });
      console.error("Failed to fetch exam submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [search, sort, order, page]);

  return (
    <Sidebar>
      <div className="p-6 min-h-screen bg-white rounded shadow max-w-screen-xl mx-auto overflow-hidden">
        <h3 className="font-bold mb-4">Hasil Ujian</h3>

        {/* 🔍 Search Bar */}
        <SearchBar value={search} />

        {loading ? (
          <p className="mt-4">Loading...</p>
        ) : (
          <>
            <SubmittedExamTable
              data={submissions}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onRefresh={fetchSubmissions}
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
                onPageChange={(p) =>
                  setSearchParams({ search, sort, order, page: p.toString() })
                }
              />
            </div>
          </>
        )}
      </div>
    </Sidebar>
  );
};

export default SubmittedExams;
