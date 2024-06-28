import React from "react";
import './CardProducts.css';
import { FaTruckLoading } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { MdDateRange } from "react-icons/md";

const CardProducts = (props) => {

    return (
        <div className="products text-gray-900 bg-white dark:bg-gray-700 dark:text-white">
            <p type="button" className="line-card relative inline-flex items-center w-full px-4 py-2 text-sm border-b border-gray-200 rounded-t-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                <FaProductHunt></FaProductHunt>
                <b>Nome do Produto:</b>  {props.name}
            </p>

            <p type="button" className="line-card relative inline-flex items-center w-full px-4 py-2 text-sm  border-b border-gray-200 rounded-t-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                <FaTruckLoading></FaTruckLoading>
                <b>Estoque:</b> {props.estoque}
            </p>

            <p type="button" className="line-card relative inline-flex items-center w-full px-4 py-2 text-sm border-b border-gray-200 rounded-t-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                <RiMoneyDollarCircleFill></RiMoneyDollarCircleFill>
                <b>Valor:</b> {props.valor}
            </p>

            <p type="button" className="line-card relative inline-flex items-center w-full px-4 py-2 text-sm border-b border-gray-200 rounded-t-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                <MdDateRange></MdDateRange>
                <b>Validade:</b> {props.validade}
            </p>

            
            
            <div className="card-footer">
                <button onClick={() => props.click} type="button" className="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Remover</button>
            </div>
        </div>
    )

}

export default CardProducts;