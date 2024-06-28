import React, { useContext } from "react";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import Menu from "../components/Menu";
import AppContext from "../context/AppContext";
import Loading from "../components/Loading";
import { firestore } from "../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ActionsTable from "../components/ActionsTable";
import ButtonCreate from "../components/ButtonCreate";



const Company = () => {

    const navigate = useNavigate();



    const { dataCompany, loading, userData, documents } = useContext(AppContext);

    const deleteDocument = async (docId) => {
        const docRef = doc(firestore, 'empresa', docId);
        try {
            await deleteDoc(docRef);
            console.log("deletado com sucesso");
        } catch (error) {
            console.error("erro ao deletar ", error);
        }
    };


    const handleDelete = async (doc) => {

        const confirmDelete = window.confirm('Você tem certeza que deseja excluir?');
        if (confirmDelete) {

            await deleteDocument(doc);
            window.location.reload();


        } else {
            console.log('exclusão cancelada');
        }
    };

    return (
        <React.Fragment>

            <Menu></Menu>
            <div className="wrapper-page">

                <Header></Header>
                <TitlePage title="Empresa"></TitlePage>



                {userData && userData.type_user == 'adm' &&

                    <div className="wrapper-buttons client">
                        <ButtonCreate text="Cadastrar" link="empresas/cadastro"></ButtonCreate>
                    </div>
                }


                {loading ?
                    <Loading></Loading>

                    :
                    <>
                        {documents.length > 0 ?

                            <div className="table-info">

                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">
                                                    Nome da Empresa
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Nome Fantasia
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    CNPJ
                                                </th>

                                                <th scope="col" className="px-6 py-3">
                                                    Estado
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {documents.map((company, companyIndex) =>
                                                <tr key={companyIndex} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">

                                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {company.data.nameCompany}
                                                    </th>
                                                    <td className="px-6 py-4">
                                                        {company.data.nameFantasy}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {company.data.cnpj}
                                                    </td>


                                                    <td className="px-6 py-4">
                                                        {company.data.state}
                                                    </td>
                                                    <td className="px-6 py-4 actions-table">
                                                        <ActionsTable delete={() => handleDelete(company.id)} update={`/empresa/editar/${company.id}`}></ActionsTable>


                                                    </td>



                                                </tr>
                                            )}

                                        </tbody>
                                    </table>
                                </div>

                            </div>

                            :
                            <h2 className="title-table">Nenhuma empresa cadastrada</h2>


                        }

                    </>
                }



            </div>
        </React.Fragment>


    );

}


export default Company;
