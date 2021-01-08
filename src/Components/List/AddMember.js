import React, { Component } from 'react';
import CloseIcon from '@material-ui/icons/Close'
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import Modal from 'react-modal';
import axios,{CancelToken} from 'axios'
import {BaseUrl} from '../utils/utils'
import {read_cookie} from 'sfcookies'
const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        minHeight:"300px"
      }
};
export default class AddMember extends Component {
  
    constructor(props){
        super(props)
        this.ref=React.createRef(null)
    }
    
    state={
        data:[],
        loading:false,
        value:this.props.list.users
    }
    cancelReq=()=>{
        if(this.ref.current){
            this.ref.current("Req cancel")
        }
    }
    find=(text)=>{
        this.cancelReq()
        this.setState({loading:true})
        const options={
            cancelToken:new CancelToken(cancel=>this.ref.current=cancel)
        }
        axios.post(BaseUrl+'user/findUser',{text},options).then(res=>{
            console.log(res.data)
            this.setState({
                loading:false,
                data:res.data
            })
        }).catch(err=>{
            console.log(err.message)
        })
    }
    save=()=>{
        const x=this.props.list
        x.users=this.state.value
        axios.post(BaseUrl+"board/addList",x).then(res=>{
        console.log(res.data)
        }).catch(err=>{
            console.log(err.message)
        })
        this.props.setList(x)
        this.props.close()
    }
  render() {
      console.log(this.props.list)
    return (
      <div>
        <Modal isOpen={this.props.open}
        style={customStyles}
         onRequestClose={this.props.close}
         ariaHideApp={false}>
            <CloseIcon onClick={this.props.close} style={{
            position:"absolute",
            top:0,
            right:0,
            cursor:"pointer"
          }}></CloseIcon>
           <Autocomplete
                    multiple
                    options={this.props.list.users}
                    style={{
                        marginTop:"20px"
                    }}
                    value={this.state.value}
                    onChange={(e, v) => {
                        if(v.length<this.state.value.length){
                            let flag=0
                            for(let i=0;i<v.length;i++){
                                if(read_cookie('username')===v[i]){
                                    flag=1
                                }
                                break
                            }
                            if(flag===0){
                                alert("can't remove yourself from board")
                            }
                            else{
                                this.setState({value:v});
                            }
                        }
                        else{
                            this.setState({value:v});
                        }
                    }}
                    onInputChange={(e,v)=>{
                        this.find()
                    }}
                    loading={this.state.loading}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="filled"
                        label="Add or remove members"
                        placeholder="Type username "
                    />
                    )}
                />
                <div style={{
                    marginTop:"20px",
                    marginLeft:"20px"
                }}> <button className="btn btn-success" onClick={this.save}>Save</button></div>
        </Modal>
      </div>
    );
  }
}