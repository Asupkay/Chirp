import React, { Component } from 'react';

//Components
import GoogleLogin from './GoogleLogin/'


//import config from '../../../config';

class Social extends Component{

    render(){
        return(
            <div>
                <h2>Crip - Online Twitter Sentiment Analysis</h2>
                <p>
                    <GoogleLogin />
                </p>
            </div>
        )
    }
}

export default Social;
