import React from 'react'
import { Modal } from "bootstrap" 
import axios from 'axios' 
import { authorization } from '../Config'

class User extends React.Component{
    constructor(){
        super()
        this.state = {
            users : [],
            id_user: "",
            nama: "",
            username: "",
            password: "",
            role: "",
            visible: true,
            action: ""
        }
        if(!localStorage.getItem("token")){
            window.location.href = "/login"
        }
    }
    getData() {
        let endpoint = "http://localhost:8000/users"
        axios.get(endpoint, authorization)
        .then(response => {
            this.setState({users: response.data})
        })
        .catch(error => console.log(error))
    }
    tambahData() {
        //Memunculkan Modal
        this.modalUser = new Modal(document.getElementById("tambah-modal"))
        this.modalUser.show()

        //Mengosongkan input
        this.setState({
            id_user: Math.random(1,100), nama: "", username: "",password: "",role: "Admin", action: "tambah"
        })
    }
    ubahData(id_user) {
        this.modalUser = new Modal(document.getElementById("tambah-modal"))
        this.modalUser.show()

        //mencari posisi index dari data member berdasarkan id_user pada array members
        let index = this.state.users.findIndex((user) => user.id_user === id_user)

        this.setState({
            id_user : this.state.users[index].id_user,
            nama : this.state.users[index].nama,
            username : this.state.users[index].username,
            password : this.state.users[index].password,
            role : this.state.users[index].role,
            action : "ubah"
        })
    }
    simpanData(ev) {
        ev.preventDefault() // untuk mencegah berjalannya aksi default dari form submit

        //Menghilangkan modal
        this.modalUser.hide()

        //cek aksi tambah atau ubah
        if (this.state.action === "tambah"){
            let endpoint = "http://localhost:8000/users"
            //Menampung data
            let newUser = {
                id_user : this.state.id_user,
                username : this.state.username,
                nama : this.state.nama,
                password : this.state.password,
                role : this.state.role,
            }
            // let temp = this.state.users
            // temp.push(newUser)

            // this.setState({users: temp})
            axios.post(endpoint, newUser, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))

        }else if(this.state.action === "ubah"){
            this.modalUser.hide()

            let endpoint = "http://localhost:8000/users/" + this.state.id_user
            //mencari posisi index dari data member berdasarkan id_user pada array members

            let data = {
                id_user : this.state.id_user,
                nama : this.state.nama,
                username : this.state.username,
                password : this.state.password,
                role : this.state.role
            }
            axios.put(endpoint, data, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }
    hapusData(id_user){
        if(window.confirm("Apakah anda yakin menghapus data ini?")){
            let endpoint = "http://localhost:8000/users/" + id_user

            axios.delete(endpoint, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }
    componentDidMount(){
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
        this.setState({role: user.role})

        if(user.role === "Admin"){
            this.setState({visible: true})
        }else{
            this.setState({visible: false})
        }
    }
    render(){
        return(
            <div className="user-page">
                <div className="main-content">
                    <div className="">
                        <div className="row mb-2">
                            <div className="col-lg-10 col-md-6">
                                <h3 className="text-secondary pt-4">Data User</h3>
                            </div>
                            <div className="col-lg-2 col-md-6 d-grid gap-2 d-md-flex justify-content-md-end">
                                <button class={`btn btn-primary me-md-2 my-3 ${this.state.visible ? `` : `d-none`}`} type="button" onClick={() => this.tambahData()}>Tambah User</button>
                            </div>
                        </div>
                        <ul className="list-group data-list">
                            {this.state.users.map(user=>(
                                <li className="list-group-item py-3">
                                    <div className="row">
                                        <div className="col-lg-1">
                                            <small className="text-secondary">ID</small>
                                            <h6>0{user.id_user}</h6>
                                        </div>
                                        <div className="col-lg-4">
                                            <small className="text-secondary">Nama</small>
                                            <h6>{user.nama}</h6>
                                        </div>
                                        <div className="col-lg-3">
                                            <small className="text-secondary">Role</small>
                                            <h6>{user.role}</h6>
                                        </div>
                                        <div className="col-lg-3">
                                            <small className="text-secondary">Username</small>
                                            <h6>{user.username}</h6>
                                        </div>
                                        <div className="col-lg-1">
                                            <button className={`btn btn-info btn-sm mt-1 mx-2 ${this.state.visible ? `` : `d-none`}`} onClick={() => this.ubahData(user.id_user)}><i class="fa-solid fa-pen-to-square"></i></button>
                                            <button className={`btn btn-danger btn-sm mt-1 ${this.state.visible ? `` : `d-none`}`} onClick={() => this.hapusData(user.id_user)}><i class="fa-solid fa-trash"></i></button>
                                        </div>                                    
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="modal fade" id="tambah-modal" tabindex="-1" aria-labelledby="tambah-modal-label" aria-hidden="true">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title" id="tambah-modal-label">Form Data User</h5>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={ev => this.simpanData(ev)}>
                                        <div className="form-group">
                                            <label>Nama</label>
                                            <input type="text" className="form-control mb-2" value={this.state.nama} onChange={ev => this.setState({nama: ev.target.value})} required></input>
                                        </div>
                                        <div className="form-group">
                                            <label>Username</label>
                                            <input type="text" className="form-control mb-2" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})}></input>
                                        </div>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input type="text" className="form-control mb-2" value={this.state.password} onChange={ev => this.setState({password: ev.target.value})}></input>
                                        </div>
                                        <div className="form-group">
                                            <label>Role</label>
                                            <select className="form-control mb-2" value={this.state.role} onChange={ev => this.setState({role: ev.target.value})}>
                                                <option value="Admin">Admin</option>
                                                <option value="Kasir">Kasir</option>
                                                <option value="Owner">Owner</option>
                                            </select>
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
                </div>
            </div>
        )
    }
}
export default User;