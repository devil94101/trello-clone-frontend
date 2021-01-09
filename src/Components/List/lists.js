import React, { Component } from 'react'
import {BaseUrl} from '../utils/utils'
import axios from 'axios'
import './style.css'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import {Link} from 'react-router-dom'
import ModalComponent from './Modal'
import {connect} from 'react-redux'
import {setList} from '../../Redux/List/listAction'
import { read_cookie } from 'sfcookies';
import AddMember from './AddMember'
export class lists extends Component {

    state={
        data:{},
        listNumber:0,
        load:true,
        title:"",
        overlay:false,
        selectedIndex:0,
        num:1,
        memberModal:false
    }
   handleClose=()=>{
       this.setState({overlay:false})
   }
    componentDidMount(){

        axios.get(BaseUrl+'board/get/'+this.props.match.params.id).then(res=>{
            this.props.setList({
                list:res.data.list,
                name:res.data.name,
                users:res.data.users,
                id:res.data._id
            })
            this.setState({
                load:false,
            })
            
        }).catch(err=>{
            console.log(err.message)
        })
    }
    updateList=(num)=>{
        if(this.state.title===""){
            alert("list title can't be empty!")
        }
        else{
            let flag=false
            for(let i=0;i<this.props.list.list[num].length;i++){
                if(this.state.title===this.props.list.list[num][i].title){
                    flag=true
                    break
                }
            }
            if(flag){
               alert("Already have a list of same title")
            }
            else{
                axios.get(BaseUrl+'board/get/'+this.props.list.id).then(res=>{
                    let x={
                        list:res.data.list,
                        name:res.data.name,
                        users:res.data.users,
                        id:res.data._id
                    }                
                    x.list[num].push({
                        title:this.state.title,
                        description:"",
                        users:[read_cookie('username')]
                    })
                    this.props.setList(x)
                    this.setState({
                        listNumber:0,
                        title:"",
                    })
                    
                    axios.post(BaseUrl+"board/addList",x).then(res=>{
                        console.log(res.data)
                    }).catch(err=>{
                        console.log(err.message)
                    })
                })
                
            }
        }
    }
    listName=(num,text)=>{
        return(<div className="listName">
        <div className="nameStyle">
            <p style={{
                marginLeft:"10px",
                marginTop:"10px"
            }} >{text}</p><AddCircleOutlineIcon style={{
                cursor:"pointer"
            }} onClick={()=>{
                this.setState({listNumber:num})
            }}/>

        </div>
        <div className="listBlock">
            {this.props.list.list[num].map((ele,i)=>{
                return(<div key={i} style={{
                    cursor:"pointer"
                }} className="cardList" onClick={()=>{this.setState({
                    overlay:true,
                    selectedIndex:i,
                    num
                })}}><p style={{
                    margin:"5px",
                    display:'block',
                    wordBreak:"break-all"
                }}>{ele.title}</p></div>)
            })}
            {this.state.listNumber===num&&(
                <div className="listCard">
                    <textarea rows="1" style={{
                        width:"100%",
                        maxHeight:"500px",
                        minHeight:'100px'
                        
                    }} value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} placeholder="Card Title"/>

                    <div style={{
                        display:"flex",
                        justifyContent:"space-between"
                    }}><button className="btn btn-success" onClick={()=>{this.updateList(num)}}>Add Card</button>

                    <CloseIcon onClick={()=>{this.setState({listNumber:0})}} style={{
                        marginTop:"10px",
                        cursor:"pointer"
                    }}/></div>
                </div>
            )}
        </div>
    </div>)
    }
    memberClose=()=>{
        this.setState({memberModal:false})
    }
    render() {
        if(this.state.load){
            return(<div>Loading...</div>)
        }
        else{
            return (
            <div>
            <div className="headd">
                <Link style={{
                    textDecoration:"none",
                    color:"white"
                }} to="/"><p style={{
                    padding:"10px"
                }}>Home</p></Link>
            </div>
            <div className="headd listTitle">
                <h2 style={{
                    padding:"20px",
                    marginTop:"5px"
                }}>{this.props.list.name}</h2>
                <button style={{
                    border:"none",
                    padding:"8px",
                    borderRadius:"10px"
                }} onClick={()=>{this.setState({memberModal:true})}}>Add Members</button>
            </div>
            <div className="allList">
                {this.listName(1,"To Do")}
                    {this.listName(2,"In Developement")}
                    {this.listName(3,"To Be Reviewed")}
                    {this.listName(4,"Finished")}
            </div>
            {this.state.overlay?<ModalComponent list={this.props.list} 
            num={this.state.num} setList={this.props.setList} 
            overlay={this.state.overlay} index={this.state.selectedIndex} 
            handleClose={this.handleClose}/>:""}
            {this.state.memberModal?
            <AddMember open={this.state.memberModal} close={this.memberClose} 
            list={this.props.list} 
            setList={this.props.setList} />:""}
            </div>
            )
        }
    }
}
const mapStateToProps=(state)=>{
    return({
        list:state.list
    })
}
const mapDispatch=(dispatch)=>{
    return{
        setList:(data)=>{
            dispatch(setList(data))
        }
    }
}
export default connect(mapStateToProps,mapDispatch)(lists)
