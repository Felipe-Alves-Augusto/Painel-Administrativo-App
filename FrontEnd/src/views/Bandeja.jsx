import React, { useContext, useState, useEffect } from "react";
import Menu from "../components/Menu";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import AppContext from "../context/AppContext";
import { FaTrashAlt } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import { firestore } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { FaProductHunt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import ButtonCreate from "../components/ButtonCreate";
import ButtonCsv from "../components/ButtonCsv";
import { FaTruckLoading } from "react-icons/fa";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { MdDateRange } from "react-icons/md";
import Loading from "../components/Loading";



const Bandeja = () => {

    const { dataCompany, userData, loading, documents } = useContext(AppContext);

    const [modal, setModal] = useState(false);
    const [trayId, setTrayId] = useState(null);
    const [companySeleted, setCompanySeleted] = useState('');
    const [hasTrays, setHasTrays] = useState(false);
    const [hasEmployees, setHasEmployees] = useState(false);

    // Verifique se há alguma bandeja disponível
    useEffect(() => {
        const anyTrays = documents.some(doc => doc.data.machines.some(machine => machine.bandeja && machine.bandeja.length > 0));
        setHasTrays(anyTrays);
    }, [documents]);



    // Verifica se existe pelo menos uma maquina em qualquer empresa
    useEffect(() => {
        const anyEmployees = documents.some(doc => doc.data.machines && doc.data.machines.length > 0);
        setHasEmployees(anyEmployees);
    }, [documents]);


    const handleRemoveProductAdm = async (docId, trayId, productIndex) => {
        const docRef = doc(firestore, 'empresa', docId);
        const docSnapshot = await getDoc(docRef);

        try {
            if (docSnapshot.exists()) {
                const companyData = docSnapshot.data();
                const machines = companyData.machines || [];

                let updatedMachines = machines.map(machine => {
                    if (machine.bandeja) {
                        let updatedBandejas = machine.bandeja.map(tray => {
                            if (tray.idBandeja === trayId) {
                                const confirmDelete = window.confirm('Você tem certeza que deseja excluir?');
                                if (confirmDelete) {
                                    // Remove o produto pelo índice
                                    let updatedProducts = tray.products.filter((_, index) => index !== productIndex);
                                    return { ...tray, products: updatedProducts };


                                }

                            }
                            return tray;
                        });
                        return { ...machine, bandeja: updatedBandejas };
                    }
                    return machine;
                });

                await updateDoc(docRef, {
                    machines: updatedMachines
                });
                console.log('Produto removido com sucesso!');
                window.location.reload();
            } else {
                console.log('Documento não encontrado');
            }
        } catch (error) {
            console.error('Erro ao remover o produto:', error);
        }
    };

    //função de remover bandejas
    const removeElementIndexAdm = (docId, machineIndex, bandejaIndex) => {
        if (userData && userData.type_user == 'adm') {
            const docRef = doc(firestore, 'empresa', docId);

            try {
                if (dataCompany && dataCompany.data && dataCompany.data.machines) {
                    const machinesArr = dataCompany.data.machines

                    if (Array.isArray(machinesArr) && machinesArr[machineIndex]) {
                        const bandejaArr = machinesArr[machineIndex].bandeja;

                        if (Array.isArray(bandejaArr) && bandejaIndex >= 0 && bandejaIndex < bandejaArr.length) {
                            bandejaArr.splice(bandejaIndex, 1); // Remove o elemento no índice especificado

                            // Atualize o array machines com a bandeja modificada
                            machinesArr[machineIndex].bandeja = bandejaArr;

                            // Atualize o documento no Firestore
                            updateDoc(docRef, {
                                machines: machinesArr
                            });

                            console.log('Bandeja removida com sucesso');

                            setTimeout(() => {
                                window.location.reload();
                            }, 1000)
                        } else {
                            console.error("Índice inválido ou o campo não é um array.");
                        }
                    } else {
                        console.error("Índice de máquina inválido ou o campo não é um array.");
                    }
                }
            } catch (error) {
                console.error(error);
            }

        }
    }



    const handleRemoveAdm = (docId, machineIndex, bandejaIndex) => {
        const machineIndexInt = parseInt(machineIndex, 10);
        const bandejaIndexInt = parseInt(bandejaIndex, 10);

        if (docId && !isNaN(machineIndexInt) && !isNaN(bandejaIndexInt)) {
            const confirmDelete = window.confirm('Você tem certeza que deseja excluir?');
            if (confirmDelete) {
                removeElementIndexAdm(docId, machineIndexInt, bandejaIndexInt);
            }
        } else {
            console.log('Índices são necessários!');
        }
    };

    //função de remover bandejas de funcionario
    // const removeElementIndex = (docId, machineIndex, bandejaIndex) => {
    //     if (userData && userData.type_user != 'adm') {
    //         const docRef = doc(firestore, 'empresa', docId);

    //         try {
    //             if (dataCompany && dataCompany.data && dataCompany.data.machines) {
    //                 const machinesArr = dataCompany.data.machines

    //                 if (Array.isArray(machinesArr) && machinesArr[machineIndex]) {
    //                     const bandejaArr = machinesArr[machineIndex].bandeja;

    //                     if (Array.isArray(bandejaArr) && bandejaIndex >= 0 && bandejaIndex < bandejaArr.length) {
    //                         bandejaArr.splice(bandejaIndex, 1); // Remove o elemento no índice especificado

    //                         // Atualize o array machines com a bandeja modificada
    //                         machinesArr[machineIndex].bandeja = bandejaArr;

    //                         // Atualize o documento no Firestore
    //                         updateDoc(docRef, {
    //                             machines: machinesArr
    //                         });

    //                         console.log('Bandeja removida com sucesso');

    //                         setTimeout(() => {
    //                             window.location.reload();
    //                         }, 1000)
    //                     } else {
    //                         console.error("Índice inválido ou o campo não é um array.");
    //                     }
    //                 } else {
    //                     console.error("Índice de máquina inválido ou o campo não é um array.");
    //                 }
    //             }
    //         } catch (error) {
    //             console.error(error);
    //         }

    //     }
    // }

    // const handleRemove = (machineIndex, bandejaIndex) => {
    //     const machineIndexInt = parseInt(machineIndex, 10);
    //     const bandejaIndexInt = parseInt(bandejaIndex, 10);

    //     if (dataCompany.id && !isNaN(machineIndexInt) && !isNaN(bandejaIndexInt)) {
    //         const confirmDelete = window.confirm('Você tem certeza que deseja excluir?');
    //         if (confirmDelete) {
    //             removeElementIndex(dataCompany.id, machineIndexInt, bandejaIndexInt);
    //         }
    //     } else {
    //         console.log('Índices são necessários!');
    //     }
    // };


    const handleViewProduct = (trayId) => {
        setModal(true);
        setTrayId(trayId);
    }



    const handleCloseModal = () => {
        setModal(false);
    }


    const renderProducts = (trayId) => {
        const docs = documents || [];
        let products = [];

        for (let doc of docs) {
            for (let machine of doc.data.machines) {
                if (machine.bandeja) {
                    for (let tray of machine.bandeja) {
                        if (tray.idBandeja === trayId && tray.products) {
                            products = products.concat(tray.products);

                        }
                    }
                }


            }

        }



        if (products.length > 0) {
            return products.map((product, productIndex) => (
                // <CardProducts
                //     key={index}
                //     name={product.nameProduct}
                //     estoque={product.estoque}
                //     valor={product.valor}
                //     validade={product.validator}
                // />
                <div key={productIndex} className="products text-gray-900 bg-white dark:bg-gray-700 dark:text-white">
                    <p type="button" className="line-card relative inline-flex items-center w-full px-4 py-2 text-sm border-b border-gray-200 rounded-t-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                        <FaProductHunt></FaProductHunt>
                        <b>Nome do Produto:</b>  {product.nameProduct}
                    </p>

                    <p type="button" className="line-card relative inline-flex items-center w-full px-4 py-2 text-sm  border-b border-gray-200 rounded-t-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                        <FaTruckLoading></FaTruckLoading>
                        <b>Estoque:</b> {product.estoque}
                    </p>

                    <p type="button" className="line-card relative inline-flex items-center w-full px-4 py-2 text-sm border-b border-gray-200 rounded-t-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                        <RiMoneyDollarCircleFill></RiMoneyDollarCircleFill>
                        <b>Valor:</b> {product.valor}
                    </p>

                    <p type="button" className="line-card relative inline-flex items-center w-full px-4 py-2 text-sm border-b border-gray-200 rounded-t-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                        <MdDateRange></MdDateRange>
                        <b>Validade:</b> {product.validator}
                    </p>

                    <p type="button" className="line-card relative inline-flex items-center w-full px-4 py-2 text-sm border-b border-gray-200 rounded-t-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                        <MdDateRange></MdDateRange>
                        <b>Data de Abastecimento:</b> {product.dataAbastecimento}
                    </p>



                    <div className="card-footer">
                        <button onClick={() => handleRemoveProductAdm(product.companyDoc, trayId, productIndex)} type="button" class="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Remover</button>
                        <a href={`/produto/editar/${product.companyDoc}/${trayId}/${product.idProduct}`} type="button" class="px-3 py-2 ms-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Editar</a>
                    </div>
                </div>
            ));
        } else {
            return <p>Nenhum produto encontrado para essa bandeja.</p>;
        }
    };

    const headers = [
        { label: "Nome da Bandeja", key: "bandeja" },
        { label: "id Bandeja", key: "idBandeja" },
        { label: "Nome da Máquina", key: "nameMachine" },

    ]

    let reportBandejas = [];
    const machinesReport = dataCompany.data ? dataCompany.data.machines : [];


    machinesReport.forEach((machine) => {
        // console.log(machine.bandeja, index)

        if (machine.bandeja) {

            reportBandejas = [...reportBandejas, ...machine.bandeja]
        }
    })

    const renderModal = () => {
        if (modal) {
            return (
                <div className="modal-view-products">
                    <div className="wrapper-modal">
                        <div className="title-modal">
                            <p>Produtos na Bandeja</p>
                            <button onClick={handleCloseModal} type="button"><IoMdClose></IoMdClose></button>
                        </div>
                        <div className="modal-flex">


                            {renderProducts(trayId)}




                        </div>

                    </div>

                </div>
            )

        }

    }


    return (
        <>
            <Menu />
            <div className="wrapper-page">

                <Header />
                {userData.type_user == 'adm' &&
                    <TitlePage title="Minhas Bandejas" />
                }

                {userData.type_user != 'adm' &&
                    <TitlePage title="Bandejas da empresa" />
                }


                {loading ?
                    <Loading></Loading>

                    :
                    <>

                        {userData && userData.type_user == 'adm' &&
                            <>

                                {hasEmployees ? (
                                    <>
                                        {userData.type_user == 'adm' &&
                                            <div className="wrapper-buttons">
                                                <ButtonCreate text="Cadastrar" link="/bandejas/cadastro"></ButtonCreate>
                                                <ButtonCsv filename="bandejas" report={reportBandejas} headers={headers}></ButtonCsv>
                                            </div>
                                        }



                                        <div className="table-info">
                                            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3">Empresa</th>
                                                            <th scope="col" className="px-6 py-3">Nome da Máquina</th>
                                                            <th scope="col" className="px-6 py-3">Nome da Bandeja</th>
                                                            
                                                            <th scope="col" className="px-6 py-3">Produtos na Bandeja</th>
                                                            <th scope="col" className="px-6 py-3">Ações</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {hasTrays ? (
                                                            documents.map((doc, docIndex) => (
                                                                doc.data.machines.map((machine, machineIndex) => (
                                                                    machine.bandeja && machine.bandeja.length > 0
                                                                    && machine.bandeja.map((tray, trayIndex) => (
                                                                        <tr key={`${docIndex}-${machineIndex}-${trayIndex}`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                                {doc.data.nameCompany}
                                                                            </td>
                                                                            <td className="px-6 py-4">{tray.nameMachine}</td>
                                                                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                                {tray.bandeja}
                                                                            </td>
                                                                            
                                                                            <td className="px-6 py-4">{tray.products.length}</td>
                                                                            <td className="px-6 py-4">

                                                                                <Tooltip arrow={true} placement="top" title="Deletar" animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 } }}>
                                                                                    <button onClick={() => handleRemoveAdm(doc.id, machineIndex, trayIndex)} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                                                                        <FaTrashAlt />
                                                                                        <span className="sr-only">Icon description</span>
                                                                                    </button>
                                                                                </Tooltip>


                                                                                <Tooltip arrow={true} placement="top" title="Ver Produtos" animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 } }}>
                                                                                    <button onClick={() => handleViewProduct(tray.idBandeja)} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-amber-400 hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800">
                                                                                        <FaProductHunt />
                                                                                        <span className="sr-only">Icon description</span>
                                                                                    </button>
                                                                                </Tooltip>
                                                                                {renderModal()}
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ))
                                                            ))
                                                        ) : (
                                                            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                                    Nenhuma bandeja disponível
                                                                </td>
                                                            </tr>
                                                        )}

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                    </>
                                ) : (
                                    <h2 className="title-table">Nenhuma máquina cadastrada</h2>
                                )}
                            </>
                        }


                        {userData && userData.type_user != 'adm' &&

                            <>
                                {dataCompany.data &&
                                    <>
                                        {dataCompany.data.machines.length !== 0 ? (
                                            <>

                                                {dataCompany.data.machines.some(machine => machine.bandeja && machine.bandeja.length > 0) ? (
                                                    <div className="table-info">
                                                        <div className="overflow-x-auto shadow-md sm:rounded-lg">
                                                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                                    <tr>
                                                                        <th scope="col" className="px-6 py-3">Empresa</th>
                                                                        <th scope="col" className="px-6 py-3">Nome da Máquina</th>
                                                                        <th scope="col" className="px-6 py-3">Nome da Bandeja</th>
                                                                        
                                                                        <th scope="col" className="px-6 py-3">Produtos na Bandeja</th>
                                                                        <th scope="col" className="px-6 py-3">Ações</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {dataCompany.data.machines.map((machine, machineIndex) => (
                                                                        machine.bandeja && machine.bandeja.length > 0 && machine.bandeja.map((tray, trayIndex) => (
                                                                            <tr key={`${machineIndex}-${trayIndex}`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                                                <td className="px-6 py-4">{dataCompany.nameCompany}</td>
                                                                                <td className="px-6 py-4">{tray.nameMachine}</td>
                                                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                                    {tray.bandeja}
                                                                                </th>
                                                                                
                                                                                <td className="px-6 py-4">{tray.products.length}</td>
                                                                                <td className="px-6 py-4">
                                                                                    {/* {userData.type_user != 'consierge' &&
                                                                                        <Tooltip arrow={true} placement="top" title="Deletar" animate={{
                                                                                            mount: { scale: 1, y: 0 },
                                                                                            unmount: { scale: 0, y: 25 },
                                                                                        }}>
                                                                                            <button onClick={() => handleRemove(machineIndex, trayIndex)} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                                                                                <FaTrashAlt></FaTrashAlt>
                                                                                                <span className="sr-only">Icon description</span>
                                                                                            </button>
                                                                                        </Tooltip>
                                                                                    } */}




                                                                                    <Tooltip arrow={true} placement="top" title="Ver Produtos" animate={{
                                                                                        mount: { scale: 1, y: 0 },
                                                                                        unmount: { scale: 0, y: 25 },
                                                                                    }}>
                                                                                        <button onClick={() => handleViewProduct(tray.idBandeja)} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-amber-400 hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800">
                                                                                            <FaProductHunt></FaProductHunt>
                                                                                            <span className="sr-only">Icon description</span>
                                                                                        </button>
                                                                                    </Tooltip>
                                                                                    {renderModal()}
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <h2 className="title-table">Nenhuma bandeja cadastrada</h2>
                                                )}
                                            </>
                                        ) : (
                                            <h2 className="title-table">Nenhuma máquina cadastrada</h2>
                                        )}
                                    </>
                                }

                            </>
                        }


                    </>
                }


            </div >
        </>
    );

}

export default Bandeja;