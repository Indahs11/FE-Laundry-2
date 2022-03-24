import React from "react";
import axios from "axios";
import moment from "moment";
import {authorization, baseUrl, formatNumber} from "../Config.js"
import { Link } from "react-router-dom"
import ReactToPdf from 'react-to-pdf'
import domToPdf from 'dom-to-pdf'
import Shoopic from './transaction.png'

class Transaksi extends React.Component{
    constructor(){
        super()
        this.state = {
            masterTransaksi: [],
            transaksi: [],
            search: "",
            newTrans: 0,
            onProses: 0,
            ready: 0,
            done: 0,
            role: "",
            visible: true
        }
        if(!localStorage.getItem("token")){
            window.location.href = "/login"
        }
    }
    getData(){
        let endpoint = `${baseUrl}/transaksi`
        axios.get(endpoint, authorization)
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
            this.setState({masterTransaksi: dataTransaksi})
            this.setState({newTrans: response.data.filter(it => it.status === 1).length})
            this.setState({onProses: response.data.filter(it => it.status === 2).length})
            this.setState({ready: response.data.filter(it => it.status === 3).length})
            this.setState({done: response.data.filter(it => it.status === 4).length})
        })
        .catch(error => console.log(error))
    }
    hapusTransaksi(id_transaksi){
        if(window.confirm("Apakah anda yakin menghapus data ini?")){
            let endpoint = `${baseUrl}/transaksi/${id_transaksi}`

            axios.delete(endpoint, authorization)
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
            axios.post(endpoint, data, authorization)
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
            axios.get(endpoint,  authorization)
            .then(response => {
                window.alert(`Status pembayaran transaksi telah diubah`)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }
    convertPdf(){
        //ambil elemen yang akan di convert
        let element = document.getElementById(`topdf`)
        let options = {
            filename : "laporan.pdf"
        }
        domToPdf(element, options, () => {
            window.alert("File akan segera di Download")
        })
    }
    searching(ev) {
        let code = ev.keyCode; 
        if (code === 13) {
          let data = this.state.masterTransaksi;
          let found = data.filter(it => 
            it.member.nama.toLowerCase().includes(this.state.search.toLowerCase()) || it.tgl.toLowerCase().includes(this.state.search.toLowerCase())) 
          this.setState({ transaksi: found });
        }
    }
    cetakStruk(id){
        var element = document.getElementById(`struk${id}`);
        var options = {
            filename: `entri-${id}.pdf`
        }
        domToPdf(element, options, function(pdf){
            window.alert(`Struk akan segera terunduh`)
        }) 
    }
    componentDidMount(){
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
        this.setState({role: user.role})

        if(user.role === "Admin" || user.role === "Kasir"){
            this.setState({visible: true})
        }else{
            this.setState({visible: false})
        }
    }
    render(){
        const target = React.createRef()
        return(
            <div className="transaction-pages">
                <div className="main-content">
                    <div className="container title-section ">
                        <div className="row">
                            <div className="col-lg-5">
                                <h2>Selamat datang <br/>di <span>halaman transaksi</span></h2>
                                <h6 className="mt-3">Gulir ke bawah untuk melihat data transaksi</h6>
                                <div className="btn-add mt-4">
                                    <button class={`btn btn-primary me-md-2 ${this.state.visible ? `` : `d-none`}`} type="button"><Link to="/formTransaksi" className="text-white">Tambah Transaksi</Link></button>
                                    <button className="btn btn-success" onClick={() => this.convertPdf()}>Generate PDF</button>
                                </div>
                            </div>
                            <div className="col-lg-3"></div>
                            <div className="col-lg-4 pt-5">
                                <img src={Shoopic} width="450" className="img-respons"></img>
                            </div>
                        </div>
                        <div className="row summary mt-4">
                            <div className="col-lg-3 col-sm-6 my-1">
                                <div className="card">
                                    <div className="p-3 row">
                                        <div className="col-md-4 text-center">
                                            <i class="fa-solid fa-cart-plus bg-success"></i>
                                        </div>
                                        <div className="col-md-8">
                                            <h6 className="card-title">Transaksi Baru</h6>
                                            <h4>{this.state.newTrans}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-sm-6 my-1">
                                <div className="card">
                                    <div className="p-3 row">
                                        <div className="col-md-4 text-center">
                                            <i class="fa-solid fa-bars-progress bg-primary"></i>
                                        </div>
                                        <div className="col-md-8">
                                            <h6 className="card-title">Sedang diproses</h6>
                                            <h4>{this.state.onProses}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-sm-6 my-1">
                                <div className="card">
                                    <div className="p-3 row">
                                        <div className="col-md-4 text-center">
                                            <i class="fa-solid fa-bag-shopping bg-warning"></i>
                                        </div>
                                        <div className="col-md-8">
                                            <h6 className="card-title">Siap diambil</h6>
                                            <h4>{this.state.ready}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-sm-6 my-1">
                                <div className="card">
                                    <div className="p-3 row">
                                        <div className="col-md-4 text-center">
                                            <i class="fa-solid fa-cash-register bg-danger"></i>
                                        </div>
                                        <div className="col-md-8">
                                            <h6 className="card-title">Selesai</h6>
                                            <h4>{this.state.done}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="main-data">
                        <div ref={target} id="topdf" className="container">
                            <div className="row">
                                <div className="col-lg-2 col-sm-4">
                                    <h3>Data Transaksi</h3>
                                </div>
                                <div className="col-lg-7 col-sm-3"></div>
                                <div className="col-lg-3 col-sm-5 search-bar mt-3">
                                    <input type="text" placeholder="Cari data transaksi" value={this.state.search} onChange={ev => this.setState({search: ev.target.value})} onKeyUp={(ev) => this.searching(ev)}></input>
                                </div>
                            </div>
                            <ul className="list-group">
                                {this.state.transaksi.map(trans => (
                                    <li className="list-group-item mt-3 card">
                                        <div className="row">
                                            {/* Member Area */}
                                            <div className="col-lg-1 px-0 col-sm-2">
                                                <small><b>{moment(trans.tgl).format('L')}</b></small>
                                            </div>
                                            <div className="col-lg-3 mb-3 col-sm-10">
                                                <small>{trans.member.nama}</small> <br/>
                                                <small className="text-secondary">{trans.member.alamat}</small>
                                            </div>
                                            <div className="col-lg-2 col-sm-3 ">
                                                <h6 className="text-secondary">Batas Waktu</h6>
                                                <small>{moment(trans.batas_waktu).format('L')}</small>
                                            </div>
                                            <div className="col-lg-2 col-sm-3">
                                                <h6 className="text-secondary">Tanggal Bayar</h6>
                                                <small>{moment(trans.tgl_bayar).format('L')}</small>
                                            </div>
                                            <div className="col-lg-2 col-sm-3">
                                                {this.convertStatus(trans.id_transaksi, trans.status)} <br/>
                                                {this.convertStatusBayar(trans.id_transaksi, trans.dibayar)}
                                            </div>
                                            <div className="col-lg-2 col-sm-3">
                                                <b className="text-secondary">Total : </b>
                                                <small> Rp {formatNumber(trans.total)}</small> <br/>
                                                <button className="btn btn-danger btn-sm mt-2" onClick={() => this.hapusTransaksi(trans.id_transaksi)}><i className="fa-solid fa-trash"></i></button>
                                                <button className="btn btn-primary mt-2 btn-sm mx-2" onClick={() => this.cetakStruk(trans.id_transaksi)}><i class="fa-solid fa-file-arrow-down"></i></button>
                                            </div>
                                            <div style={{display : `none`}} className="struk-transaksi">
                                                <div className="col-lg-12 text-success" id={`struk${trans.id_transaksi}`} style={{padding: `100px`, fontSize: `24px`}}>
                                                    <div className="text-center" style={{ marginBottom: `100px`}}>
                                                        <h1 style={{fontSize: `56px`, fontWeight: `900`, color: `#2495ce` }}>SOlO</h1>
                                                        <h5>Jln. Buana Agung No.54, Kendari | 66153</h5>
                                                        <h5>0876571234</h5>
                                                    </div>
                                                    <div className="row text-dark">
                                                        <div className="col-lg-8">
                                                            <div>Member: {trans.member.nama}</div>
                                                            <div className="mt-3">Kasir: {trans.user.nama}</div>
                                                        </div>
                                                        <div className="col-lg-4">
                                                            <div>Tanggal Transaksi: {moment(trans.tgl).format('L')}</div>
                                                            <div className="my-3">Batas pembayaran: {moment(trans.batas_waktu).format('L')}</div>
                                                            <div>Tanggal pembayaran: {moment(trans.tgl_bayar).format('L')}</div>
                                                        </div>
                                                    </div>
                                                    <hr/>
                                                    <div className="row" style={{fontWeight: `bold`, fontSize: `24px`}}>
                                                        <div className="col-4">Jenis Paket</div>
                                                        <div className="col-2">Qty</div>
                                                        <div className="col-3">Harga Satuan</div>
                                                        <div className="col-3">Total Satuan</div>
                                                    </div>
                                                    <hr/>
                                                    {trans.detail_transaksi.map(item => (
                                                        <div className="row my-4">
                                                            <div className="col-4">{item.paket.jenis_paket}</div>
                                                            <div className="col-2">{item.qty}</div>
                                                            <div className="col-3">{item.paket.harga}</div>
                                                            <div className="col-3">Rp.{formatNumber(item.paket.harga * item.qty)}</div>
                                                        </div>
                                                    ))}
                                                    <div className="row mt-5">
                                                        <div className="col-lg-7"></div>
                                                        <div className="col-lg-2"><b>Total Belanja</b></div>
                                                        <div className="col-lg-3">
                                                            Rp.{formatNumber(trans.total)}
                                                        </div>
                                                    </div>
                                                    <div className="text-center" style={{ marginTop: `200px`}}><i>Terima kasih dan jangan lupa datang kembali</i></div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        {/* Detail Transaksi */}
                                        <h6 className="text-primary mt-3">Detail Transaksi</h6>
                                        {trans.detail_transaksi.map(detail => (
                                            <div className="row">
                                                {/* Jenis Paket */}
                                                <div className="col-lg-3 col-sm-4">
                                                    {detail.paket.jenis_paket}
                                                </div>
                                                {/* Quantiti */}
                                                <div className="col-lg-2 col-sm-2">
                                                    {detail.qty}
                                                </div>
                                                {/* Harga Paket */}
                                                <div className="col-lg-3 col-sm-3">
                                                    Rp {formatNumber(detail.paket.harga)}
                                                </div>
                                                {/* Total */}
                                                <div className="col-lg-4 col-sm-3">
                                                    Rp {formatNumber(detail.paket.harga * detail.qty)}
                                                </div>
                                            </div>
                                        ))}
                                    </li>
                                ))} 
                            </ul> 
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Transaksi