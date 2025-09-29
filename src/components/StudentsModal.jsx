import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function StudentsModal({ isOpen, onClose, examId }) {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Fetch semua siswa & siswa yg sudah ikut exam
  useEffect(() => {
    if (isOpen && examId) {
      Promise.all([
        fetch(`http://localhost:3000/api/users/role?role=SISWA`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((res) => res.json()),
        fetch(`http://localhost:3000/api/exams/${examId}/students`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((res) => res.json()),
      ])
        .then(([allUsers, examUsers]) => {
          console.log("All users:", allUsers);
          console.log("Exam users:", examUsers);

          setStudents(allUsers.data || []);
          setSelectedStudents(examUsers || []);
        })
        .catch((err) => console.error("Failed to fetch students:", err));
    }
  }, [isOpen, examId]);

  // toggle student
  const handleToggle = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // simpan ke DB
  const handleSave = () => {
    fetch(`http://localhost:3000/api/exams/${examId}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ studentIds: selectedStudents }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save students");
        return res.json();
      })
      .then(() => {
        onClose();
      })
      .catch((err) => console.error(err));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Assign Students
                </Dialog.Title>

                <div className="mt-4 max-h-96 overflow-y-auto">
                  <table className="w-full table-auto border border-gray-200 text-sm text-gray-600">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-center">Assign</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length > 0 ? (
                        students.map((student, index) => (
                          <tr key={student.id}>
                            <td className="px-4 py-2 border">{index + 1}</td>
                            <td className="px-4 py-2 border">{student.name}</td>
                            <td className="px-4 py-2 border">{student.email}</td>
                            <td className="px-4 py-2 border text-center">
                              <input
                                type="checkbox"
                                checked={selectedStudents.includes(student.id)}
                                onChange={() => handleToggle(student.id)}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-2 text-center text-gray-500"
                          >
                            No students found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
