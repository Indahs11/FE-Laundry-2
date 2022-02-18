import React from "react";
import { NavLink } from "react-router-dom"

function Logout(){
    localStorage.removeItem("user")
    localStorage.removeItem("token")
}
export default function Navbar(props){
        return(
            <div>
                <nav className="navbar navbar-expand-lg navbar-light fixed-top px-5">
                    <div className="container-fluid">
                        <a className="navbar-brand">SOlO</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/">Beranda</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link"  to="/member">Member</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link"  to="/paket">Paket</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link"  to="/users">User</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link"  to="/transaksi">Transaksi</NavLink>
                                </li>
                            </ul>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end text-dark pt-2">
                                <NavLink className="nav-link"  to="/login" onClick={() => Logout()}><i class="fa-solid fa-arrow-right-from-bracket"></i></NavLink>                            
                            </div>
                        </div>              
                    </div>
                </nav>
                {props.children}
            </div>
        )
}
