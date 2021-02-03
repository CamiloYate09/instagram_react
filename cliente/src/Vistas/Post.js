import React, {useState, useEffect} from "react";
import Main from "../Componentes/Main";
import Loading from "../Componentes/Loading";
import Avatar from "../Componentes/Avatar";
import Comentar from "../Componentes/Comentar";
import BotonLike from "../Componentes/BotonLike";
import {Link} from "react-router-dom";
import RecursoNoExiste from "../Componentes/RecursoNoExiste";
import Axios from "axios";
import {toggleLike,comentar} from '../Helpers/post-helpers';

/**
 *
 * @param mostrarError
 * @param match
 * @returns {JSX.Element}
 * @constructor
 */
export  default function PostVista({mostrarError, match, usuario}) {
    /**
     * tomamos del pàrametro que nos envias desde la URL
     */
    const postId = match.params.id;
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [postNoExiste, setPostNoExiste] = useState(false);
    const [enviandoLike, setEnviandoLike] = useState(false);


    useEffect(() => {
        async function cargarPost() {
            try {

                const {data: post} = await Axios.get(`/api/posts/${postId}`);
                setPost(post);
                setLoading(false);
            } catch (error) {
                if (error.response && (error.response.status === 404 || error.response.status === 400)) {
                    setPostNoExiste(true);
                } else {
                    mostrarError('Hubo un problema cargando este post.');
                }
                setLoading(false);
            }
        }

        cargarPost();
    }, [postId]);


    async function onSubmitComentario(mensaje) {
        const postActualizado = await comentar(post, mensaje, usuario);
        setPost(postActualizado);

    }

    async function onSubmitLike() {
        if (enviandoLike) {
            return;
        }

        try {
            setEnviandoLike(true);
            const postActualizado = await toggleLike(post);
            setPost(postActualizado);
            setEnviandoLike(false);

        } catch (error) {
            setEnviandoLike(false);
            mostrarError('Hubo un problema modificando el like. Intenta de Nuevo');
            console.log(error);


        }
    }


    if (loading) {
        return (
            <Main center>
                <Loading/>
            </Main>
        )
    }
    if (postNoExiste) {
        return (
            <RecursoNoExiste mensaje="El post que estan intentando ver no existe"/>
        );
    }
    if (post == null) {
        return null;
    }

    return (
        <Main cente>
            <Post {...post} onSubmitComentario={onSubmitComentario} onSubmitLike={onSubmitLike}/>
        </Main>

    )
}

/**
 *
 * @param comentarios
 * @param caption
 * @param url
 * @param usuario
 * @param estaLike
 * @param onSubmitLike
 * @param onSubmitComentario
 * @constructor
 */
function Post({comentarios, caption, url, usuario,estaLike, onSubmitLike, onSubmitComentario}){
    return(
        <div className="Post">
            <div className="Post__image-container">
                <img src={url} alt={caption}/>
            </div>
            <div className="Post__side-bar">
                <Avatar usuario={usuario}></Avatar>
                <div className="Post__comentarios-y-like">
                    <Comentarios usuario={usuario} caption={caption} comentarios={comentarios}/>
                    <div className="Post__like">
                        <BotonLike onSubmited={onSubmitLike} like={estaLike}/>
                    </div>
                    <Comentar onSumitComentario={onSubmitComentario} />
                </div>
            </div>
        </div>
    )

}
function Comentarios({usuario, caption, comentarios }){
    return (
        <ul className="Post__comentarios">
            <li className="Post__comentario">
                <Link to={`/perfil/${usuario.username}`}
                      className="Post__autor-comentario"
                >
                    <b>{usuario.username}</b>

                </Link>{' '}
                {caption}
            </li>
            {
                comentarios.map(comentario =>(
                    <li className="Post__comentario" key={comentario._id}>
                        <Link to={`/perfil/${comentario.usuario.username}`}
                              className="Post__autor-comentario"
                        >
                            <b>{comentario.usuario.username}</b>

                        </Link> {' '}
                        {comentario.mensaje}
                    </li>
                ))}
        </ul>
    )
}
