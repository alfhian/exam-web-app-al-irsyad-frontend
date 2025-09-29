import { useState, useEffect, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import SearchBar from '../components/Users/SearchBar';
import SubjectTable from '../components/Subjects/SubjectTable';
import Pagination from '../components/Paginate';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import ClassSelect from '../components/DropdownClass';

const MySwal = withReactContent(Swal);

const Subjects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [total, setTotal] = useState(0);
  const [meta, setMeta] = useState({ total: 0 });
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'name';
  const order = searchParams.get('order') || 'asc';
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = 10;

  // Form data for adding/editing subject
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    class_id: '',
    created_at: new Date().toISOString(),
    updated_at: '',
  });

  // Handle input changes for form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/subjects', {
        params: { search, sort, order, page, limit: pageSize },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const dataList = Array.isArray(res.data?.data) ? res.data.data : [];
      const metaInfo = res.data?.meta || { total: 0 };

      console.log(dataList);
      

      setData(dataList);
      setMeta(metaInfo);
      setTotal(metaInfo.total);
    } catch (err) {
      MySwal.fire({
        title: 'Error',
        text: 'Gagal mengambil data mata pelajaran.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setSearchParams({ search: '', sort: 'title', order: 'asc', page: '1' });
      setData([]);
      setMeta({ total: 0 });
      setTotal(0);
      console.error('Failed to fetch subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  // Handle form submission for adding subject
  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3000/api/subjects', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setFormData({
        name: '',
        description: '',
        created_at: new Date().toISOString(),
      });

      setShowModal(false);

      MySwal.fire({
        title: 'Berhasil!',
        text: `Mata Pelajaran berhasil ditambah.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      fetchData();
    } catch (err) {
      // Handle error adding subject
      MySwal.fire({
        title: 'Gagal!',
        text: `Gagal menambah Mata Pelajaran.`,
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        created_at: new Date().toISOString(),
        created_by: '',
      });
      setLoading(false);
      console.error('Failed to add subject:', err);
    }
  };

  // Open modal for editing subject
  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/subjects/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = res.data;
      
      // Set form data for editing
      if (data) {
        setFormData({
          id: data.id,
          name: data.name,
          description: data.description,
          class_id: data.class_id,
          created_at: data.created_at,
        });
        setSelectedId(data.id);
        setEditModalOpen(true); // Open the edit modal
        console.log(editModalOpen);
        console.log(data.title)
        
      }
      
    } catch (err) {
      // Handle error fetching subject data
      MySwal.fire({
        title: 'Error',
        text: 'Gagal mengambil data Mata Pelajaran untuk diedit.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setEditModalOpen(false);
      setSelectedId(null);
      console.error('Failed to fetch subject for edit:', err);
    }
  };

  // Handle update user
  const handleUpdate = async () => {
    try {
      const updatedPayload = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      await axios.put(`http://localhost:3000/api/subjects/${selectedId}`, updatedPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setEditModalOpen(false);

      MySwal.fire({
        title: 'Berhasil!',
        text: `Mata Pelajaran berhasil diperbarui.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      fetchData();
    } catch (err) {
      // Handle error updating mata pelajaran
      MySwal.fire({
        title: 'Gagal!',
        text: `Gagal memperbarui Mata Pelajaran.`,
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
      setEditModalOpen(false);
      setSelectedId(null);
      setFormData({
        subject_id: '',
        title: '',
        date: '',
        duration: 0,
        created_at: new Date().toISOString(),
      });
      setLoading(false);
      setShowModal(false);
      console.error('Failed to update subject:', err);
    }
  };

  return (
    <Sidebar>
      <div className="p-6 min-h-screen bg-white rounded shadow max-w-screen-xl mx-auto overflow-hidden">
        <h3 className="font-bold mb-4">Daftar Mata Pelajaran</h3>
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-sm text-white font-semibold py-2 px-3 rounded"
          >
            + Tambah Mata Pelajaran
          </button>
        </div>

        <Transition appear show={showModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setShowModal(false)}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="w-full max-w-md transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Tambah Mata Pelajaran
                    </DialogTitle>

                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="userid" className="block text-sm font-medium">Nama</label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 w-full border border-2 border-gray-300 px-3 py-2 rounded"
                        />
                      </div>

                      <div>
                        <label htmlFor='class' className="pb-1 block text-sm font-medium">Kelas</label>
                        <div className='border border-2 border-gray-300 rounded'>
                          <ClassSelect 
                            classes={formData.class_id}
                            setClasses={(value) => setFormData(prev => ({ ...prev, class_id: value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor='description' className="block text-sm font-medium">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="mt-1 w-full border border-2 border-gray-300 px-3 py-2 rounded"
                          rows={3}
                          cols={5}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-2">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Transition appear show={editModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setEditModalOpen(false)}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="w-full max-w-md transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Edit Mata Pelajaran
                    </DialogTitle>

                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="userid" className="block text-sm font-medium">Nama</label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 w-full border border-2 border-gray-300 px-3 py-2 rounded"
                        />
                      </div>

                      <div>
                        <label htmlFor='class' className="pb-1 block text-sm font-medium">Kelas</label>
                        <div className='border border-2 border-gray-300 rounded'>
                          <ClassSelect 
                            classes={formData.class_id}
                            setClasses={(value) => setFormData(prev => ({ ...prev, class_id: value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor='description' className="block text-sm font-medium">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="mt-1 w-full border border-2 border-gray-300 px-3 py-2 rounded"
                          rows={3}
                          cols={5}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-2">
                      <button
                        onClick={() => setEditModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Update
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>


        <SearchBar value={search}/>

        {loading ? (
          <p className="mt-4">Loading...</p>
        ) : (
          <>
            <SubjectTable
              data={data}
              onRefresh={fetchData}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onEdit={handleEdit}
            />
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                {meta.total > 0 && (
                  <span>
                    Showing <strong>{(page - 1) * pageSize + 1}</strong> to{' '}
                    <strong>{Math.min(page * pageSize, meta.total)}</strong> of <strong>{meta.total}</strong> entries
                  </span>
                )}
              </div>
              <Pagination
                current={page}
                total={meta.total}
                pageSize={pageSize}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          </>
        )}
      </div>
    </Sidebar>
  );
};

export default Subjects;
