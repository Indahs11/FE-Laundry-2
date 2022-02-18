import logo from './logo.svg';
import './App.css';
import './style.css'
import Navbar from './Components/Navbar';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Member from './Pages/Member'
import Paket from './Pages/Paket'
import User from './Pages/User'
import Transaksi from './Pages/Transaksi'
import FormTransaksi from './Pages/FormTransaksi';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

export default function App(){
  return(
    <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Navbar> <Dashboard /> </Navbar>} />
          <Route path="/member" element={<Navbar> <Member /> </Navbar>} />
          <Route path="/paket" element={<Navbar> <Paket /> </Navbar>} />
          <Route path="/users" element={<Navbar> <User /> </Navbar>} />
          <Route path="/transaksi" element={<Navbar> <Transaksi /> </Navbar>} />
          <Route path="/formTransaksi" element={<Navbar> <FormTransaksi /> </Navbar>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
    </BrowserRouter>
  )
}
