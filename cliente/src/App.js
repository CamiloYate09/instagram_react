import React, {useEffect, useState} from 'react';
import Nav from './Componentes/Nav'
import Loading from "./Componentes/Loading";
import Signup from "./Vistas/Signup";
import Login from "./Vistas/Login";
import Upload from "./Vistas/Upload";
import Feed from "./Vistas/Feed";
import Error from "./Componentes/Error";
import Post from "./Vistas/Post";
import Axios from "axios";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {deleteToken, getToken, initAxiosInterceptors, setToken} from "./Helpers/auth-helpers";
import Main from "./Componentes/Main";
import Explore from "./Vistas/Explore";
import Perfil from "./Vistas/Perfil";


//Apenas cargue el navegador llamamos esta funcion
initAxiosInterceptors();

export default function App() {

    //No sabemos si hay un usuario autenticado
    const [usuario, setUsuario] = useState(null);

    //saber esl estado del usuario
    const [cargandoUsuario, setCargandoUsuario] = useState(true);

    //contener los errores
    const [error, setError] = useState(null);


    useEffect(() => {

        async function cargarUsuario() {
            //validamos si existe un token
            if (!getToken()) {
                setCargandoUsuario(false);
                return;
            }
            try {
                const {data: usuario} = await Axios.get('/api/usuarios/whoami');
                setUsuario(usuario);
                setCargandoUsuario(false);
            } catch (error) {
                console.log(error);
            }

        }


        cargarUsuario();

    }, []);

    /**
     *  data.usuario
     *  data.token
     * @param email
     * @param password
     * @returns {Promise<void>}
     */
    async function login(email, password) {
        const {data} = await Axios.post('/api/usuarios/login', {
            email,
            password
        });
        setUsuario(data.usuario);
        setToken(data.token);

    }

    /**
     * Funcion para registrarse en el sistema
     * @param usuario
     * @returns {Promise<void>}
     */
    async function signup(usuario) {
        const {data} = await Axios.post('/api/usuarios/signup', usuario);
        setUsuario(data.usuario);
        setToken(data.token);

    }

    /**
     * Funcion para salir de la aplicación
     */
    function logout() {
        setUsuario(null);
        deleteToken();
    }

    /**
     * Funcion para mostrar errores
     */
    function mostrarError(mensaje) {
        setError(mensaje);
    }

    /**
     * Funcion para esconder el boton del error
     */
    function esconderError() {
        setError(null);
    }


    if (cargandoUsuario) {
        return (
            <Main center>
                <Loading/>
            </Main>
        )
    }

    return (
        <Router>
            <Nav usuario={usuario}/>
            <Error mensaje={error} esconderError={esconderError}/>
            {
                usuario ? (<LoginRoutes mostrarError={mostrarError} usuario={usuario} logout={logout} />) : (
                    <LogoutRoutes login={login} signup={signup}/>)
            }
            <div>{JSON.stringify(usuario)}</div>
        </Router>

    );


}

//Nuevos componentes de las rutas del usuario que este autenticado
function LoginRoutes({mostrarError, usuario, logout}) {
    return (
        <Switch >
            <Route
                path="/upload"
                render={props => <Upload {...props} mostrarError={mostrarError}></Upload>}/>} />
            <Route
                path="/post/:id"
                render={props => <Post {...props} mostrarError={mostrarError} usuario={usuario}></Post>}/>} />
            <Route
                path="/perfil/:username"
                render={props => <Perfil {...props} mostrarError={mostrarError} usuario={usuario} logout={logout}></Perfil>}/>} />
            <Route
                path="/explore"
                render={props => <Explore {...props} mostrarError={mostrarError}></Explore>}/>} />
            <Route
                path="/" render={props => <Feed {...props} mostrarError={mostrarError} usuario={usuario}></Feed>}/>}default/>
        </Switch>
    )

}

//Render las rutas cuando no esta autenticado
function LogoutRoutes({login, signup}) {
    return (
        <Switch>
            <Route
                path="/login/"
                render={props => <Login {...props} login={login}></Login>}/>} />

            <Route render={props => <Signup {...props} signup={signup}/>} default/>
        </Switch>
    )
}
