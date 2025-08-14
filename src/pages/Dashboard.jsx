import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <div className="">
      <Sidebar></Sidebar>
      <h1 className="text-2xl font-bold mb-4">Selamat Datang di Dashboard</h1>
      <p>Silakan lanjutkan ke ujian atau aktivitas lainnya.</p>
    </div>
  );
};

export default Dashboard;
