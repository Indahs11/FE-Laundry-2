import React from "react";
import axios from "axios";

class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      username : "",
      password : ""
    }
  }

  loginProcess(event){
    event.preventDefault()
    let endpoint = "http://localhost:8000/auth"
    let request = {
      username : this.state.username,
      password : this.state.password
    }

    axios.post(endpoint, request)
    .then(result => {
      if(result.data.logged){
        //store token in local storage
        localStorage.setItem("token", result.data.token)
        localStorage.setItem("user", JSON.stringify(result.data.user))
        window.location.href = "/"
      }else{
        window.alert("Sorry, your username and password is invalid")
      }
    })
    .catch(error =>console.log(error))
  }

  render() {
    return (
      <div className="login-page">
        <div className="container d-flex h-100 justify-content-center align-items-center">
          <div className="col-lg-5 my-5">
            <div className="login-header text-center mb-5">
              <h4>SOlO</h4>
            </div>
            <div className="card p-4">
              <div className="card-body">
                <div className="text-center header">
                  <h5>Selamat Datang</h5>
                  <span>Masuk ke dalam akunmu sekarang</span>
                </div>
                <form onSubmit={ev => this.loginProcess(ev)}>
                    <div class="input-group mt-5 mb-4">
                      <span class="input-group-text" id="basic-addon1"><i class="fa-solid fa-address-book"></i></span>
                      <input type="text" class="form-control" placeholder="Masukkan Username" aria-label="Username" aria-describedby="basic-addon1" value={this.state.username} onChange={ev => this.setState({username : ev.target.value})} required/>
                    </div>
                    <div class="input-group my-3">
                      <span class="input-group-text" id="basic-addon1"><i class="fa-solid fa-lock"></i></span>
                      <input type="password" class="form-control" placeholder="Masukkan Password" aria-label="password" aria-describedby="basic-addon1" value={this.state.password} onChange={ev => this.setState({password : ev.target.value})} required/>
                    </div>
                    <div class="d-grid gap-2 mt-5">
                        <button class="btn btn-primary" type="submit">Login</button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
