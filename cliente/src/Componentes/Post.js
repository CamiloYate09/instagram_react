import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import Avatar from "./Avatar";
import BotonLike from "./BotonLike";
import Comentar from "./Comentar";
import {toggleLike,comentar} from '../Helpers/post-helpers';

/**
 * esto es una vista
 * @param post
 * @param actualizarPost
 * @param mostrarError
 * @returns {JSX.Element}
 * @constructor
 */
export default function Post({post, actualizarPost,mostrarError, usuario}) {
    const {
        numLikes,
        numComentarios,
        comentarios,
        _id,
        caption,
        url,
        usuario: usuarioDelPost,
        estaLike
    } = post;
    const [enviandoLike, setEnviandoLike] = useState(false);

    async function onSubmitLike(){
        if(enviandoLike){
            return;
        }

        try {
            setEnviandoLike(true);
            const postActualizado = await toggleLike(post);
            actualizarPost(post,postActualizado);
            setEnviandoLike(false);

        }catch (error){
           setEnviandoLike(false);
            mostrarError('Hubo un problema modificando el like. Intenta de Nuevo');
            console.log(error);


        }
    }

    async function onSubmitComentario(mensaje){
        const postActualiado = await comentar(post, mensaje, usuario);
        actualizarPost(post, postActualiado);
    }

    return (
        <div className="Post-Componente">
            <Avatar usuario={usuarioDelPost}></Avatar>
            <img src={url} alt={caption} className="Post-Componente__img"/>
            <div className="Post-Componente__acciones">
                <div className="Post-Componente__like-container">
                    <BotonLike onSubmited={onSubmitLike} like={estaLike}/>
                </div>
                <p>Liked por {numLikes} personas</p>
                <ul>
                    <li>
                        <Link to={`/perfil/${usuarioDelPost.username}`}>
                            <b>{usuarioDelPost.username}</b>
                        </Link> {' '}
                        {caption}
                    </li>
                    <VerTodosLosComentarios _id={_id} numComentarios={numComentarios}/>
                    <Comentarios comentarios={comentarios} />
                </ul>
            </div>
            <Comentar onSumitComentario={onSubmitComentario} mostrarError={mostrarError}></Comentar>
        </div>
    );
}

function VerTodosLosComentarios({_id, numComentarios}) {
    if (numComentarios < 4) {
        return null;
    }
    return <li className="text-grey-dark">
        <Link to={`/post/${_id}`}>
            ver los {numComentarios} comentarios
        </Link>
    </li>
}

function Comentarios({comentarios}) {
    if (comentarios.length === 0) {
        return null;
    }
    return comentarios.map(comentario => {
        return (
            <li key={comentario._id}>
                <Link to={`/perfil/${comentario.usuario.username}`}>
                    <b>{comentario.usuario.username}</b>
                </Link>{' '}
                {comentario.mensaje}
            </li>
        );
    });
}

