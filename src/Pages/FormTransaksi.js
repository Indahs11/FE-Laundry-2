import axios from "axios";
import React from "react";
import { Modal } from "bootstrap";
import { authorization, baseUrl } from "../Config";

class FormTransaksi extends React.Component{
    constructor(){
        super()
        this.state ={
            id_member: "",
            tgl: "",
            batas_waktu: "",
            tgl_bayar: "",
            dibayar: 0,
            id_user: "",
            detail_transaksi: [],
            members: [],
            packs: [],
            id_paket: "",
            qty: 0,
            jenis_paket: "",
            harga: 0
        }
        if(!localStorage.getItem("token")){
            window.location.href = "/login"
        }
    }
    getMember(){
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint, authorization)
        .then(response => {
            this.setState({members: response.data})
        })
        .catch(error => console.log(error))
    }
    getPaket(){
        let endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
        .then(response => {
            this.setState({packs: response.data})
        })
        .catch(error => console.log(error))
    }
    addPaket(){
        this.modal = new Modal(document.getElementById('modal-paket'))
        this.modal.show()

        this.setState({
            id_paket: "",
            jenis_paket: "",
            harga: 0,
            qty: 0
        })
    }
    tambahPaket(ev){
        ev.preventDefault()
        this.modal.hide()
        let idPaket = this.state.id_paket
        let selectedPaket= this.state.packs.find(paket => paket.id_paket == idPaket)
        let data = {
            id_paket : this.state.id_paket,
            qty : this.state.qty,
            jenis_paket : selectedPaket.jenis_paket,
            harga : selectedPaket.harga,
        }
        let temp = this.state.detail_transaksi
        temp.push(data)
        this.setState({detail_transaksi: temp})
    }
    hapusData(id_paket){
        if(window.confirm("Apakah anda yakin menghapus data ini?")){
            //mencari posisi index dari data yang dihapus
            let temp = this.state.detail_transaksi
            let index = temp.findIndex((detail) => detail.id_paket === id_paket)

            temp.splice(index, 1)

            this.setState({ detail_transaksi: temp})
        }
    }
    simpanTransaksi(){
        if (document.getElementById("member").value == "") {
            alert("missing member");
            return;
        }
        if (document.getElementById("tgl").value == "") {
            alert("missing tanggal transaksi");
            return;
        }
        if (document.getElementById("batas_waktu").value == "") {
            alert("missing batas waktu");
            return;
        }
        if (document.getElementById("status").value == "") {
            alert("missing status");
            return;
        }
        if (this.state.detail_transaksi.length == 0) {
            alert("missing paket");
            return;
        }
        let endpoint = `${baseUrl}/transaksi`
        let userLoggedId = JSON.parse(localStorage.getItem("user"))
            //Menampung data
            let newData = {
                id_transaksi : this.state.id_transaksi,
                tgl : this.state.tgl,
                batas_waktu : this.state.batas_waktu,
                tgl_bayar : this.state.tgl_bayar,
                id_member : this.state.id_member,
                id_user : userLoggedId.id_user,
                status : this.state.status,
                dibayar : this.state.dibayar,
                detail_transaksi: this.state.detail_transaksi
            }
            axios.post(endpoint, newData, authorization)
            .then(response => {
                window.alert(response.data.message)
                window.location.href = "/transaksi"
                this.getData()
            })
            .catch(error => console.log(error))
    }
    componentDidMount(){
        this.getMember()
        this.getPaket()
    }
    render(){
        return(
            <div className="main-content">
                <div className="container form-transaction">
                    <div className="text-center my-5">
                        <h1>Tambahkan Transaksi Baru</h1>
                        <h6>Masukkan data dengan benar dan jelas</h6>
                    </div>
                    <div className="card p-3 mb-5">
                        <div className="card-body row">
                            <div className="form-group">
                                <label>ID Member</label>
                                <select className="form-control mb-4" id="member" value={this.state.id_member} onChange={ev  => this.setState({id_member : ev.target.value})} required >
                                    <option value="">Pilih Member</option>
                                    {this.state.members.map(member => (
                                        <option value={member.id_member}>
                                            {member.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group col-lg-4">
                                <label>Tanggal Transaksi</label>
                                <input type="date" id="tgl" className="form-control mb-4" value={this.state.tgl} onChange={ev  => this.setState({tgl : ev.target.value})} required ></input>
                            </div>
                            <div className="form-group col-lg-4">
                                <label>Batas Waktu</label>
                                <input type="date" id="batas_waktu" className="form-control mb-4" value={this.state.batas_waktu} onChange={ev  => this.setState({batas_waktu : ev.target.value})} required ></input>
                            </div>
                            <div className="form-group col-lg-4">
                                <label>Tanggal Bayar</label>
                                <input type="date" id="tgl_bayar" className="form-control mb-4" value={this.state.tgl_bayar} onChange={ev  => this.setState({tgl_bayar : ev.target.value})} required ></input>
                            </div>
                            <div className="form-group col-lg-5">
                                <label>Status Bayar</label>
                                <select className="form-control mb-4" id="status" value={this.state.dibayar} onChange={ev  => this.setState({dibayar : ev.target.value})} required >
                                    <option value={0}>Belum dibayar</option>
                                    <option value={1}>Sudah dibayar</option>
                                </select>
                            </div>
                            <div className="mt-3 mb-4">
                                <button className="btn btn-primary btn-sm text-white" onClick={() => this.addPaket()}>Tambah Paket</button>
                            </div>
                            <hr/>
                            {/* Detail Transaksi */}
                            <h5 className="teks-primary mt-2">Detail Transaksi</h5>
                            <div className="row">
                                    <div className="col-lg-3">
                                        <h6>Jenis Paket</h6>
                                    </div>
                                    <div className="col-lg-2">
                                        <h6>Quantity</h6>
                                    </div>
                                    <div className="col-lg-3">
                                        <h6>Harga</h6>
                                    </div>
                                    <div className="col-lg-2">
                                        <h6>Total Harga</h6>
                                    </div>
                                    <div className="col-lg-2">
                                        <h6>Aksi</h6>
                                    </div>
                                </div>
                            {this.state.detail_transaksi.map(detail => (
                                <div className="row my-2">
                                    <div className="col-lg-3">
                                        {detail.jenis_paket}
                                    </div>
                                    <div className="col-lg-2">
                                        {detail.qty}
                                    </div>
                                    <div className="col-lg-3">
                                        Rp.{detail.harga}
                                    </div>
                                    <div className="col-lg-2">
                                        {detail.harga * detail.qty}
                                    </div>
                                    <div className="col-lg-2">
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => this.hapusData(detail.id_paket)}><i class="fa-solid fa-trash text-white"></i></button>
                                    </div>
                                </div>
                            ))}
                            {/* Modal Pilihan Paket */}
                            <div className="modal" id="modal-paket">
                                <div className="modal-dialog modal-md">
                                    <div className="modal-content">
                                        <div className="modal-header bg-primary text-white">
                                            <h4 className="modal-title text-white">Pilih Paket</h4>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={(ev) => this.tambahPaket(ev)}>
                                                <div className="form-group">
                                                    <label>Jenis Paket</label>
                                                    <select className="form-control mb-2" value={this.state.id_paket} onChange={ev  => this.setState({id_paket : ev.target.value})}>
                                                        <option value="">Pilih Paket</option>
                                                        {this.state.packs.map(pack => (
                                                            <option value={pack.id_paket}>{pack.jenis_paket}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Quantity</label>
                                                    <input type="number" className="form-control" value={this.state.qty} onChange={ev => this.setState({qty: ev.target.value})}></input>
                                                </div>
                                                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-5">
                                                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Batal</button>
                                                    <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-5">
                                <a className="btn btn-danger btn-md" href="/transaksi">Batal</a>
                                <button className="btn btn-info text-white btn-md" onClick={() => this.simpanTransaksi()}>Tambahkan</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FormTransaksi;