import React, { useContext, useEffect, useState } from "react";
import Menu from "../components/Menu";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import Message from "../components/Message";
import Input from "../components/Input";
import AppContext from "../context/AppContext";
import { firestore } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { v4 } from 'uuid'


const CreateProducts = () => {

    const { setShowMessageError, setShowMessage, userData } = useContext(AppContext);
    const { docCompany, trayId } = useParams();

    const [nameProduct, setNameProduct] = useState('');
    const [estoque, setEstoque] = useState('');
    const [valor, setValor] = useState('');
    const [validator, setValidator] = useState('');
    const [traySelect, setTraySelect] = useState('');
    const [listBandeja, setListBandeja] = useState([]);

    const uniqueId = v4()
    const idGenerator = uniqueId.slice(0, 8);

    useEffect(() => {
        const getBandejaOfMachine = async () => {
            const docRef = doc(firestore, 'empresa', docCompany);

            const docSnapshot = await getDoc(docRef)

            if (docSnapshot.exists()) {
                const companyData = docSnapshot.data();
                const machinesArr = companyData.machines || [];
                if (Array.isArray(machinesArr) && machinesArr.length > 0) {
                    machinesArr.map((machine) => {
                        if (machine.bandeja && machine.bandeja.length > 0) {
                            setListBandeja(machine.bandeja);
                        }


                    })
                }


            }



        }

        getBandejaOfMachine()

    }, [])


    const handleValidator = (e) => {
        setValidator(e);
    }


    const handleNameProduct = (e) => {
        setNameProduct(e);
    }


    const handleEstoque = (e) => {
        setEstoque(e)
    }

    const handleValor = (e) => {
        setValor(e);
    }

    const handleInsert = async (nameProduct, estoque, valor, validator) => {
        
            const docRef = doc(firestore, 'empresa', docCompany);

            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const companyData = docSnapshot.data();
                const machines = companyData.machines || [];

                try {

                    // Atualize o array machines para incluir o novo produto na bandeja correta
                    const updatedMachines = machines.map(machine => {
                        const updatedBandejas = machine.bandeja.map(tray => {
                            if (machine.companyDoc === docCompany) {
                                if (tray.idBandeja === traySelect) {
                                    const getFullDay = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
                                    // Adiciona um novo produto na bandeja existente
                                    const updatedProducts = tray.products ? [...tray.products, { idProduct: idGenerator, dataAbastecimento: getFullDay, nameProduct, estoque, valor, idBandeja: tray.idBandeja, validator, companyDoc: machine.companyDoc }] : [{ idProduct: idGenerator, dataAbastecimento: getFullDay, nameProduct, estoque, valor, idBandeja: tray.idBandeja, validator, companyDoc: machine.companyDoc }];
                                    return {
                                        ...tray,
                                        products: updatedProducts
                                    };
                                } else {
                                    return tray
                                }
                            } else {
                                return tray;
                            }
                        });

                        return {
                            ...machine,
                            bandeja: updatedBandejas
                        };
                    });

                    // Atualize o documento no Firestore com as alterações
                    await updateDoc(docRef, {
                        machines: updatedMachines
                    });

                    console.log('Produto adicionado com sucesso!');
                    // Limpe os campos
                    setNameProduct('');
                    setEstoque('');
                    setValor('');
                    setValidator('');
                    setShowMessage(true);


                    setTimeout(() => {
                        window.location.href = '/bandejas';
                    }, 2000);

                } catch (error) {
                    console.error('Erro ao adicionar produto:', error);
                }
            } else {
                console.log('empresa não encontrada')
            }

        


    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleInsert(nameProduct, estoque, valor, validator)
    }


    return (
        <>
            <Menu></Menu>

            <div className="wrapper-page">
                <Header></Header>
                <TitlePage title="Abastecimento de Máquina"></TitlePage>

                <Message text="Máquina abastecida com sucesso!"></Message>


                <div className="form-create">
                    <form onSubmit={handleSubmit} method="post">

                        <div className="form-group mb-5">
                            {listBandeja.length != 0 ?

                                <>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selecione uma bandeja</label>

                                    <select required onChange={(e) => setTraySelect(e.target.value)} value={traySelect} id="machines" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected> Selecione uma opção</option>



                                        <>
                                            {listBandeja.map((tray) =>
                                                <option value={tray.idBandeja}>{tray.bandeja}</option>

                                            )}
                                        </>


                                    </select>
                                </>


                                :
                                <p id="alert-border-2" className="flex gap-3 items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800" role="alert">
                                    <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                    </svg>
                                    Cadastre bandejas para esta máquina para abastecer!</p>
                            }


                            {/* <input type="text" value={nameMachine} placeholder="maquina" /> */}

                        </div>
                        <Input
                            label="Nome do Produto"
                            name="produto"
                            type="text"
                            value={nameProduct}
                            change={handleNameProduct}

                        ></Input>
                        <Input
                            label="Estoque"
                            name="estoque"
                            type="number"
                            value={estoque}
                            change={handleEstoque}

                        ></Input>

                        <Input
                            label="Valor"
                            name="valor"
                            type="text"
                            value={valor}
                            change={handleValor}


                        ></Input>

                        <Input
                            label="Validade"
                            name="validator"
                            type="text"
                            value={validator}
                            mask="99/99/9999"
                            change={handleValidator}


                        ></Input>

                        <div className="wrapper-button-form">

                            {listBandeja.length > 0 &&
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Abastecer</button>
                            }


                        </div>
                    </form>
                </div>
            </div>
        </>
    )

}

export default CreateProducts;