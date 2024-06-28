import React from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import CardMachines from "../components/CardMachine";
import { PieChart } from '@mui/x-charts/PieChart';
import Menu from '../components/Menu'




const Home = () => {
    

    return (
        <>
            <Menu></Menu>
            <div className="wrapper-page">
                <Header></Header>
                <div className="wrapper-cards">
                    <Card
                        background="#e2ffed"
                        title="Faturamento"
                        infoMain="R$ 50.000"
                        porcentOne="+18%"
                        porcentTwo="+30,8k nesta semana"
                    ></Card>

                    <Card
                        background="#fff"
                        title="Tempo de Máquinas Paradas"
                        infoMain="20 min"
                        
                        porcentTwo="+20 nesta semana"
                    ></Card>

                    <Card
                        background="#fff"
                        title="Média vendas p/ máquinas"
                        infoMain="R$ 3.000"
                        porcentOne="+18%"
                        porcentTwo="-1,2k nesta semana"
                    ></Card>
                </div>

                <div className="title-machines">
                    Minhas Máquinas
                </div>

                <div className="section-data">
                    <div className="wrapper-machines">
                        <CardMachines machine="Máquina 1"
                        shopping="Shopping A"
                        estoque="30%"
                        color="#04bb65"></CardMachines>

                        <CardMachines machine="Máquina 1"
                        shopping="Shopping B"
                        estoque="30%"
                        color="#04bb65"></CardMachines>

                        <CardMachines machine="Máquina 2"
                        shopping="Shopping C"
                        estoque="30%"
                        color="#04bb65"></CardMachines>

                        <CardMachines machine="Máquina 2"
                        shopping="Shopping C"
                        estoque="30%"
                        color="#f03a2c"></CardMachines>
                    </div>

                    <div className="chart">
                        <h2>Vendas por Máquina</h2>
                        <PieChart
                            series={[
                                {
                                data: [ 
                                    { id: 0, value: 10, label: 'Máquina 1' },
                                    { id: 1, value: 15, label: 'Máquina 2' },
                                    { id: 2, value: 20, label: 'Máquina 3' },
                                ],
                                },
                            ]}
                            width={400}
                            height={200}
                        />
                    </div>
                </div>

            </div>
        
        </>
    )

}


export default Home