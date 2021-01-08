import React, { Component } from 'react'
import { read_cookie } from 'sfcookies'
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import axios,{CancelToken} from 'axios';
import { BaseUrl } from '../utils/utils';

export class BoardForm extends Component {
    constructor(){
        super()
        this.ref=React.createRef(null)
    }
    
    state={
        data:[""],
        name:"",
        value:[],
        loading:false
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
    cng=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    submit=(e)=>{
        let flag=1;
        e.preventDefault()
        for(let i=0;i<this.props.boards.length;i++){
            if(this.props.boards[i].name===this.state.name){
                flag=0
            }
        }
        if(flag===1){
            axios.post(BaseUrl+'board/update',{
                name:this.state.name,
                value:[...this.state.value,read_cookie('username')]
            }).then(res=>{
                const x=[...this.props.boards,{
                    name:res.data.name,
                    id:res.data._id
                }]
                this.props.setBoards(x)
                alert("board created!")
            }).catch(err=>{
                console.log(err)
            })
        }
        else{
            alert("Board already exist, choose another name")
        }
    }
    render() {
        console.log(this.state.value)
        return (
            <div className="row">
                <div className="col-md-4 offset-md-4">
                    <div className="card shadow p-3 mb-5 bg-white rounded">
                        <h2>Welcome, {read_cookie("username")}</h2>
                        <form onSubmit={this.submit}>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Enter Board Name</label>
                        <input type="text" className="form-control" required id="exampleInputEmail1" placeholder="Enter Board Name" name="name" onChange={this.cng}/>
                    </div>
                    <Autocomplete
                    multiple
                    id="tags-filled"
                    loading={this.state.loading}
                    options={this.state.data}
                    value={this.state.value}
                    onChange={(e, v) => {
                        console.log(v[v.length-1])
                        if(read_cookie('username')===v[v.length-1]){
                            alert("you can't set yourself a member")
                        }
                        else{
                            this.setState({value:v});
                        }
                    }}
                    onInputChange={(e,v)=>{
                        this.find()
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="filled"
                        label="Add as many users as you want"
                        placeholder="Type username "
                    />
                    )}
                />
                    <button type="submit" style={{
                        marginTop: '40px',
                        height: '50px',
                        width: '80%',
                        backgroundColor: 'Blue',
                        border: 0,
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '16px',
                        marginLeft:"10%"
                    }}>Submit</button>
                    </form>
                </div>
            </div>
            </div>
        )
    }
}

export default BoardForm
