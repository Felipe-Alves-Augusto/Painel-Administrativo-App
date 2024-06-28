import React from "react";
import './TitlePage.css'


const TitlePage = (props) => {

    return (
        <h1 className="mt-5 mb-5 text-2xl font-medium text-gray-900 dark:text-white">{props.title}</h1>
    )
}

export default TitlePage