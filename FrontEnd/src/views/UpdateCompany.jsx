import React, { useContext, useState, useEffect } from "react";
import Input from "../components/Input";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import Menu from "../components/Menu";
import AppContext from "../context/AppContext";
import Message from "../components/Message";
import { useParams } from "react-router-dom";


const UpdateCompany = () => {

    const { dataCompany, setShowMessage } = useContext(AppContext)


    const [nameCompany, setNameCompany] = useState('');
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [nameFantasy, setNameFantasy] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [inscrition, setInscrition] = useState('');
    const [agency, setAgency] = useState('');
    const [account, setAccount] = useState('');
    const [bank, setBank] = useState('');
    const [responsavel, setResponsavel] = useState('');
    const [pix, setPix] = useState('');
    const [contactResponsavel, setContactResponsavel] = useState('');

    const { docCompany } = useParams();

    const handleContactResponsavel = (e) => {
        setContactResponsavel(e);
    }



    const handlePix = (e) => {
        setPix(e);
    }

    const handleResponsavel = (e) => {
        setResponsavel(e);
    }


    const handleNameCompany = (e) => {
        setNameCompany(e);
    }

    const handleCep = (e) => {
        setCep(e);
    }

    const handleAdress = (e) => {
        setAddress(e);
    }

    const handleState = (e) => {
        setState(e);
    }

    const handleNameFantasy = (e) => {
        setNameFantasy(e);
    }

    const handleCnpj = (e) => {
        setCnpj(e);
    }

    const handleIscrition = (e) => {
        setInscrition(e);
    }

    const handleAgency = (e) => {
        setAgency(e);
    }

    const handleAccount = (e) => {
        setAccount(e);
    }

    const handleBank = (e) => {
        setBank(e);
    }

    useEffect(() => {
        const fetchEmpresa = async () => {
            try {
                const docRef = doc(firestore, 'empresa', docCompany);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    let comapany = docSnap.data()
                    console.log(docSnap.data());
                    setAccount(comapany.account);
                    setAddress(comapany.address)
                    setAgency(comapany.agency);
                    setBank(comapany.bank)
                    setCep(comapany.cep)
                    setCnpj(comapany.cnpj);
                    setInscrition(comapany.inscrition);
                    setNameCompany(comapany.nameCompany);
                    setNameFantasy(comapany.nameFantasy);
                    setPix(comapany.pix);
                    setResponsavel(comapany.responsavel)
                    setState(comapany.state)

                } else {

                    console.log("Empresa não encontrada");
                }
            } catch (error) {
                console.error("Erro ao buscar empresa: ", error);
            }
        };

        fetchEmpresa();
    }, [docCompany]);

    const handleUpdate = async (nameCompany, cep, address, state, nameFantasy, cnpj, inscrition, agency, account, bank, responsavel, pix, contactResponsavel) => {
        const docRef = doc(firestore, 'empresa', docCompany);
        try {
            await updateDoc(docRef, {
                nameCompany,
                cep,
                address,
                state,
                nameFantasy,
                cnpj,
                inscrition,
                agency,
                account,
                bank,
                responsavel,
                pix,
                contactResponsavel

            });
            console.log('atualizado com sucesso');

            setNameCompany('');
            setAccount('')
            setAddress('')
            setAgency('');
            setBank('');
            setCep('');
            setCnpj('');
            setInscrition('');
            setNameFantasy('');
            setShowMessage(true);


            setTimeout(() => {
                window.location.href = '/empresas';
            }, 3000)

        } catch (error) {
            console.log(error);
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(nameCompany, cep, address, state, nameFantasy, cnpj, inscrition, agency, account, bank, responsavel, pix, contactResponsavel);


    }



    return (
        <>

            <Menu></Menu>
            <div className="wrapper-page">

                <Header></Header>
                <TitlePage title="Cadastro Empresa"></TitlePage>
                <Message text="Dados atualizados com sucesso!"></Message>
                <div className="form-create">
                    <form onSubmit={handleSubmit} method="post">
                        <Input
                            label="Nome da Empresa"
                            name="empresa"
                            type="text"
                            change={handleNameCompany}
                            value={nameCompany}
                        ></Input>

                        <Input
                            label="CEP"
                            name="cep"
                            type="text"
                            change={handleCep}
                            value={cep}
                        ></Input>

                        <Input
                            label="Endereço"
                            name="address"
                            type="text"
                            change={handleAdress}
                            value={address}

                        ></Input>

                        <Input
                            label="Estado"
                            name="state"
                            type="text"
                            change={handleState}
                            value={state}
                        ></Input>

                        <Input
                            label="Nome fantasia"
                            name="name_fantasy"
                            type="text"
                            change={handleNameFantasy}
                            value={nameFantasy}

                        ></Input>
                        <Input
                            label="CNPJ"
                            name="cnpj"
                            type="text"
                            change={handleCnpj}
                            value={cnpj}
                        ></Input>

                        <Input
                            label="Inscrição"
                            name="inscricao"
                            type="text"
                            change={handleIscrition}
                            value={inscrition}
                        ></Input>

                        <Input
                            label="Agência"
                            name="inscricao"
                            type="text"
                            change={handleAgency}
                            value={agency}
                        ></Input>

                        <Input
                            label="Conta"
                            name="inscricao"
                            type="text"
                            change={handleAccount}
                            value={account}
                        ></Input>

                        <Input
                            label="Banco"
                            name="inscricao"
                            type="text"
                            change={handleBank}
                            value={bank}
                        ></Input>

                        <Input
                            label="Responsável"
                            name="responsavel"
                            type="text"
                            change={handleResponsavel}
                            value={responsavel}

                        ></Input>

                        <Input
                            label="Pix"
                            name="pix"
                            type="text"
                            change={handlePix}
                            value={pix}

                        ></Input>


                        <Input
                            label="Contato do Responsável"
                            name="contact"
                            type="text"
                            change={handleContactResponsavel}
                            value={contactResponsavel}
                            mask="(99) 9999-99999"

                        ></Input>

                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Atualizar</button>
                    </form>
                </div>
            </div>
        </>

    )

}

export default UpdateCompany;