import React, { useContext } from "react";
import { ClipLoader } from 'react-spinners'
import AppContext from "../context/AppContext";
import './Loading.css'

const Loading = () => {

    const {loading} = useContext(AppContext);

    return (
        <>

            {loading &&
                <div className="wrapper-loading">
                    <ClipLoader color="#008080"></ClipLoader>
                </div>
                
            } 
        </>
        
    )
}

export default Loading;