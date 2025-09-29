import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import formatDateOnly from "../utils/formatDateOnly";

const MySwal = withReactContent(Swal);

const ExamResultDetail = () => {
  const { id } = useParams(); // submissionId
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchExamResult = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/exam-submissions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error("Gagal fetch hasil ujian:", err);
      MySwal.fire({
        title: "Error",
        text: "Tidak bisa mengambil detail hasil ujian.",
        icon: "error",
        confirmButtonText: "OK",
      });
      navigate("/student/submitted-exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamResult();
  }, [id]);

  if (loading) {
    return (
      <Sidebar>
        <div className="p-6 min-h-screen bg-white rounded shadow max-w-screen-md mx-auto">
          <p>Loading...</p>
        </div>
      </Sidebar>
    );
  }

  if (!result) {
    return (
      <Sidebar>
        <div className="p-6 min-h-screen bg-white rounded shadow max-w-screen-md mx-auto">
          <p>Data hasil ujian tidak ditemukan.</p>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="p-6 min-h-screen bg-white rounded shadow max-w-screen-md mx-auto">
        <h3 className="font-bold mb-4">Detail Hasil Ujian</h3>

        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Judul Ujian:</strong> {result.exam?.title}
          </p>
          <p>
            <strong>Mata Pelajaran:</strong> {result.exam?.subjects?.name}
          </p>
          <p>
            <strong>Tipe:</strong> {result.exam?.type}
          </p>
          <p>
            <strong>Tanggal Submit:</strong>{" "}
            {formatDateOnly(result.created_at)}
          </p>
          <p>
            <strong>Skor:</strong>{" "}
            {result.score !== null ? result.score : "-"}
          </p>
        </div>

        <h4 className="mt-6 font-semibold">Jawaban Anda</h4>
        <div className="mt-2 border rounded p-4 bg-gray-50">
          {Array.isArray(result.answers) && result.answers.length > 0 ? (
            result.answers.map((ans, idx) => (
              <div
                key={idx}
                className="mb-3 pb-3 border-b last:border-0 last:pb-0"
              >
                <p className="font-medium">
                  {idx + 1}. {ans.question}
                </p>
                <p className="ml-4">
                  <strong>Jawaban Anda:</strong> {ans.answer}
                </p>
                <p className="ml-4">
                  <strong>Benar/Salah:</strong>{" "}
                  {ans.is_correct ? (
                    <span className="text-green-600">Benar</span>
                  ) : (
                    <span className="text-red-600">Salah</span>
                  )}
                </p>
              </div>
            ))
          ) : (
            <p>Tidak ada jawaban yang tersimpan.</p>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default ExamResultDetail;
