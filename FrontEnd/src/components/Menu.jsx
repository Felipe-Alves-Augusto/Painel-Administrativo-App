import React, { useContext, useState } from "react";
import './Menu.css'
import MenuItem from "./MenuItem";
import { MdDashboard } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { FaProductHunt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbReportSearch } from "react-icons/tb";
import { FaBuilding } from "react-icons/fa";
import { GiWashingMachine } from "react-icons/gi";
import { FaLocationDot } from "react-icons/fa6";
import { GiAutoRepair } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import AppContext from "../context/AppContext";
import { FaTruck } from "react-icons/fa";


const Menu = () => {

    const [showMenu, setShowMenu] = useState(true);

    const { userData, funcionario } = useContext(AppContext);




    const handleClickBtnClose = () => {
        setShowMenu(false);
    }

    return (
        <React.Fragment>
            {showMenu &&
                <aside className="left">
                    <div className="close">
                        <button onClick={handleClickBtnClose} type="button">
                            <IoMdClose></IoMdClose>
                        </button>
                    </div>
                    <ul>
                        <MenuItem link="/home" name="Dashboard" icon={<MdDashboard></MdDashboard>}></MenuItem>


                        {userData && userData.type_user == 'adm' &&
                            <>
                                <MenuItem link="/empresas" name="Empresas" icon={<FaBuilding></FaBuilding>}></MenuItem>
                                <MenuItem link="/funcionarios" name="Usuários" icon={<FaUserGroup></FaUserGroup>}></MenuItem>

                                <MenuItem link="/maquinas" name="Máquinas" icon={<GiWashingMachine></GiWashingMachine>}></MenuItem>

                                <MenuItem link="/bandejas" name="Bandejas" icon={<FaProductHunt></FaProductHunt>}></MenuItem>
                                < MenuItem link="/abastecimento" name="Abastecimento" icon={<FaTruck />}></MenuItem>
                                <MenuItem link="/locacao" name="Locação/Venda" icon={<FaLocationDot ></FaLocationDot>}></MenuItem>
                                <MenuItem link="/chamados" name="Chamados" icon={<GiAutoRepair></GiAutoRepair>}></MenuItem>

                                <MenuItem name="Configurações" icon={<IoMdSettings></IoMdSettings>}></MenuItem>
                            </>
                        }


                        {funcionario != null && funcionario.permission.pageEmpresa == true &&
                            <MenuItem link="/empresas" name="Empresas" icon={<FaBuilding></FaBuilding>}></MenuItem>
                        }


                        {funcionario != null && funcionario.permission.pageUser == true &&
                            <MenuItem link="/funcionarios" name="Usuários" icon={<FaUserGroup></FaUserGroup>}></MenuItem>
                        }

                        {funcionario != null && funcionario.permission.pageMaquina == true &&
                            <MenuItem link="/maquinas" name="Máquinas" icon={<GiWashingMachine></GiWashingMachine>}></MenuItem>
                        }


                        {funcionario != null && funcionario.permission.pageAbastecimento == true &&
                            < MenuItem link="/abastecimento" name="Abastecimento" icon={<GiWashingMachine></GiWashingMachine>}></MenuItem>
                        }


                        {funcionario != null && funcionario.permission.pageBandeja == true &&
                            <MenuItem link="/bandejas" name="Bandejas" icon={<FaProductHunt></FaProductHunt>}></MenuItem>
                        }

                        {funcionario != null && funcionario.permission.pageLocacaoVenda == true &&
                            <MenuItem link="/locacao" name="Locação/Venda" icon={<FaLocationDot ></FaLocationDot>}></MenuItem>
                        }

                        {funcionario != null && funcionario.permission.pageChamado == true &&

                            <MenuItem link="/chamados" name="Chamados" icon={<GiAutoRepair></GiAutoRepair>}></MenuItem>
                        }



                        {/* {funcionario != null && funcionario.permission.pageRelatorio == true &&
                            <MenuItem name="Relatórios" icon={<TbReportSearch></TbReportSearch>}></MenuItem>
                        } */}

                        {funcionario != null && funcionario.permission.pageConfiguracao == true &&

                            <MenuItem name="Configurações" icon={<IoMdSettings></IoMdSettings>}></MenuItem>
                        }




                    </ul>
                </aside>
            }
        </React.Fragment >



    )

}

export default Menu;