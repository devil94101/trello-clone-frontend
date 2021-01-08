import React, { Component } from 'react'
import { BaseUrl } from '../utils/utils'
import axios,{CancelToken} from 'axios'
import {Redirect} from 'react-router-dom'
import './style.css'
import { read_cookie } from 'sfcookies'
export class SignUp extends Component {
  constructor(){
    super()
    this.ref=React.createRef(null)
}
    state={
        password:"",
        password2:"",
        email:"",
        name:"",
        error:"",
        userNameError:false,
        load:false,
        created:false,
        login:read_cookie('login')===true?true:false
    }
    cancelReq=()=>{
      if(this.ref.current){
          this.ref.current("Req cancel")
      }
  }
    onChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
        if(e.target.name==="name"){
          this.cancelReq()
          const options={
            cancelToken:new CancelToken(cancel=>this.ref.current=cancel)
        }
        
          axios.post(BaseUrl+'user/search',{name:e.target.value},options).then(res=>{
            if(res.data.err){
              this.setState({userNameError:true})
            }
            else{
              this.setState({userNameError:false})
            }
            console.log(res.data)
          }).catch(err=>{
              console.log(err.message)
          })
        }
    }
    submit=(e)=>{
        e.preventDefault();
        if(this.state.password!==this.state.password2){
          this.setState({error:"passwords are not same"})
        }
        else if(this.state.password.length<6){
          this.setState({error:"password should be atleast of 6 digits"})
        }
        else if(this.state.userNameError){
            alert("username already exist")
        }
        else{
          axios.post(BaseUrl+'user/register',this.state).then(res=>{
            this.setState({
              load:true
            })
            if(res.data.err){
              this.setState({
                load:false,
                error:res.data.msg
              })
            }
            else{
              alert("account created please login to start")
            }
          }).catch(err=>{
            this.setState({error:"server error"})
            console.log(err.message)
          })
        }
        
    }
    render() {
      if(this.state.login){
        return(
            <Redirect to='/' />
        )
    }
        return (
            <div className="">
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
                  {this.state.userNameError&&(<p style={{color:"red"}}>Username already exist</p>)}
                  <label className="login-label" htmlFor="name">
                    Username Required
                  </label>
                  <input
                    placeholder="Email"
                    type="email"
                    className="password1"
                    name="email"
                    onChange={this.onChange}
                    required
                  />
                  <label className="login-label" htmlFor="email">
                    email Required
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
                  <input
                    placeholder="Confirm Password"
                    type="password"
                    className="password1"
                    name="password2"
                    onChange={this.onChange}
                    required
                  />
                  <label className="login-label" htmlFor="password1">
                    Password Required
                  </label>
                  <div className="form-bottom">
                    <p>Already have an account <a href="/login">Login</a></p>
                  </div>
                  {this.state.error!==""&&(
                    <p style={{
                      color:'red'
                    }}>{this.state.error}</p>
                  )}
                  <button className="button" type="submit" >Login </button>
                </form>

              </div>
            </div>
          </div>
        )
    }
}

export default SignUp