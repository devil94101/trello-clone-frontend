const ini = {
    boards:[]
  };
  export const userReducer = (state = ini, action) => {
    switch (action.type) {
      case "setBoards":
        return {
          boards:action.payload
        };
      default:
        return state;
    }
  };