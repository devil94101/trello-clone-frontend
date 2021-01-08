const ini = {
      list:{},
      name:'',
      users:[],
      id:''
  };
  export const listReducer = (state = ini, action) => {
    switch (action.type) {
      case "setList":
        return action.payload;
      default:
        return state;
    }
  };