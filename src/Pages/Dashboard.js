import axios from 'axios'
import React from 'react'
import { baseUrl, formatNumber, authorization } from '../Config'
import Homepic from './home.png'

class Dashboard extends React.Component{
    constructor(){
        super()
        this.state = {
            jumlahPaket : 0,
            jumlahMember : 0,
            jumlahUser : 0,
            jumlahTranskasi : 0,
            namaUser: "",
            userRole: "",
            income : 0,
        }
        if(!localStorage.getItem("token")){
            window.location.href = "/login"
        }
    }
    getSummary(){
        //Memanggil Member
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint, authorization)
        .then(response => {
            this.setState({jumlahMember : response.data.length})
        })
        .catch(error => console.log(error))

        //Memanggil Paket
        endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
        .then(response => {
            this.setState({jumlahPaket : response.data.length})
        })
        .catch(error => console.log(error))
        
        //Memanggil Transaksi
        endpoint = `${baseUrl}/transaksi`
        axios.get(endpoint, authorization)
        .then(response => {
            let dataTransaksi = response.data
            let income = 0
            for(let i = 0; i < dataTransaksi.length; i++){
                let total = 0;
                for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                    let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                    let qty = dataTransaksi[i].detail_transaksi[j].qty

                    total += (harga * qty)
                }
                income += total
            }
            this.setState({jumlahTranskasi : response.data.length, income : income})
        })
        .catch(error => console.log(error))

        //Memanggil User
        endpoint = `${baseUrl}/users`
        axios.get(endpoint, authorization)
        .then(response => {
            this.setState({jumlahUser : response.data.length})
        })
        .catch(error => console.log(error))
    }
    componentDidMount(){
        this.getSummary()
        let user = JSON.parse(localStorage.getItem("user"))
        this.setState({namaUser : user.nama, userRole: user.role})

    }
    render(){
        return(
            <div className="dashboard-page">
                <div className="main-content container">
                    <div className="home-section row">
                        <div className="col-lg-5 col-sm-6">
                            <h2><span>Selamat</span> datang dan <span>semangat </span>bekerja <span>{this.state.namaUser}</span></h2>
                            <h6></h6>
                        </div>
                        <div className="col-lg-2 col-sm-1"></div>
                        <div className="col-lg-5 col-sm-5">
                            <img src={Homepic} width="400" className="img-respons"></img>
                        </div>
                    </div>
                    <div className="row summary">
                        <div className="col-lg-3 col-sm-6 my-1">
                            <div className="card">
                                <div className="p-3 row">
                                    <div className="col-md-4 text-center">
                                        <i className="fa-solid fa-user-gear bg-success"></i>
                                    </div>
                                    <div className="col-md-8">
                                        <h6 className="card-title">Data User</h6>
                                        <h4>{this.state.jumlahUser}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 my-1">
                            <div className="card">
                                <div className="p-3 row">
                                    <div className="col-md-4 text-center">
                                        <i className="fa-solid fa-user-tag bg-primary"></i>
                                    </div>
                                    <div className="col-md-8">
                                        <h6 className="card-title">Data Member</h6>
                                        <h4>{this.state.jumlahMember}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 my-1">
                            <div className="card">
                                <div className="p-3 row">
                                    <div className="col-md-4 text-center">
                                        <i className="fa-solid fa-box-open bg-warning"></i>
                                    </div>
                                    <div className="col-md-8">
                                        <h6 className="card-title">Data Paket</h6>
                                        <h4>{this.state.jumlahPaket}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 my-1">
                            <div className="card">
                                <div className="p-3 row">
                                    <div className="col-md-4 text-center">
                                        <i className="fa-solid fa-money-check-dollar bg-danger"></i>
                                    </div>
                                    <div className="col-md-8">
                                        <h6 className="card-title">Income</h6>
                                        <h4>Rp {formatNumber(this.state.income)}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Dashboard;