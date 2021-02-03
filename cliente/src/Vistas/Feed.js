import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Axios from "axios";
import Main from "../Componentes/Main";
import Loading from "../Componentes/Loading";
import Post from "../Componentes/Post";


/**
 * Funcion para retornar los ultimos post por la fecha
 * @returns {JSX.Element}
 * @constructor
 */

async function cargarPost(fechaDelUltimoPost) {
    const query = fechaDelUltimoPost ? `?fecha=${fechaDelUltimoPost}` : '';
    const {data: nuevosPosts} = await Axios.get(`/api/posts/feed${query}`);
    return nuevosPosts;
}
/*
Variables Globales
 */
const NUMERO_DE_POSTS_POR_LLAMADA = 3;


export default function Feed({mostrarError,usuario}) {
    const [posts, setPosts] = useState([]);
    const [cargandoPostIniciales, setCargandoPostIniciales] = useState(true);
    const [cargandoMasPosts, setcargandoMasPosts] = useState(false);
    const [todosLosPostsCargados, setTodosLosPostsCargados] = useState(false);

    useEffect(() => {
        async function cargarPostsIniciales() {
            try {
                const nuevosPosts = await cargarPost();
                setPosts(nuevosPosts);
                console.log(nuevosPosts);
                setCargandoPostIniciales(false);
                revisarSiHayMasPosts(nuevosPosts);

            } catch (error) {
                mostrarError('Hubo un problema cargando tu feed.');
                console.log(error);

            }
        }

        cargarPostsIniciales();
    }, []);

    function actualizarPost(postOriginal, postActualizado){
        setPosts(posts =>{
            const postsActualizados = posts.map(post =>{
                if(post !== postOriginal){
                    return post;
                }
                return postActualizado;
            });
            return postsActualizados;
        });
    }

    /**
     * método para cargar nuevos posts
     * @returns {Promise<void>}
     */
    async function cargarMasPosts(){
        if(cargandoMasPosts){
            return;
        }
        try {
            /**
             * evitamos que el usuario le de 10 veces al botón
             */
            setcargandoMasPosts(true);
            const  fechaDelUltimoPost = posts[posts.length -1].fecha_creado;
            const nuevosPost = await cargarPost(fechaDelUltimoPost);
            /**
             * Creamos un nuevo array de los viejos posts y le
             * agregamos los nuevos
             */
            setPosts(viejosPosts => [...viejosPosts, ...nuevosPost]);
            setcargandoMasPosts(false);
            revisarSiHayMasPosts(nuevosPost);
        }catch (error){
            mostrarError('Hubo un problema cargando los siguientes posts.');
            console.log(error);
            setcargandoMasPosts(false);
        }
    }

    /**
     *
     * @param nuevosPosts
     */
    function revisarSiHayMasPosts(nuevosPosts){
        if(nuevosPosts.length < NUMERO_DE_POSTS_POR_LLAMADA){
            setTodosLosPostsCargados(true);
        }
    }

    if (cargandoPostIniciales) {
        return (
            <Main center>
                <Loading></Loading>
            </Main>
        );
    }
    if(cargandoPostIniciales && posts.length === 0){
        return(
         <Main center>
             <NoSiguesANadie/>
         </Main>
        )
    }


    return (<Main center>
        <div className="Feed">
            {
                posts.map(post => (<Post key={post._id} post={post} actualizarPost={actualizarPost} mostrarError={mostrarError} usuario={usuario}></Post> ))
            }
            <CargarMasPosts onClick={cargarMasPosts} todosLosPostsCargados={todosLosPostsCargados}></CargarMasPosts>
        </div>
    </Main>);
}

function NoSiguesANadie() {
    return (
        <div className="NoSiguesANadie">
            <p className="NoSiguesANadie__mensaje">
                Tu feed no tiene fotos porque no sigues a nadie, o porque no han publicado fotos.
            </p>
            <div className="text-center">
                <Link to="/explore" className="NoSiguesANadie__boton">
                    Explota Clontagram
                </Link>
            </div>
        </div>

    );
}

/**
 *Funcion de paginación para cargar más post
 * @param onClick
 * @param todosLosPostsCargados
 * @returns {JSX.Element}
 * @constructor
 */
function CargarMasPosts({onClick, todosLosPostsCargados}){
    if(todosLosPostsCargados){
        return <div className="Feed__no-hay-mas-posts"> No hay más posts</div>
    }
    return (
        <button className="Feed__cargar-mas" onClick={onClick}>
            Ver más
        </button>
    );
}