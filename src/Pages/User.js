import React from 'react'
import { Modal } from "bootstrap" 
import axios from 'axios' 
import { authorization, baseUrl } from '../Config'
import UserPic from './user.png'

class User extends React.Component{
    constructor(){
        super()
        this.state = {
            masterUser: [],
            users : [],
            id_user: "",
            nama: "",
            username: "",
            password: "",
            role: "",
            search: "",
            fillPassword: true,
            visible: true,
            action: ""
        }
        if(!localStorage.getItem("token")){
            window.location.href = "/login"
        }
    }
    getData() {
        let endpoint = `${baseUrl}/users`
        axios.get(endpoint, authorization)
        .then(response => {
            this.setState({users: response.data})
            this.setState({masterUser: response.data})
        })
        .catch(error => console.log(error))
    }
    tambahData() {
        //Memunculkan Modal
        this.modalUser = new Modal(document.getElementById("tambah-modal"))
        this.modalUser.show()

        //Mengosongkan input
        this.setState({
             nama: "", username: "",password: "",role: "Admin", action: "tambah", fillPassword: true
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
            password : "",
            role : this.state.users[index].role,
            fillPassword: false,
            action : "ubah"
        })
    }
    simpanData(ev) {
        ev.preventDefault() // untuk mencegah berjalannya aksi default dari form submit

        //Menghilangkan modal
        this.modalUser.hide()

        //cek aksi tambah atau ubah
        if (this.state.action === "tambah"){
            let endpoint = `${baseUrl}/users`
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

            let endpoint = `${baseUrl}/users/` + this.state.id_user
            //mencari posisi index dari data member berdasarkan id_user pada array members

            let data = {
                id_user : this.state.id_user,
                nama : this.state.nama,
                username : this.state.username,
                role : this.state.role
            }
            if(this.state.fillPassword == true){
                data.password = this.state.password
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
            let endpoint = `${baseUrl}/users/${id_user}`

            axios.delete(endpoint, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }
    searching(ev) {
        let code = ev.keyCode; 
        if (code === 13) {
          let data = this.state.masterUser;
          let found = data.filter(it => 
            it.nama.toLowerCase().includes(this.state.search.toLowerCase()))
          this.setState({ users: found });
        }
      }
    showPassword(){
        if(this.state.fillPassword == true ){
            return(
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control mb-3" value={this.state.password} onChange={ev => this.setState({password: ev.target.value})}></input>
                </div> 
            )
        }else{
            return(
                <button className="btn btn-info btn-sm mb-5 text-white" onClick={() => this.setState({fillPassword: true})}>Ubah Password</button>
            )
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
                    <div className="container">
                        <div className="title-section row">
                            <div className="col-lg-5">
                                <h2>Selamat datang <br/>di <span>halaman <br/> user</span></h2>
                                <h6 className="mt-3">Gulir ke bawah untuk melihat data user</h6>
                                <div className="">
                                    <button class={`btn btn-primary me-md-2 my-3 ${this.state.visible ? `` : `d-none`}`} type="button" onClick={() => this.tambahData()}>Tambah Petugas</button>
                                </div>
                            </div>
                            <div className="col-lg-2"></div>
                            <div className="col-lg-5 p-0">
                                <img src={UserPic} width="500" className="img-respons"></img>
                            </div>
                        </div>
                    </div>
                    <div className="main-data">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-2 col-sm-4">
                                    <h3>Data Petugas</h3>
                                </div>
                                <div className="col-lg-7 col-sm-3"></div>
                                <div className="col-lg-3 col-sm-5 search-bar mt-3">
                                    <input type="text" placeholder="Cari data petugas" value={this.state.search} onChange={ev => this.setState({search: ev.target.value})} onKeyUp={(ev) => this.searching(ev)}></input>
                                </div>
                            </div>
                            <ul className="list-group">
                                {this.state.users.map(user=>(
                                    <li className="list-group-item data-list py-3">
                                        <div className="row">
                                            <div className="col-lg-1 col-sm-1">
                                                <small className="text-secondary">ID</small>
                                                <h6>0{user.id_user}</h6>
                                            </div>
                                            <div className="col-lg-4 col-sm-4">
                                                <small className="text-secondary">Nama</small>
                                                <h6>{user.nama}</h6>
                                            </div>
                                            <div className="col-lg-2 col-sm-2">
                                                <small className="text-secondary">Role</small>
                                                <h6>{user.role}</h6>
                                            </div>
                                            <div className="col-lg-3 col-sm-2">
                                                <small className="text-secondary">Username</small>
                                                <h6>{user.username}</h6>
                                            </div>
                                            <div className="col-lg-2 col-sm-3 px-5">
                                                <button className={`btn btn-info btn-sm mt-1 mx-2 ${this.state.visible ? `` : `d-none`}`} onClick={() => this.ubahData(user.id_user)}><i class="fa-solid fa-pen-to-square"></i></button>
                                                <button className={`btn btn-danger btn-sm mt-1 ${this.state.visible ? `` : `d-none`}`} onClick={() => this.hapusData(user.id_user)}><i class="fa-solid fa-trash"></i></button>
                                            </div>                                    
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="modal fade" id="tambah-modal" tabindex="-1" aria-labelledby="tambah-modal-label" aria-hidden="true">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="modal-title text-center ">
                                        <i class="fa-solid fa-user-gear rounded text-primary"></i>
                                        <h5 className="mb-4 mt-3" id="tambah-modal-label">Data Petugas</h5>
                                    </div>
                                    <form onSubmit={ev => this.simpanData(ev)}>
                                        <div className="form-group">
                                            <label>Nama</label>
                                            <input type="text" className="form-control mb-3" value={this.state.nama} onChange={ev => this.setState({nama: ev.target.value})} required></input>
                                        </div>
                                        <div className="form-group">
                                            <label>Username</label>
                                            <input type="text" className="form-control mb-3" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})}></input>
                                        </div>
                                        {/* <div className="form-group">
                                            <label>Password</label>
                                            <input type="password" className="form-control mb-3" value={this.state.password} onChange={ev => this.setState({password: ev.target.value})}></input>
                                        </div> */}
                                        <div className="form-group">
                                            <label>Role</label>
                                            <select className="form-control mb-3" value={this.state.role} onChange={ev => this.setState({role: ev.target.value})}>
                                                <option value="Admin">Admin</option>
                                                <option value="Kasir">Kasir</option>
                                                <option value="Owner">Owner</option>
                                            </select>
                                        </div>
                                        {this.showPassword()}
                                        <div className="text-center mt-5">
                                            <button type="button" class="btn btn-light btn-sm mx-2 px-3 py-2" data-bs-dismiss="modal">Batal</button>
                                            <button type="submit" className="btn btn-primary text-white btn-sm px-3 py-2">Simpan</button>
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