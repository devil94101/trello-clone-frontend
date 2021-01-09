import React, { Component } from 'react';
import CloseIcon from '@material-ui/icons/Close'
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import Modal from 'react-modal';
import axios from 'axios'
import {BaseUrl} from '../utils/utils'
const customStyles = {
  content : {
    minHeight:"500px",
    minWidth:"500px",
    maxWidth:"700px",
    overflow:"auto",
    marginTop:"30px",
    margin:"auto",
  }
};
export default class App extends Component {
  state = {

    addMembers:false,
    users:this.props.list.list[this.props.num][this.props.index].users,
    title:this.props.list.list[this.props.num][this.props.index].title,
    num:this.props.num,
    description:this.props.list.list[this.props.num][this.props.index].description,
    types:["To Do","In Developement","To Be Reviewed","Finished"],
    titleInput:false
  };
  handleCng=(e)=>{
    this.setState({
      [e.target.name]:e.target.value
    })
  }
  
  move=(i)=>{
    const x=this.props.list
    const y=this.props.list.list[this.props.num][this.props.index]
    
    x.list[i+1].push(y)
    x.list[this.props.num].splice(this.props.index,1)
    axios.post(BaseUrl+"board/addList",x).then(res=>{
      console.log(res.data)
    }).catch(err=>{
        console.log(err.message)
    })
    this.props.setList(x)
    this.props.handleClose()
  }
  handleBlur=()=>{
    console.log('chalra')
    this.setState({titleInput:false})
  }
  save=()=>{
    axios.get(BaseUrl+'board/get/'+this.props.list.id).then(res=>{
      const data={
        title:this.state.title,
        description:this.state.description,
        users:this.state.users
      }
      const x={
        list:res.data.list,
        name:res.data.name,
        users:res.data.users,
        id:res.data._id
    } 
      x.list[this.props.num][this.props.index]=data
      console.log(x)
      axios.post(BaseUrl+"board/addList",x).then(res=>{
        console.log(res.data)
      }).catch(err=>{
          console.log(err.message)
      })
      this.props.setList(x)
      this.props.handleClose()
    })
    
  }
  delete=()=>{
    if(window.confirm("Are you sure you want to delete")){
      axios.get(BaseUrl+'board/get/'+this.props.list.id).then(res=>{
        const x={
          list:res.data.list,
          name:res.data.name,
          users:res.data.users,
          id:res.data._id
      } 
        x.list[this.props.num].splice(this.props.index,1)
        console.log(x)
        axios.post(BaseUrl+"board/addList",x).then(res=>{
          console.log(res.data)
        }).catch(err=>{
            console.log(err.message)
        })
        this.props.setList(x)
        this.props.handleClose()
      })
      
  }
    
  }
  render() {
    console.log(this.props.list.list)
    return (
      <div>
        <Modal isOpen={this.props.overlay}
        style={customStyles}
         onRequestClose={this.props.handleClose}
         ariaHideApp={false}>
            <CloseIcon onClick={this.props.handleClose} style={{
            position:"absolute",
            top:0,
            right:0,
            cursor:"pointer"
          }}></CloseIcon>
           <div className="row" style={{
             marginTop:"10px"
           }}>
           <div className="col-md-8">
            <div style={{
              maxWidth:"500px",
              minWidth:"500px",
            }}>
              {!this.state.titleInput?<h2 style={{
                wordBreak:"break-all",
                maxWidth:"600px",
                display:"block"
              }} onClick={()=>{this.setState({titleInput:true})}}>{this.state.title}</h2>:<textarea style={{
                width:"600px",
                height:"100px"
              }} type="text"
               name='title'onChange={this.handleCng} value={this.state.title} onBlur={this.handleBlur} autoFocus></textarea>}
              </div>
            <div style={{
              marginTop:"20px",
              maxWidth:"600px",
            }}>
                <Autocomplete
                    multiple
                    options={this.props.list.users}
                    value={this.state.users}
                    onChange={(e, v) => {
                      this.setState({users:v});
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="filled"
                        label="Add or remove members"
                        placeholder="Type username "
                    />
                    )}
                />
            </div>
            <div style={{
              marginTop:"40px",
              
            }}><h2>Description</h2>
              <textarea rows={5} cols={50} value={this.state.description} name="description" onChange={this.handleCng} style={{
                border:"1px solid black"
              }}></textarea>
            </div>
            <div style={{
              display:"flex",
              marginTop:"10px",
              justifyContent:"space-evenly"

            }}>
              <button style={{
                        backgroundColor: 'green',
                        border: 0,
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '16px',
                        padding:"10px 20px"
                    }} onClick={this.save}>Save</button>
                     <button style={{
                        backgroundColor: 'red',
                        border: 0,
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '16px',
                        padding:"10px 20px"
                    }} onClick={this.delete}>Delete</button>
            </div>
            </div>
            <div className="col-md-4">
                <div style={{
                  display:"flex",
                  justifyContent:"flex-end"
                }}>
                  <div>
                    <h2>Move to</h2>
                    {this.state.types.map((ele,i)=>{
                      if(i+1===this.state.num){
                        return(<div key={i}></div>)
                      }
                      else{
                        return(<div className="moveTo" key={i} onClick={()=>{this.move(i)}}>{ele}</div>)
                      }
                    })}
                  </div>
                </div>
            </div>
            
            </div>
        </Modal>
      </div>
    );
  }
}