import React, { useContext, useState, useEffect } from "react";
import Menu from "../components/Menu";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import Message from "../components/Message";
import Input from "../components/Input";
import AppContext from "../context/AppContext";
import { firestore } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";

const UpdateLocation = () => {

    const { dataCompany, setShowMessage, loading, documents } = useContext(AppContext);

    const { locationId, docCompany } = useParams();


    const [location, setLocation] = useState('');
    const [clientName, setClientName] = useState('');
    const [typeSale, setTypeSale] = useState('');

    const handleTypeSale = (e) => {
        setTypeSale(e.target.value);
    }


    const handleLocation = (e) => {
        setLocation(e.target.value);
    }

    const handleClient = (e) => {
        let select = document.getElementById('company');


        let optionSelected = e.target.children[select.selectedIndex].textContent
        console.log('nome', optionSelected);
        setClientName(optionSelected);
       
    }




    useEffect(() => {
        // Encontra a localização específica baseada no ID

        if (documents.length) {
            documents.map((doc, docIndex) => {
                doc.data.machines.forEach(machine => {
                    const foundLocation = machine.location.filter(loc => loc.idLocation === locationId);


                    console.log('location', foundLocation);
                    if (foundLocation.length === 1) {
                        setClientName(foundLocation[0].clientName);
                        setLocation(foundLocation[0].location);

                        setTypeSale(foundLocation[0].typeSale);
                    }


                });
            })

        }

    }, [documents, locationId, docCompany]);




    const handleUpdate = async (clientName, location, typeSale) => {
        try {
            // Referência ao documento no Firestore
            const docRef = doc(firestore, 'empresa', docCompany);

            // Obtém o documento atual
            const docSnapshot = await getDoc(docRef);
            if (!docSnapshot.exists()) {
                throw new Error("Documento não encontrado");
            }

            // Obtém os dados atuais da empresa
            const companyData = docSnapshot.data();
            const machines = companyData.machines || [];

            // Atualiza as informações da localização específica
            const updatedMachines = machines.map(machine => {
                if (machine.location) {
                    return {
                        ...machine,
                        location: machine.location.map(loc => {
                            if (loc.idLocation === locationId) {
                                return {
                                    ...loc,
                                    clientName,
                                    location,
                                    typeSale
                                };
                            }
                            return loc;
                        })
                    };
                }
                return machine;
            });

            // Atualiza o documento no Firestore
            await updateDoc(docRef, { machines: updatedMachines });
            setShowMessage(true);

            console.log('Localização atualizada com sucesso!');
            setTimeout(() => {
                window.location.href = '/locacao';
            }, 2000)
        } catch (error) {
            console.error('Erro ao atualizar a localização:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(clientName, location, typeSale);
    };

    return (
        <>
            <Menu></Menu>

            {loading ?
                <Loading></Loading>


                :
                <div className="wrapper-page">
                    <Header></Header>
                    <TitlePage title="Editar Locação ou Venda"></TitlePage>
                    <Message text="Locação editada com sucesso"></Message>


                    <div className="form-create">
                        <form onSubmit={handleSubmit} method="post">
                            <div className="form-group form-select mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome do Cliente</label>
                                <select id="company" required onChange={handleClient} value={clientName} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected> Selecione uma opção</option>
                                    {documents && documents.length ?
                                        <>
                                            {documents.map((company) =>

                                                <option value={company.id}>{company.data.nameCompany}</option>
                                            )}
                                        </>
                                        :
                                        <option value=''>Nehum empresa cadastrada</option>
                                    }

                                </select>



                            </div>
                            <div className="form-group form-select mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de Venda</label>
                                <select required onChange={handleTypeSale} value={typeSale} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected> Selecione uma opção</option>
                                    <option value='venda'>Venda</option>
                                    <option value='locacao'>Locação</option>
                                </select>



                            </div>
                            <div className="form-group mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Endereço de Locação</label>
                                <textarea rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={location} onChange={handleLocation} name="location">

                                </textarea>
                            </div>


                            {/* <Input
                        label="Endereço de locação"
                        name="location"
                        type="text"
                        value={location}
                        change={handleLocation}


                    ></Input> */}




                            <div className="wrapper-button-form">
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Cadastrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            }

        </>
    )
}

export default UpdateLocation