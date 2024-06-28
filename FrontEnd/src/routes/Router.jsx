import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../views/Home";
import Company from "../views/Company";
import CreateCompany from "../views/CreateCompany";
import Machines from "../views/Machines";
import CreateMachines from "../views/CreateMachines";
import Register from "../views/Register";
import Login from "../views/Login";
import UpdateCompany from "../views/UpdateCompany";
import UpdateMachine from "../views/UpdateMachine";
import Bandeja from "../views/Bandeja";
import CreateBandeja from "../views/CreateBandeja";
import CreateProducts from "../views/CreateProducts";
import Forbidden from "../views/Forbidden";
import CreateLocation from "../views/CreateLocation";
import Location from "../views/Location";
import CreateChamado from "../views/CreateChamado";
import Chamado from "../views/Chamado";
import CreateFuncionarios from "../views/CreateFuncionarios";
import Funcionarios from "../views/Funcionarios";
import SiteHome from "../views/Site/Home";
import UpdateLocation from "../views/UpdateLocation";
import Permission from "../views/Permission";
import AppContext from "../context/AppContext";
import Abastecimento from "../views/Abastecimento";
import PermissionMachine from "../views/PermissionMachine";
import UpdateFuncionario from "../views/UpdateFuncionario";
import UpdateProduct from "../views/UpdateProduct";


const AppRoutes = () => {

    const { tokenUser, funcionario, userData } = useContext(AppContext)

    const token = localStorage.getItem('token');



    return (
        <Router>
            <Routes>
                <Route path="/" element={<SiteHome></SiteHome>}></Route>
                <Route path="/home" element={<Home></Home>}></Route>
                <Route path="/forbidden" element={<Forbidden></Forbidden>}></Route>
                <Route path="/registro" element={<Register></Register>}></Route>
                <Route path="/login" element={<Login></Login>}></Route>



                <Route path="/empresas" element={token ? <Company></Company> : <Forbidden></Forbidden>}></Route>
                <Route path="/empresas/cadastro" element={token ? <CreateCompany></CreateCompany> : <Forbidden></Forbidden>}></Route>
                <Route path="/empresa/editar/:docCompany" element={token ? <UpdateCompany></UpdateCompany> : <Forbidden></Forbidden>}></Route>
                <Route path="/bandejas" element={token ? <Bandeja></Bandeja> : <Forbidden></Forbidden>}></Route>
                <Route path="/bandejas/cadastro" element={token ? <CreateBandeja></CreateBandeja> : <Forbidden></Forbidden>}></Route>
                <Route path="/produtos/:docCompany/" element={token ? <CreateProducts></CreateProducts> : <Forbidden></Forbidden>}></Route>
                <Route path="/chamado/cadastro/:machineId/:docCompany" element={<CreateChamado></CreateChamado>}></Route>
                <Route path="/chamado/cadastro" element={<CreateChamado></CreateChamado>}></Route>
                <Route path="/chamados" element={<Chamado></Chamado>}></Route>
                <Route path="/locacao" element={token ? <Location></Location> : <Forbidden></Forbidden>}></Route>
                <Route path="/locacao/editar/:locationId/:docCompany" element={<UpdateLocation></UpdateLocation>}></Route>
                <Route path="/locacao/cadastro/:machineId" element={token ? <CreateLocation></CreateLocation> : <Forbidden></Forbidden>}></Route>
                <Route path="/maquinas" element={token ? <Machines></Machines> : <Forbidden></Forbidden>}></Route>
                <Route path="/maquinas/cadastro" element={token ? <CreateMachines></CreateMachines> : <Forbidden></Forbidden>}></Route>
                {/* <Route path="/maquina/editar/:machineId" element={token ? <UpdateMachine></UpdateMachine> : <Forbidden></Forbidden>}></Route> */}
                <Route path="/funcionario/cadastro" element={<CreateFuncionarios></CreateFuncionarios>}></Route>
                <Route path="/funcionarios" element={<Funcionarios></Funcionarios>}></Route>
                <Route path="/abastecimento" element={<Abastecimento></Abastecimento>}></Route>
                <Route path="/permissoes-maquina/:machineId/:docCompany" element={<PermissionMachine></PermissionMachine>}></Route>
                <Route path="/funcionario/editar/:idFunc/:docCompany" element={<UpdateFuncionario></UpdateFuncionario>}></Route>
                <Route path="/produto/editar/:docCompany/:idTray/:idProduct" element={<UpdateProduct></UpdateProduct>}></Route>

                {/* {funcionario != null && funcionario.permission.pageEmpresa == true &&
                    <>
                        <Route path="/empresas" element={token ? <Company></Company> : <Forbidden></Forbidden>}></Route>
                        <Route path="/empresas/cadastro" element={token ? <CreateCompany></CreateCompany> : <Forbidden></Forbidden>}></Route>
                        <Route path="/empresa/editar/:docCompany" element={token ? <UpdateCompany></UpdateCompany> : <Forbidden></Forbidden>}></Route>

                    </>

                } */}

                {/* {funcionario != null && funcionario.permission.pageBandeja == true &&
                    <>
                        <Route path="/bandejas" element={token ? <Bandeja></Bandeja> : <Forbidden></Forbidden>}></Route>
                        <Route path="/bandejas/cadastro" element={token ? <CreateBandeja></CreateBandeja> : <Forbidden></Forbidden>}></Route>
                        <Route path="/produtos/:docCompany" element={token ? <CreateProducts></CreateProducts> : <Forbidden></Forbidden>}></Route>
                    </>
                }

                {funcionario != null && funcionario.permission.pageChamado == true &&
                    <>
                        <Route path="/chamado/cadastro/:machineId/:docCompany" element={<CreateChamado></CreateChamado>}></Route>
                        <Route path="/chamados" element={<Chamado></Chamado>}></Route>
                    </>

                } */}

                {/* {funcionario != null && funcionario.permission.pageConfiguracao == true &&
                    // rota da página de configuração aqui
                } */}


                {/* {funcionario != null && funcionario.permission.pageLocacaoVenda == true &&
                    <>
                        <Route path="/locacao" element={token ? <Location></Location> : <Forbidden></Forbidden>}></Route>
                        <Route path="/locacao/editar/:locationId/:docCompany" element={<UpdateLocation></UpdateLocation>}></Route>
                        <Route path="/locacao/cadastro/:machineId" element={token ? <CreateLocation></CreateLocation> : <Forbidden></Forbidden>}></Route>

                    </>
                } */}

                {/* {funcionario != null && funcionario.permission.pageMaquina == true &&
                    <>
                        <Route path="/maquinas" element={token ? <Machines></Machines> : <Forbidden></Forbidden>}></Route>
                        <Route path="/maquinas/cadastro" element={token ? <CreateMachines></CreateMachines> : <Forbidden></Forbidden>}></Route>
                        
                    </>
                } */}

                {/* {funcionario != null && funcionario.permission.pageUser == true &&

                    <>
                        <Route path="/funcionario/cadastro" element={<CreateFuncionarios></CreateFuncionarios>}></Route>
                        <Route path="/funcionarios" element={<Funcionarios></Funcionarios>}></Route>
                    </>

                } */}

                
                <Route path="/permissao/:idFunc/:docCompany" element={<Permission></Permission>}></Route>
                

            </Routes>
        </Router>
    )

}

export default AppRoutes