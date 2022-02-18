import React from "react";
import axios from "axios";
import moment from "moment";
import {baseUrl, formatNumber} from "../Config.js"
import { Link } from "react-router-dom"

class Transaksi extends React.Component{
    constructor(){
        super()
        this.state = {
            transaksi: []
        }
        if(!localStorage.getItem("token")){
            window.location.href = "/login"
        }
    }
    getData(){
        let endpoint = `${baseUrl}/transaksi`
        axios.get(endpoint)
        .then(response => {
            let dataTransaksi = response.data
            for(let i = 0; i < dataTransaksi.length; i++){
                let total = 0;
                for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                    let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                    let qty = dataTransaksi[i].detail_transaksi[j].qty

                    total += (harga * qty)
                }

                dataTransaksi[i].total = total
            }
            this.setState({transaksi: dataTransaksi})
        })
        .catch(error => console.log(error))
    }
    hapusTransaksi(id_transaksi){
        if(window.confirm("Apakah anda yakin menghapus data ini?")){
            let endpoint = `${baseUrl}/transaksi/${id_transaksi}`

            axios.delete(endpoint)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }
    convertStatus(id_transaksi, status){
        if(status === 1) {
            return(
                <div className="badge bg-info">
                    Transaksi Baru
                    <a className="" onClick={() => this.changeStatus(id_transaksi, 2)}><i class="fa-solid fa-angles-right mx-2"></i></a>
                </div>
            )
        } else if(status === 2){
            return(
                <div className="badge bg-warning">
                    Sedang diproses
                    <a className="" onClick={() => this.changeStatus(id_transaksi, 3)}><i class="fa-solid fa-angles-right mx-2"></i></a>
                </div>
            )
        } else if(status === 3){
            return(
                <div className="badge bg-secondary">
                    Siap diambil
                    <a className="" onClick={() => this.changeStatus(id_transaksi, 4)}><i class="fa-solid fa-angles-right mx-2"></i></a>
                </div>
            )
        } else if(status === 4){
            return(
                <div className="badge bg-success">Telah diambil</div>
            )
        }
    }
    changeStatus(id, status){
        if(window.confirm(`Apakah anda yakin mengubah status data ini ?`)){
            let endpoint = `${baseUrl}/transaksi/status/${id}`
            let data = {
                status : status
            }
            axios.post(endpoint, data)
            .then(response => {
                window.alert(`Status transaksi telah diubah`)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }
    convertStatusBayar(id_transaksi, dibayar){
        if(dibayar === 0) {
            return(
                <div className="badge bg-danger">
                    Belum dibayar
                    <a className="" onClick={() => this.changeStatusBayar(id_transaksi, 1)}><i class="fa-solid fa-angles-right mx-2"></i></a>
                </div>
            )
        } else if(dibayar === 1){
            return(
                <div className="badge bg-success">
                    Sudah dibayar
                </div>
            )
        }
    }
    changeStatusBayar(id, dibayar){
        if(window.confirm(`Apakah anda yakin mengubah status pembayaran data ini ?`)){
            let endpoint = `${baseUrl}/transaksi/bayar/${id}`
            let data = {
                dibayar : dibayar
            }
            axios.get(endpoint, data)
            .then(response => {
                window.alert(`Status pembayaran transaksi telah diubah`)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }
    componentDidMount(){
        this.getData()
    }
    render(){
        return(
            <div className="transaction-pages">
                <div className="main-content">
                    <div className="row mb-2">
                        <div className="col-lg-10 col-md-6">
                            <h3 className="text-secondary pt-4">Data User</h3>
                        </div>
                        <div className="col-lg-2 col-md-6 d-grid gap-2 d-md-flex justify-content-md-end btn-add">
                            <button class="btn btn-primary me-md-2 my-3" type="button"><Link to="/formTransaksi" className="text-white">Tambah Transaksi</Link></button>
                        </div>
                    </div>
                    <ul className="list-group">
                        {this.state.transaksi.map(trans => (
                            <li className="list-group-item mt-3 data-list card">
                                <div className="row">
                                    {/* Member Area */}
                                    <div className="col-lg-1">
                                        <small>{moment(trans.tgl).format('L')}</small>
                                    </div>
                                    <div className="col-lg-3 px-4">
                                        <small>{trans.member.nama}</small> <br/>
                                        <small className="text-secondary">{trans.member.alamat}</small>
                                    </div>
                                    <div className="col-lg-2">
                                        <h6 className="text-secondary">Batas Waktu</h6>
                                        <small>{moment(trans.batas_waktu).format('L')}</small>
                                    </div>
                                    <div className="col-lg-2">
                                        <h6 className="text-secondary">Tanggal Bayar</h6>
                                        <small>{moment(trans.tgl_bayar).format('L')}</small>
                                    </div>
                                    <div className="col-lg-2">
                                        {this.convertStatus(trans.id_transaksi, trans.status)} <br/>
                                        {this.convertStatusBayar(trans.id_transaksi, trans.dibayar)}
                                    </div>
                                    <div className="col-lg-2">
                                        <b className="text-secondary">Total : </b>
                                        <small> Rp {formatNumber(trans.total)}</small> <br/>
                                        <button className="btn btn-danger btn-sm mt-3" onClick={() => this.hapusTransaksi(trans.id_transaksi)}><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                </div>
                                <hr />
                                {/* Detail Transaksi */}
                                <h6 className="text-primary mt-3">Detail Transaksi</h6>
                                {trans.detail_transaksi.map(detail => (
                                    <div className="row">
                                        {/* Jenis Paket */}
                                        <div className="col-lg-3">
                                            {detail.paket.jenis_paket}
                                        </div>
                                        {/* Quantiti */}
                                        <div className="col-lg-2">
                                            {detail.qty}
                                        </div>
                                        {/* Harga Paket */}
                                        <div className="col-lg-3">
                                            Rp {formatNumber(detail.paket.harga)}
                                        </div>
                                        {/* Total */}
                                        <div className="col-lg-4">
                                            Rp {formatNumber(detail.paket.harga * detail.qty)}
                                        </div>
                                    </div>
                                ))}
                            </li>
                        ))} 
                    </ul> 
                </div>
            </div>
        )
    }
}

export default Transaksi