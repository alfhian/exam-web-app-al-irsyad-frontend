import { useState, useEffect, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import SearchBar from '../components/Users/SearchBar';
import UserTable from '../components/Users/UserTable';
import Pagination from '../components/Paginate';
import RoleSelect from '../components/DropdownRole';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { jwtDecode } from 'jwt-decode';

const MySwal = withReactContent(Swal);

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'name';
  const order = searchParams.get('order') || 'asc';
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = 10;

  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : {};
  const role = decoded.role;

  // Form data for adding/editing user
  const [formData, setFormData] = useState({
    id: '',
    userid: '',
    name: '',
    password: '123456',
    role: 'admin',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: '',
  });


  // Open modal for editing user
  const handleEditUser = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const user = res.data[0];
      
      // Set form data for editing
      if (user) {
        setFormData({
          id: user.id,
          userid: user.userid,
          name: user.name,
          password: '123456',
          role: user.role,
          is_active: user.is_active,
          created_at: user.created_at,
        });
        setSelectedUserId(user.id);
        setEditModalOpen(true); // Open the edit modal
      }
      
    } catch (err) {
      // Handle error fetching user data
      MySwal.fire({
        title: 'Error',
        text: 'Gagal mengambil data user untuk diedit.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setEditModalOpen(false);
      setSelectedUserId(null);
      console.error('Failed to fetch user for edit:', err);
    }
  };


  // Handle input changes for form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  // Handle update user
  const handleUpdate = async () => {
    try {
      const updatedPayload = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      await axios.put(`http://localhost:3000/api/users/${selectedUserId}`, updatedPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setEditModalOpen(false);

      MySwal.fire({
        title: 'Berhasil!',
        text: `User berhasil diperbarui.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      fetchUsers();
    } catch (err) {
      // Handle error updating user
      MySwal.fire({
        title: 'Gagal!',
        text: `Gagal memperbarui user.`,
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
      setEditModalOpen(false);
      setSelectedUserId(null);
      setFormData({
        userid: '',
        name: '',
        password: '123456',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
      });
      setLoading(false);
      setShowModal(false);
      console.error('Failed to update user:', err);
    }
  };


  // Handle form submission for adding user
  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3000/api/users', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setFormData({
        user_id: '',
        name: '',
        password: '123456',
        role: 'admin',
        status: true,
        created_at: new Date().toISOString(),
      });

      setShowModal(false);

      MySwal.fire({
        title: 'Berhasil!',
        text: `User berhasil ditambah.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      fetchUsers();
    } catch (err) {
      // Handle error adding user
      MySwal.fire({
        title: 'Gagal!',
        text: `Gagal menambah user.`,
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
      setShowModal(false);
      setFormData({
        userid: '',
        name: '',
        password: '123456',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        created_by: '',
      });
      setLoading(false);
      console.error('Failed to add user:', err);
    }
  };


  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/users', {
        params: { search, sort, order, page, limit: pageSize },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const userList = Array.isArray(res.data?.data) ? res.data.data : [];
      const metaInfo = res.data?.meta || { total: 0 };

      setUsers(userList);
      setMeta(metaInfo);
      setTotal(metaInfo.total);
    } catch (err) {
      // Handle error fetching users
      MySwal.fire({
        title: 'Error',
        text: 'Gagal mengambil data pengguna.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setLoading(false);
      setSearchParams({ search: '', sort: 'name', order: 'asc', page: '1' });
      setUsers([]);
      setMeta({ total: 0 });
      setTotal(0);
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleGenerateToken = async () => {
    const result = await MySwal.fire({
      title: `Acak Token Siswa`,
      text: `Password/Token Siswa akan diacak.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const newPassword = generateRandomPassword();
        
        const res = await axios.post('http://localhost:3000/api/users/generate-password-siswa', 
          { password: newPassword },
          { 
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          },
        );

        MySwal.fire({
          title: 'Berhasil!',
          text: `Semua password Siswa telah diganti menjadi ${newPassword}.`,
          icon: 'success',
          confirmButtonText: 'OK',
        });

        fetchUsers(); // refresh data
      } catch (error) {
        MySwal.fire({
          title: 'Error',
          text: 'Gagal acak password Siswa.',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
        console.error("Failed to generate token:", error);
      }
    }
  };

  const generateRandomPassword = () => {
    return 'SISWA-' + Math.random().toString(36).slice(-8);
  };


  // Handle fetching users on component mount and when search, sort, order, or page changes
  useEffect(() => {
    fetchUsers();
  }, [search, sort, order, page]);


  return (
    <Sidebar>
      <div className="p-6 min-h-screen bg-white rounded shadow max-w-screen-xl mx-auto overflow-hidden">
        <h3 className="font-bold mb-4">User Management</h3>
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-sm text-white font-semibold py-2 px-3 rounded"
          >
            + Tambah User
          </button>
          <button
            onClick={handleGenerateToken}
            className="bg-red-600 hover:bg-red-700 text-sm text-white font-semibold py-2 px-3 rounded"
          >
            Acak Token
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
                      Add New User
                    </DialogTitle>

                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="userid" className="block text-sm font-medium">NIK/NIS</label>
                        <input
                          id="userid"
                          type="text"
                          name="userid"
                          value={formData.userid}
                          onChange={handleInputChange}
                          className="mt-1 w-full border border-2 border-gray-300 px-3 py-2 rounded"
                        />
                      </div>

                      <div>
                        <label htmlFor='name' className="block text-sm font-medium">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 w-full border border-2 border-gray-300 px-3 py-2 rounded"
                        />
                      </div>

                      <div>
                        <label htmlFor='role' className="pb-1 block text-sm font-medium">Role</label>
                        <div className='border border-2 border-gray-300 rounded'>
                          <RoleSelect 
                            role={formData.role}
                            setRole={(value) => setFormData(prev => ({ ...prev, role: value }))}
                          />
                        </div>
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
                      Edit User
                    </DialogTitle>

                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="userid" className="block text-sm font-medium">NIK/NIS</label>
                        <input
                          id="userid"
                          type="text"
                          name="userid"
                          value={formData.userid}
                          onChange={handleInputChange}
                          className="mt-1 w-full border border-2 border-gray-300 px-3 py-2 rounded"
                          disabled
                        />
                      </div>

                      <div>
                        <label htmlFor='name' className="block text-sm font-medium">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 w-full border border-2 border-gray-300 px-3 py-2 rounded"
                        />
                      </div>

                      <div>
                        <label htmlFor='role' className="pb-1 block text-sm font-medium">Role</label>
                        <div className='border border-2 border-gray-300 rounded'>
                          <RoleSelect 
                            role={formData.role}
                            setRole={(value) => setFormData(prev => ({ ...prev, role: value }))}
                          />
                        </div>
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
            <UserTable
              data={users}
              onRefresh={fetchUsers}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onEdit={handleEditUser}
            />
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                {total > 0 && (
                  <span>
                    Showing <strong>{(page - 1) * pageSize + 1}</strong> to{' '}
                    <strong>{Math.min(page * pageSize, total)}</strong> of <strong>{total}</strong> entries
                  </span>
                )}
              </div>
              <Pagination
                current={page}
                total={meta.total}
                pageSize={pageSize}
              />
            </div>
          </>
        )}
      </div>
    </Sidebar>
  );
};

export default Users;
