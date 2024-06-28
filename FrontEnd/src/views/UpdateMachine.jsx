import React, { useContext, useState } from "react";
import Input from "../components/Input";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import AppContext from "../context/AppContext";
import Menu from "../components/Menu";

import Message from "../components/Message";
import { useParams } from "react-router-dom";


const UpdateMachine = () => {

    const { dataCompany, setShowMessage } = useContext(AppContext);

    const { machineId } = useParams();
    const machine = dataCompany.data.machines.filter(machine => (machine.id === machineId));

    const [modelMachine, setModelMachine] = useState(machine[0].modelMachine);
    const [numberSerie, setNumberSerie] = useState(machine[0].numberSerie);
    const [description, setDescription] = useState(machine[0].description);
    const [amountTray, setAmountTray] = useState(machine[0].amountTray);
    const [amountProductTray, setAmountProductTray] = useState(machine[0].amountProductTray);
    const [garantia, setGarantia] = useState(machine[0].garantia);
    const [status, setStatus] = useState(machine[0].status);




    // if(dataCompany && dataCompany.data && dataCompany.data.machines) {
    //     teste = 


    // }


    const handleModelMachine = (e) => {


        setModelMachine(e);
    }

    const handleNumberSerie = (e) => {
        setNumberSerie(e);
    }

    const handleDescription = (e) => {
        setDescription(e);
    }

    const handleAmountTray = (e) => {
        setAmountTray(e);
    }

    const handleAmountProductTray = (e) => {
        setAmountProductTray(e);
    }

    const handleGarantia = (e) => {
        setGarantia(e);
    }

    const handleStatus = (e) => {
        setStatus(e);
    }


      const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(modelMachine, numberSerie, description, amountTray, amountProductTray, garantia, status);


    }

    // const handleUpdate = async (modelMachine, numberSerie, description, amountTray, amountProductTray, garantia, status) => {
    //     const docRef = doc(firestore, 'empresa', dataCompany.id);
    //     try {

    //         if (machine[0].id === machineId) {
    //             await updateDoc(docRef, {
    //                 machines: {
                        
    //                     modelMachine,
    //                     numberSerie,
    //                     description,
    //                     amountTray,
    //                     amountProductTray,
    //                     garantia,
    //                     status
    //                 }
    //             });

    //             setAmountProductTray('');
    //             setAmountTray('');
    //             setDescription('');
    //             setGarantia('');
    //             setModelMachine('');
    //             setNumberSerie('');
    //             setStatus('');
    //             setShowMessage(true);

    //             console.log('atualizado com sucesso')

    //             // setTimeout(() => {
    //             //     window.location.href = '/maquinas';
    //             // }, 3000)

                
    //         }

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


    // const insertData = async (machine, number, description, amountTray, amountProduct, garantia, status) => {
    //     try {
    //         const docRef = await addDoc(collection(firestore, 'empresa'), {
    //             machine: {
    //                 machine: machine,
    //                 number: number,
    //                 description: description,
    //                 amountTray: amountTray,
    //                 amountProduct: amountProduct,
    //                 garantia: garantia,
    //                 status: status
    //             },

    //         });
    //         console.log('salvo com sucesso', docRef.id);

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

   


    return (
        <>

            <Menu></Menu>
            <div className="wrapper-page">

                <Header></Header>
                <TitlePage title='Editar Máquina'></TitlePage>
                <Message text="Dados atualizados com sucesso!"></Message>
                <div className="form-create">
                    <form method="post" onSubmit={handleSubmit} >
                        <Input
                            label="Modelo da Máquina"
                            name="machine"
                            type="text"
                            change={handleModelMachine}
                            value={modelMachine}

                        ></Input>

                        <Input
                            label="N° de serie "
                            name="serie"
                            type="text"
                            change={handleNumberSerie}
                            value={numberSerie}
                        ></Input>
                        <Input
                            label="Descrição"
                            name="description"
                            type="text"
                            change={handleDescription}
                            value={description}
                        ></Input>
                        <Input
                            label="Quantidade de Bandejas"
                            name="amount_bandeja"
                            type="number"
                            change={handleAmountTray}
                            value={amountTray}
                        ></Input>

                        <Input
                            label="Quantidade de produtos por bandeja"
                            name="product_bandeja"
                            type="number"
                            change={handleAmountProductTray}
                            value={amountProductTray}
                        ></Input>
                        <Input
                            label="Garantia"
                            name="garantia"
                            type="text"
                            change={handleGarantia}
                            value={garantia}
                        ></Input>
                        <Input
                            label="Status do produto"
                            name="inscricao"
                            type="text"
                            value={status}
                            change={handleStatus}
                        ></Input>

                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Atualizar</button>
                    </form>
                </div>
            </div>
        </>

    )

}

export default UpdateMachine;