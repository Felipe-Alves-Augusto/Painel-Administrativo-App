import React from "react";
import './Menu.css';
import { Link } from "react-router-dom";

const MenuItem = (props) => {

    return (
        <li>
            <span>{props.icon}</span>
            <a href={props.link}>{props.name}</a>
        </li>
    )


}

export default MenuItem;