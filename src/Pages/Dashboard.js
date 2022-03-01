import axios from 'axios'
import React from 'react'
import { baseUrl, formatNumber, authorization } from '../Config'

class Dashboard extends React.Component{
    constructor(){
        super()
        this.state = {
            jumlahPaket : 0,
            jumlahMember : 0,
            jumlahUser : 0,
            jumlahTranskasi : 0,
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
    }
    render(){
        return(
            <div className="main-content">
                <div className="row">
                    <div className="col-lg-3 col-md-6 my-1">
                        <div className="card bg-success">
                            <div className="card-body">
                                <h4 className="card-title">Data User</h4>
                                <h2>{this.state.jumlahUser}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 my-1">
                        <div className="card bg-danger text-white">
                            <div className="card-body">
                                <h4 className="card-title">Data Member</h4>
                                <h2>{this.state.jumlahMember}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 my-1">
                        <div className="card bg-info ">
                            <div className="card-body">
                                <h4 className="card-title">Data Paket</h4>
                                <h2>{this.state.jumlahPaket}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 my-1">
                        <div className="card bg-primary">
                            <div className="card-body">
                                <h4 className="card-title">Data Transaksi</h4>
                                <h2>{this.state.jumlahTranskasi}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 my-1">
                        <div className="card bg-primary">
                            <div className="card-body">
                                <h4 className="card-title">Income</h4>
                                <h2>Rp {formatNumber(this.state.income)}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Dashboard;