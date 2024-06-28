import React from "react";
import './HeaderSite.css';
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

const HeaderSite = () => {

    return (
        <div className="header-top">
            <div className="container mx-auto px-4">
                <div className="wrapper-header-top">
                    <div className="contact-header">
                        <a href="">
                            <FaWhatsapp />
                        </a>
                        
                        <a href="">
                            <MdOutlineMail />
                        </a>
                    </div>
                    <div className="social-media-header">
                        <a href="">
                            <FaInstagram />
                        </a>

                        <a href="">
                            <FaLinkedinIn />
                        </a>

                        <a href="">
                            <FaTiktok />
                        </a>

                        <a href="">
                            <FaYoutube />
                        </a>
                        
                        
                        
                        
                    </div>
                </div>
            </div>

        </div>
    )

}

export default HeaderSite