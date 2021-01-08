import React, { Component } from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import './style.css'
import {BaseUrl} from '../utils/utils'
import {bake_cookie, read_cookie} from 'sfcookies'
export class Login extends Component {
    state={
        password:"",
        name:"",
        login:read_cookie('login')===true?true:false,
        error:""
    }
    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    submit=(e)=>{
        e.preventDefault();
        axios.post(BaseUrl+"user/login",this.state).then((res)=>{
          console.log(res.data)
          if(res.data.err){
            this.setState({error:res.data.msg})
          }
          else{
            bake_cookie('login',true);
            bake_cookie('username',this.state.name);
            bake_cookie('email',res.data.email);
            bake_cookie('token',res.data.token)
            this.setState({login:true})
          }
        }).catch(err=>{
          this.setState({error:"server Error"})
          console.log(err)
        })
    }
    render() {
      if(this.state.login){
        return(
            <Redirect to='/' />
        )
    }
        return (
            <div className="">
              {}
            <div className="form">
              <div className="container">
                <form onSubmit={this.submit}>
                  <input
                    placeholder="UserName"
                    type="text"
                    name="name"
                    className="username"
                    onChange={this.onChange}
                    required
                  />
                  <label className="login-label" htmlFor="username1">
                    Username Required
                  </label>
                  <input
                    placeholder="Password"
                    type="password"
                    className="password1"
                    name="password"
                    onChange={this.onChange}
                    required
                  />
                  <label className="login-label" htmlFor="password1">
                    Password Required
                  </label>
                  <div className="form-bottom">
                    <p>Don't have an account <a href="/signup">SignUp</a></p>
                  </div>
                  {this.state.error!==""&&(<p style={{color:"red"}}>{this.state.error}</p>)}
                  <button id="login" className="button" type="submit" >Login </button>
                </form>
              </div>
            </div>
          </div>
        )
    }
}

export default Login