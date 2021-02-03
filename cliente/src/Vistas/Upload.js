import React, {useState} from 'react';
import Main from '../Componentes/Main'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import Loading from "../Componentes/Loading";
import Axios from "axios";

export default function Upload({ history,mostrarError}) {
    /**
     * Estados
     */
    const [imagenUrl, setImagenUrl] = useState('');
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    const [enviandoPost, setEnviandoPost] = useState(false);
    const [caption, setCaption] = useState('');

    /**
     * Funcion para subir la imagen
     * al servidor
     */
    async function handleImagenSeleccionada(evento) {
        try {
            setSubiendoImagen(true);
            const file = evento.target.files[0];
            // console.log(file);
            console.log(file.name);
            const config = {
                headers: {
                    'Content-Type': file.type
                }
            }
            const {data} = await Axios.post('/api/posts/upload', file, config);
            setImagenUrl(data.url);
            setSubiendoImagen(false);


        } catch (error) {
            setSubiendoImagen(false);
            mostrarError(error.response.data);
            console.log(error)
        }
    }

    /**
     * Guardar la foro el servidor
     */

    async function handleSubmit(evento) {
        evento.preventDefault();

        if (enviandoPost) {
            return;
        }
        if (subiendoImagen) {
            mostrarError('No se ha terminado de subir la imagen');
        }
        if (!imagenUrl) {
            mostrarError('Primero selecciona una imagen');
        }

        /**
         * el usuario subio la imagen exitosamente
         */

        try {
            setEnviandoPost(true);
            const body = {
                caption,
                url: imagenUrl
            };
            await Axios.post('/api/posts', body);
            setEnviandoPost(false);
            history.push('/');

        } catch (error) {
            mostrarError(error.response.data);

        }


    }


    return (
        <Main center>
            <div className="Upload">
                <form onSubmit={handleSubmit}>
                    <div className="Upload__image-section">
                        <SeccionSubirImagen imagenUrl={imagenUrl} subiendoImagen={subiendoImagen}
                                            handleImagenSeleccionada={handleImagenSeleccionada}/>
                    </div>
                    <textarea name="caption" className="Upload__caption" required maxLength="180"
                              placeholder="Caption de tu post."
                              value={caption}
                              onChange={e => setCaption(e.target.value)}
                    ></textarea>
                    <button className="Upload__submit" type="submit">
                        Post
                    </button>
                </form>
            </div>
        </Main>
    );
}

/***
 * Nuevo componente
 */

function SeccionSubirImagen({subiendoImagen, imagenUrl, handleImagenSeleccionada}) {
    if (subiendoImagen) {
        return <Loading/>;
    } else if (imagenUrl) {
        return <img src={imagenUrl} alt=""/>;
    } else {
        return (
            <label className="Upload__image-label">
                <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                <span>Publica una foto</span>
                <input type="file" className="hidden" name="image" onChange={handleImagenSeleccionada}/>
            </label>
        );
    }

}
