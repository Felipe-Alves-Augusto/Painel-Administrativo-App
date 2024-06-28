import React from "react";
import './CardMachine.css';
import { GiVendingMachine } from "react-icons/gi";

const CardMachines = (props) => {

    return (
        <div className="card-machine">
            <div className="text">
                <p className="machine">{props.machine}</p>
                <div className="place">{props.shopping}</div>
                <div className="estoque">{props.estoque} Estoque</div>
            </div>

            <div className="machine-icon">
                <GiVendingMachine fill={props.color}></GiVendingMachine>
                <p>On-line</p>
            </div>
        </div>
    );

}


export default CardMachines;