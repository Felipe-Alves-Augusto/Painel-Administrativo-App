import React from "react";
import HeaderSite from "../../components/ComponentsSite.jsx/HeaderSite";
import NavSite from "../../components/ComponentsSite.jsx/NavSite";
import SectionGestao from "../../components/ComponentsSite.jsx/SectionGestao";

const SiteHome = () => {
    return (
        <React.Fragment>
            <HeaderSite></HeaderSite>
            <NavSite></NavSite>
            <SectionGestao></SectionGestao>
        </React.Fragment>
    )
}

export default SiteHome;