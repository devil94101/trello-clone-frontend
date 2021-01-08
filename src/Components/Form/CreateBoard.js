import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {BoardForm} from './BoardForm'
import {setBoards} from '../../Redux/user/userActions'
import { connect } from 'react-redux'
export class CreateBoard extends Component {
    render() {
        return (
            <div style={{
                marginTop:"10%"
            }}>
                <BoardForm boards={this.props.boards} setBoards={this.props.setBoards}/>
                <div style={{
                    marginTop:"10px",
                    display:"flex",
                    justifyContent:"center"

                }}>
                    <Link to="/">
                        {"<<"}Go Back To Home Screen
                    </Link>
                </div>
            </div>
        )
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

export default connect(mapStateToProps,mapDispatch)(CreateBoard)
