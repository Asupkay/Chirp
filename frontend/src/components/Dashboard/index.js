import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Chart from "../chart/";


class Dashboard extends Component{

    render(){
        let message
        message = <Chart />;

        return(
                <div>
                <h2>Welcome to Dashboard!!</h2>
                <form>
                    <a>Search for Company</a>
                    <input type="text" name="firstname"></input>
                    <button>Search</button>
                </form>
                {message}
                </div>



        )
    }
}

export default Dashboard;
