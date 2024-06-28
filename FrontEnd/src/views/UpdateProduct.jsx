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


const UpdateProduct = () => {

    const { setShowMessage } = useContext(AppContext);
    const { docCompany, idTray, idProduct } = useParams();

    const [nameProduct, setNameProduct] = useState('');
    const [estoque, setEstoque] = useState('');
    const [valor, setValor] = useState('');
    const [validator, setValidator] = useState('');

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

    useEffect(() => {
        // Função para carregar os dados do produto específico
        const loadProductData = async () => {
            try {
                // Refere-se ao documento da empresa com base no ID da empresa
                const docRef = doc(firestore, 'empresa', docCompany);

                // Obtém o documento da empresa
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    // Obtém os dados da empresa
                    const companyData = docSnapshot.data();

                    // Verifica se as máquinas estão presentes
                    if (!companyData.machines || companyData.machines.length === 0) {
                        console.error('Nenhuma máquina encontrada na empresa.');
                        return;
                    }

                    // Percorre as máquinas para encontrar a bandeja e o produto
                    companyData.machines.forEach(machine => {
                        machine.bandeja.forEach(tray => {
                            if (tray.idBandeja === idTray) {
                                tray.products.forEach(product => {
                                    if (product.idProduct === idProduct) {


                                        setNameProduct(product.nameProduct);
                                        setEstoque(product.estoque);
                                        setValor(product.valor);
                                        setValidator(product.validator)
                                    }
                                });
                            }
                        });
                    });
                } else {
                    console.error('Documento da empresa não encontrado');
                }
            } catch (error) {
                console.error('Erro ao carregar dados do produto:', error);
            }
        };

        // Chama a função para carregar os dados do produto
        loadProductData();
    }, [docCompany, idTray, idProduct]);




    const handleFormSubmit = async (e) => {
        e.preventDefault();
        

        try {
            const docRef = doc(firestore, 'empresa', docCompany);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const companyData = docSnapshot.data();
                const machines = companyData.machines || [];

                const updatedMachines = machines.map(machine => {
                    const updatedBandejas = machine.bandeja.map(tray => {
                        if (tray.idBandeja === idTray) {
                            const updatedProducts = tray.products.map(product => {
                                if (product.idProduct === idProduct) {
                                    return {
                                        ...product,
                                        nameProduct: nameProduct,
                                        estoque: estoque,
                                        valor: valor,
                                        validator: validator
                                    };
                                }
                                return product;
                            });
                            return { ...tray, products: updatedProducts };
                        }
                        return tray;
                    });

                    return { ...machine, bandeja: updatedBandejas };
                });

                await updateDoc(docRef, { machines: updatedMachines });
                console.log('Produto atualizado com sucesso!');
                setShowMessage(true);
                setTimeout(() => {
                    window.location.href = '/bandejas'
                }, 1000)
               
            } else {
                setError('Documento da empresa não encontrado');
            }
        } catch (error) {
            setError('Erro ao atualizar produto: ' + error.message);
        }
    };

  


    return (
        <>
            <Menu></Menu>

            <div className="wrapper-page">
                <Header></Header>
                <TitlePage title="Editar Produto"></TitlePage>

                <Message text="Produto editado com sucesso!"></Message>


                <div className="form-create">
                    <form onSubmit={handleFormSubmit} method="post">


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


                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Editar</button>



                        </div>
                    </form>
                </div>
            </div>
        </>
    )

}

export default UpdateProduct;