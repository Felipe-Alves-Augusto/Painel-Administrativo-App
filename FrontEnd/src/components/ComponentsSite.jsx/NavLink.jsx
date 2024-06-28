import React from "react";


const NavLink = (props) => {
    return (
        <li>
            <a href={props.link} className="block py-2 px-3 text-gray-900 bg-dark-700 text-lg rounded md:bg-transparent md:text-dark-700 md:p-0 dark:text-white md:dark:text-dark-500" aria-current="page">{props.text}</a>
        </li>
    )
}

export default NavLink