import React from "react";
import './Card.css';


const Card = (props) => {

    return (
        <div style={{backgroundColor: `${props.background}`}} className="card">
            <div className="title">
                <p>{props.title}</p>
            </div>
            <div className="info-main">
                <h2>{props.infoMain}</h2>
            </div>
            <div className="porcents">
                <p className="porcent-one">{props.porcentOne}</p>
                <p className="porcent-two">{props.porcentTwo}</p>
            </div>
        </div>
    )

}

export default Card