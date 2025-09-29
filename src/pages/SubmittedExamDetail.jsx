import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import formatDateOnly from "../utils/formatDateOnly";

const MySwal = withReactContent(Swal);

const SubmittedExamDetail = () => {
  const { submissionId } = useParams(); // exam_submission_id
  const [examDetail, setExamDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchExamDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/exam-submissions/${submissionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setExamDetail(res.data);
    } catch (err) {
      console.error("Failed to fetch exam detail:", err);
      MySwal.fire({
        title: "Error",
        text: "Gagal mengambil detail ujian.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamDetail();
  }, [submissionId]);

  let content;
  if (loading) {
    content = <p className="mt-4">Loading...</p>;
  } else if (!examDetail) {
    content = <p className="mt-4 text-red-500">Data tidak ditemukan.</p>;
  } else {
    content = (
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h4 className="text-lg font-semibold">{examDetail.exams?.title}</h4>
          <p className="text-sm text-gray-500">
            Mata Pelajaran: {examDetail.exams?.subjects?.name || "-"}
          </p>
          <p className="text-sm text-gray-500">
            Tanggal: {formatDateOnly(examDetail.exams?.date)}
          </p>
          <p className="text-sm text-gray-500">
            Durasi: {examDetail.exams?.duration} menit
          </p>
        </div>

        <div className="mt-4">
          <h5 className="font-semibold mb-2">Detail Soal:</h5>
          {examDetail.answers && Array.isArray(examDetail.answers) ? (
            <ul className="list-disc ml-6 space-y-2">
              {examDetail.answers.map((ans) => (
                <li key={ans.question_id}>
                  <span className="font-medium">{ans.question}:</span>
                    <br/>
                  <p><span className="font-semibold">Jawaban</span>: {ans.answer}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Belum ada jawaban tersimpan.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Sidebar>
      <div className="p-6 min-h-screen bg-white rounded shadow max-w-screen-xl mx-auto overflow-hidden">
        <h3 className="font-bold mb-4">Detail Ujian yang Disubmit</h3>
        {content}
      </div>
    </Sidebar>
  );
};

export default SubmittedExamDetail;
