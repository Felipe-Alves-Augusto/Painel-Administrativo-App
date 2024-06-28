
import axios from "../axios";

export const register = async (name, email, password, phone, cep, address, type_user) => {

    //http://127.0.0.1:8000 url da api em produção
    //http://127.0.0.1:8000

    const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name: name,
        email: email,
        password: password,
        phone: phone,
        cep: cep,
        address: address,
        type_user: type_user

    });

    localStorage.setItem('token', response.data.token);
    return response.data;

}

export const registerFunc = async (name, email, password, phone, cep, address, type_user, company_doc, idFunc) => {

    const response = await axios.post('http://127.0.0.1:8000/api/registerFunc', {
        name: name,
        email: email,
        password: password,
        phone: phone,
        cep: cep,
        address: address,
        type_user: type_user,
        company_doc: company_doc,
        idFunc: idFunc

    });

    //localStorage.setItem('token', response.data.token);
    return response.data;

}


export const logout = async () => {
    const response = await axios.post('http://127.0.0.1:8000/api/logout');

    console.log(response)
    localStorage.removeItem('token');
    return response.data;
}

export const getToken = async () => {
    
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/token');    
        return response.data
    } catch (error) {
        console.log(error)
    }
    
}

export const login = async (email, password) => {
    const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password
    });



    localStorage.setItem('token', response.data.token);
    return response.data


}

export const getMe = async () => {

    let token = localStorage.getItem('token');



    if (token) {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/me');
            console.log('user logado', response);
        return response.data    
        } catch (error) {
            console.log(error)
        }
        

    } else {
        console.log('voce não está autenticado')
    }
}

export const deleteUser = async (idFunc) => {
    const response = await axios.delete(`http://127.0.0.1:8000/api/user/${idFunc}`);
    console.log('user deletado', response);
    return response.data;
}

export const updateUser =  async (name, email, password, phone, type_user, idFunc) => {

    const response = await axios.put(`http://127.0.0.1:8000/api/updateUser/${idFunc}`, {
        name: name,
        email: email,
        password: password,
        phone: phone,
        type_user: type_user


    });
    return response.data;

}
