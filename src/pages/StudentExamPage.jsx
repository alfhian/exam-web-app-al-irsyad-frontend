import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const StudentExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const [exam, setExam] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // dalam detik
  const [questions, setQuestions] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // Sync state ke ref
  useEffect(() => {
    submittingRef.current = submitting;
  }, [submitting]);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async (sessionId) => {
    if (!sessionId) {
      console.error("❌ SessionId kosong, tidak bisa mulai rekaman");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true, // ikut rekam audio
      });

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const formData = new FormData();
        formData.append("file", blob, "exam-recording.webm");

        try {
          await axios.post(
            `http://localhost:3000/api/exam-sessions/${sessionId}/upload-video`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("✅ Rekaman berhasil diupload");
        } catch (err) {
          console.error("❌ Gagal upload video:", err);
        }
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("❌ Gagal akses kamera:", err);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Ambil data exam & pertanyaan
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/exams/${examId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const examData = res.data;
        setExam(examData);

        const durationInMinutes = Number(examData.duration);
        setTimeLeft(durationInMinutes * 60);

        const qRes = await axios.get(`http://localhost:3000/api/exams/${examId}/questions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setQuestions(qRes.data.questions);
      } catch (err) {
        console.error("Gagal ambil exam:", err);
        Swal.fire("Error", "Gagal memuat ujian", "error");
        navigate("/student/exam");
      }
    };

    fetchExam();
  }, [examId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (!exam) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          Swal.fire("Waktu Habis!", "Ujian sudah selesai", "warning");
          navigate("/student/exam");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, navigate]);

  // Warning saat keluar tab / fullscreen
  useEffect(() => {
    if (!started) return;

    const showWarning = async (msg) => {
      Swal.fire("Peringatan!", msg, "warning");
      if (sessionId && !submitting) {
        await axios.post(
          `http://localhost:3000/api/exam-sessions/${sessionId}/tab-switch`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !submittingRef.current) {
        showWarning("Anda keluar dari fullscreen!");
      }
    };

    const handleBlur = () => {
      showWarning("Jangan tinggalkan halaman ujian!");
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !submittingRef.current) {
        showWarning("Anda tidak boleh berpindah tab!");
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [started, sessionId]);

  // Start Exam + buat session
  const handleStart = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/exam-sessions/${examId}/start`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      
      const newSessionId = res.data.id;
      setSessionId(newSessionId);

      setStarted(true);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }

      startRecording(newSessionId);
    } catch (err) {
      console.error("Gagal mulai ujian:", err);
      Swal.fire("Error", "Tidak bisa memulai sesi ujian", "error");
    }
  };

  // Submit Exam
  const handleSubmit = async () => {
    try {
      setSubmitting(true); 

      const payload = {
        answers: Object.entries(studentAnswers).map(([question_id, answer]) => ({
          question_id,
          answer,
        })),
      };

      await axios.post(
        `http://localhost:3000/api/exam-submissions/${examId}`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (sessionId) {
        await axios.post(
          `http://localhost:3000/api/exam-sessions/${sessionId}/finish`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      }

      // ✅ Exit fullscreen setelah submit
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      // ⏹ stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }

      Swal.fire("Selesai!", "Jawaban berhasil disimpan", "success");
      navigate("/student/exam");
    } catch (err) {
      console.error("Submit error:", err);
      Swal.fire("Error", "Gagal menyimpan jawaban", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Format waktu
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!exam) return <p className="p-6">Loading...</p>;

  if (!started) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <button
          onClick={handleStart}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow"
        >
          Start Exam
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col">
      {/* Header ujian */}
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-lg font-bold">{exam.title}</h1>
        <div className="text-red-600 font-bold">⏳ {formatTime(timeLeft)}</div>
      </div>

      {/* Daftar soal */}
      <div className="flex-1 overflow-y-auto p-6">
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div key={q.id} className="mb-6 p-4 bg-white rounded shadow">
              <p className="font-semibold">
                {index + 1}. {q.question}
              </p>
              {q.type === "multiple_choice" ? (
                <div className="mt-2 space-y-2">
                  {q.options?.map((opt, i) => (
                    <label key={i} className="block">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        onChange={() => handleAnswerChange(q.id, opt)}
                        className="mr-2"
                        checked={studentAnswers[q.id] === opt}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="mt-2">
                  <textarea
                    name={`q-${q.id}`}
                    className="w-full border rounded p-2"
                    placeholder="Tulis jawaban Anda di sini..."
                    rows={4}
                    value={studentAnswers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Tidak ada soal tersedia</p>
        )}
      </div>

      {/* Submit button */}
      <div className="p-4 bg-white shadow flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Exam
        </button>
      </div>
    </div>
  );
};

export default StudentExamPage;
