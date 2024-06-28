import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../context/AppContext'
import { FaTrashAlt } from "react-icons/fa";
import Menu from "../components/Menu";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import { Tooltip } from "@mui/material";
import ButtonCreate from '../components/ButtonCreate';
import Loading from '../components/Loading';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { deleteUser } from '../services/auth';
import { FaKey } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";

const Funcionarios = () => {

    const { dataCompany, loading, documents } = useContext(AppContext);

    const [hasEmployees, setHasEmployees] = useState(false);

    // Verifica se existe pelo menos um funcionário em qualquer empresa
    useEffect(() => {
        const anyEmployees = documents.some(doc => doc.data.funcionarios && doc.data.funcionarios.length > 0);
        setHasEmployees(anyEmployees);
    }, [documents]);


    const removeElementIndex = async (docId, index) => {
        const docRef = doc(firestore, 'empresa', docId);
        const docSnapshot = await getDoc(docRef);

        try {
            if (docSnapshot.exists()) {
                const companyData = docSnapshot.data();
                const funcArray = companyData.funcionarios || [];
                if (Array.isArray(funcArray) && index >= 0 && funcArray) {
                    funcArray.splice(index, 1); // Remove o elemento no índice especificado

                    await updateDoc(docRef, {
                        funcionarios: funcArray
                    })

                    console.log('funcionário deletado com sucesso');
                    // window.location.reload();

                } else {
                    console.error("Índice inválido ou o campo não é um array.");
                }
            }
        } catch (error) {
            console.error(error);
        }
    }


    const handleRemove = async (docId, index, idFunc) => {

        const indexInt = parseInt(index, 10);
        if (docId && !isNaN(indexInt)) {


            const confirmDelete = window.confirm('Você tem certeza que deseja excluir?');
            if (confirmDelete) {
                await deleteUser(idFunc);
                await removeElementIndex(docId, indexInt);
                window.location.reload();
            }

        } else {
            console.log('indice é necessário!');
        }


    }


    return (
        <>
            <Menu></Menu>
            <div className="wrapper-page">
                <Header></Header>
                <TitlePage title="Meus Funcionários"></TitlePage>



                {loading ?
                    <Loading></Loading>

                    :
                    <>

                        {documents ?

                            <>
                                <div className="wrapper-buttons">
                                    <ButtonCreate text="Cadastrar" link="funcionario/cadastro"></ButtonCreate>
                                </div>

                                {documents.length ?
                                    <>
                                        <div className="table-info">


                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3">
                                                                Nome
                                                            </th>
                                                            <th scope="col" className="px-6 py-3">
                                                                E-mail
                                                            </th>

                                                            <th scope="col" className="px-6 py-3">
                                                                Perfil
                                                            </th>
                                                            <th scope="col" className="px-6 py-3">
                                                                Senha
                                                            </th>

                                                            <th scope="col" className="px-6 py-3">
                                                                Ações
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {hasEmployees ? (
                                                            documents.map((doc, docIndex) => (
                                                                <React.Fragment key={doc.id}>
                                                                    {doc.data.funcionarios && doc.data.funcionarios.length > 0 ? (
                                                                        doc.data.funcionarios.map((func, funcIndex) => (
                                                                            <tr key={funcIndex} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                                                <td className="px-6 py-4">{func.name}</td>
                                                                                <td className="px-6 py-4">{func.email}</td>
                                                                                <td className="px-6 py-4">{func.typeUser}</td>
                                                                                <td className="px-6 py-4">{func.password}</td>
                                                                                <td className="px-6 py-4">

                                                                                    <Tooltip arrow={true} placement="top" title="Editar" animate={{
                                                                                        mount: { scale: 1, y: 0 },
                                                                                        unmount: { scale: 0, y: 25 },
                                                                                    }}>
                                                                                        <a href={`/funcionario/editar/${func.idFunc}/${doc.id}`} style={{ width: '29px', height: '29px' }} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                                                            <BsPencilSquare></BsPencilSquare>
                                                                                            <span className="sr-only">Icon description</span>
                                                                                        </a>
                                                                                    </Tooltip>
                                                                                    <Tooltip arrow={true} placement="top" title="Deletar" animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 } }}>
                                                                                        <button onClick={() => handleRemove(doc.id, funcIndex, func.idFunc)} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                                                                            <FaTrashAlt />
                                                                                            <span className="sr-only">Icon description</span>
                                                                                        </button>
                                                                                    </Tooltip>

                                                                                    <Tooltip arrow={true} placement="top" title="Permissões" animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 } }}>
                                                                                        <a href={`/permissao/${func.idFunc}/${doc.id}`} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">
                                                                                            <FaKey />
                                                                                            <span className="sr-only">Icon description</span>
                                                                                        </a>
                                                                                    </Tooltip>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    ) : null}
                                                                </React.Fragment>
                                                            ))
                                                        ) : (
                                                            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                                    Nenhum funcionário cadastrado
                                                                </td>
                                                            </tr>
                                                        )}


                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </>

                                    :
                                    <h2 className="title-table">Nenhum funcionário atrelhado a conta</h2>
                                }

                            </>

                            :
                            <h2 className="title-table">Cadastre uma empresa para criar usuários</h2>
                        }
                    </>
                }


            </div>

        </>
    )

}

export default Funcionarios;