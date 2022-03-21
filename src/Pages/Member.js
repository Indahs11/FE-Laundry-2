import React from "react";
import { Modal } from "bootstrap";
import { event } from "jquery";
import axios from "axios";
import { authorization, baseUrl } from "../Config.js";
import { Link } from "react-router-dom";
import MemberPic from "./member.png";

class Member extends React.Component {
  constructor() {
    super();
    this.state = {
      masterMembers: [],
      members: [],
      id_member: "",
      nama: "",
      alamat: "",
      telepon: "",
      jenis_kelamin: "",
      role: "",
      visible: true,
      search: "",
      action: "", //untuk menyimpan aksi dari tambah atau ubah data
    };

    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }
  getData() {
    let endpoint = `${baseUrl}/member`;
    axios.get(endpoint, authorization)
      .then((response) => {
        this.setState({ members: response.data });
        this.setState({ masterMembers: response.data });
      })
      .catch((error) => console.log(error));
  }
  tambahData() {
    //Memunculkan Modal
    this.modalMember = new Modal(document.getElementById("tambah-modal"));
    this.modalMember.show();

    //Mengosongkan input
    this.setState({
      id_member: Math.random(1, 10000),
      nama: "",
      jenis_kelamin: "Pria",
      alamat: "",
      telepon: "",
      action: "tambah",
    });
  }
  ubahData(id_member) {
    this.modalMember = new Modal(document.getElementById("tambah-modal"));
    this.modalMember.show();

    //mencari posisi index dari data member berdasarkan id_member pada array members
    let index = this.state.members.findIndex(
      (member) => member.id_member === id_member
    );

    this.setState({
      id_member: this.state.members[index].id_member,
      nama: this.state.members[index].nama,
      alamat: this.state.members[index].alamat,
      telepon: this.state.members[index].telepon,
      jenis_kelamin: this.state.members[index].jenis_kelamin,
      action: "ubah",
    });
  }
  simpanData(ev) {
    ev.preventDefault(); // untuk mencegah berjalannya aksi default dari form submit
    this.modalMember.hide();

    if (this.state.action === "tambah") {
      let endpoint = `${baseUrl}/member`;
      let newMember = {
        id_member: this.state.id_member,
        nama: this.state.nama,
        alamat: this.state.alamat,
        telepon: this.state.telepon,
        jenis_kelamin: this.state.jenis_kelamin,
      };
      axios.post(endpoint, newMember, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
    } else if (this.state.action === "ubah") {
      this.modalMember.hide();

      let endpoint = `${baseUrl}/member/` + this.state.id_member;
      let data = {
        id_member: this.state.id_member,
        nama: this.state.nama,
        alamat: this.state.alamat,
        telepon: this.state.telepon,
        jenis_kelamin: this.state.jenis_kelamin,
      };
      axios.put(endpoint, data, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }
  hapusData(id_member) {
    if (window.confirm("Apakah anda yakin menghapus data ini?")) {
      let endpoint = `${baseUrl}/member/${id_member}`;

      axios.delete(endpoint, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }
  showAddButton() {
    if (this.state.role === "Admin" || this.state.role === "Kasir") {
      return (
        <button
          class="btn btn-primary me-md-2 my-3"
          type="button"
          onClick={() => this.tambahData()}
        >
          Tambah Member
        </button>
      );
    }
  }
  searching(ev) {
    let code = ev.keyCode; 
    if (code === 13) {
      let data = this.state.masterMembers;
      let found = data.filter(it => 
        it.nama.toLowerCase().includes(this.state.search.toLowerCase()))
      this.setState({ members: found });
    }
  }
  componentDidMount() {
    this.getData();
    // cara pertama
    let user = JSON.parse(localStorage.getItem("user"));
    this.setState({ role: user.role });
    // cara kedua
    if (user.role === "Admin" || user.role === "Kasir") {
      this.setState({ visible: true });
    } else {
      this.setState({ visible: false });
    }
  }

  render() {
    return (
      <div className="member-page">
        <div className="main-content">
          <div className="container">
            <div className="title-section row">
              <div className="col-lg-5">
                <h2>Selamat datang <br />di <span>halaman member</span></h2>
                <h6 className="mt-3">Gulir ke bawah untuk melihat data member</h6>
                <div className="">{this.showAddButton()}</div>
              </div>
              <div className="col-lg-3"></div>
              <div className="col-lg-4">
                <img src={MemberPic} width="350" className="img-respons"></img>
              </div>
            </div>
          </div>
          <div className="main-data">
            <div className="container">
              <div className="row">
                <div className="col-lg-2 col-sm-4">
                  <h3>Data Member</h3>
                </div>
                <div className="col-lg-7 col-sm-3"></div>
                <div className="col-lg-3 col-sm-5 search-bar mt-3">
                  <input type="text" placeholder="Cari data member" value={this.state.search} onChange={ev => this.setState({search: ev.target.value})} onKeyUp={(ev) => this.searching(ev)}></input>
                </div>
              </div>
              <ul className="list-group">
                {this.state.members.map((member) => (
                  <li className="list-group-item data-list py-3 card">
                    <div className="row">
                      <div className="col-lg-3 col-sm-4">
                        <small className="text-secondary">Nama</small>
                        <h6>{member.nama}</h6>
                      </div>
                      <div className="col-lg-1 col-sm-2">
                        <small className="text-secondary">Gender</small>
                        <h6>{member.jenis_kelamin}</h6>
                      </div>
                      <div className="col-lg-2 col-sm-3">
                        <small className="text-secondary">Telepon</small>
                        <h6>{member.telepon}</h6>
                      </div>
                      <div className="col-lg-4 col-sm-9">
                        <small className="text-secondary">Alamat</small>
                        <h6>{member.alamat}</h6>
                      </div>
                      <div className="col-lg-2 col-sm-3 px-5">
                        <button className={`btn btn-info btn-sm mt-1 mx-2 ${ this.state.visible ? `` : `d-none` }`} onClick={() => this.ubahData(member.id_member)} >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button className={`btn btn-danger btn-sm mt-1 ${ this.state.visible ? `` : `d-none` }`} onClick={() => this.hapusData(member.id_member)}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
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
                    <i class="fa-solid fa-user-tag rounded text-primary"></i>
                    <h5 className="mb-4 mt-3" id="tambah-modal-label">
                      Data Member
                    </h5>
                  </div>
                  <form onSubmit={(ev) => this.simpanData(ev)}>
                    <div className="form-group">
                      <label>Nama</label>
                      <input type="text" className="form-control mb-3" value={this.state.nama} onChange={(ev) =>this.setState({ nama: ev.target.value })}required></input>
                    </div>
                    <div className="form-group">
                      <label>Alamat</label>
                      <input type="text" className="form-control mb-3" value={this.state.alamat} onChange={(ev) => this.setState({ alamat: ev.target.value })}
                      ></input>
                    </div>
                    <div className="form-group">
                      <label>Telepon</label>
                      <input type="text" className="form-control mb-3" value={this.state.telepon} onChange={(ev) => this.setState({ telepon: ev.target.value })}
                      ></input>
                    </div>
                    <div className="form-group">
                      <label>Jenis Kelamin</label>
                      <select className="form-control mb-2" value={this.state.jenis_kelamin} onChange={(ev) => this.setState({ jenis_kelamin: ev.target.value })}>
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="pria">Pria</option>
                        <option value="wanita">Wanita</option>
                      </select>
                    </div>
                    <div className="text-center mt-5">
                      <button type="button" class="btn btn-light btn-sm mx-2 px-3 py-2" data-bs-dismiss="modal">Batal</button>
                      <button type="submit" className="btn btn-primary text-white btn-sm px-3 py-2" >Simpan</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Member;
