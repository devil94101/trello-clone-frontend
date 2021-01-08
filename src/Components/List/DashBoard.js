import axios from 'axios'
import React, { Component } from 'react'
import {Redirect,Link} from 'react-router-dom'
import {read_cookie,delete_cookie} from 'sfcookies'
import {connect} from 'react-redux'
import {setBoards} from '../../Redux/user/userActions'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BoardForm from '../Form/BoardForm'
import './style.css'
import { BaseUrl } from '../utils/utils'
export class DashBoard extends Component {
    
    state={
        login:read_cookie('login')===true?true:false,
        load:true
    }
    logout=()=>{
        delete_cookie("login")
        delete_cookie("username")
        delete_cookie("token")
        delete_cookie("email")
        this.setState({login:false})
        this.props.setBoards([])
    }
    componentDidMount(){
        if(this.props.boards.length===0&&this.state.load)
        {const options={
            headers:{
                'x-auth-token':read_cookie("token")
            }
        }
        
        axios.post(BaseUrl+"user/get",{},options).then(res=>{
            if(res.data.err){
                this.logout()
            }
            else{
                this.props.setBoards(res.data.boards)
                this.setState({
                    load:false
                })
            }
        }).catch(err=>{
            console.log(err.message)
        })}
        else{
            this.setState({load:false})
        }
    }
    render() {
        if(!this.state.login){
            return(
                <Redirect to='/login'  />
            )
        }
        else if(this.state.load){
            return(<div>Loading...</div>)
        }
        else{
            console.log(this.props.boards)
            return(
                <div>
                    <div className="headd">
                        <p style={{
                            color:"white"
                        }}>Welcome {read_cookie("username")}</p>
                        <p onClick={this.logout} className="logout"><ExitToAppIcon/> LOGOUT</p>

                    </div>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-around"
                    }}>
                        <h1 style={{
                            color:"#7d34eb",
                            marginTop:'10px'
                        }}>Boards</h1>
                        <Link to="/createBoard" style={{
                            textDecoration:'none'
                        }}><div className="create" ><p>Create New Board</p></div></Link>
                    </div>
                    {this.props.boards.length===0?<div className="noBoards">
                            <center><h1 style={{
                                color:"#7d34eb"
                            }}>No Boards Yet Create One Now!</h1>
                            </center>
                            <div style={{
                                marginTop:"50px"
                            }}>
                            <BoardForm boards={this.props.boards} setBoards={this.props.setBoards}/>
                            </div>
                      
                    </div>:<div className="boards">
                        
                            {this.props.boards.map((ele,i)=>{
                                return(<Link  key={i} style={{
                                    textDecoration:"none"
                                }} to={'/dashboard/'+ele.id}><div className="tile"><p style={{
                                    marginTop:"15px",
                                    marginLeft:"15px",
                                    color:"black"
                                }}>{ele.name}</p></div></Link>)
                            })}
                        </div>}
                </div>
            )
        }
    }
}
const mapStateToProps=(state)=>{
    return({
        boards:state.user.boards
    })
}
const mapDispatch=(dispatch)=>{
    return{
        setBoards:(data)=>{
            dispatch(setBoards(data))
        }
    }
}

export default connect(mapStateToProps,mapDispatch)(DashBoard)
