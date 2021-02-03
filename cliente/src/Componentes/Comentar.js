import React, {useState} from 'react';

export default function Comentar({onSumitComentario, mostrarError}) {
    const [mensaje, setMensaje] = useState('');
    const [enviandoComentario, setEnviandoComentario] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();

        if (enviandoComentario) {
            return;
        }
        try {
            setEnviandoComentario(true);
            await onSumitComentario(mensaje);
            setMensaje('');
            setEnviandoComentario(false);
        } catch (error) {
            setEnviandoComentario(false);
            // mostrarError('Hubo un problema guardando el comentario, Intente de nuevo.');
            console.log(error);
        }

    }

    return (
        <form className="Post__comentario-form-container" onSubmit={onSubmit}>
            <input type="text" placeholder="Deja tu comentario" required maxLength="180"
                   value={mensaje}
                   onChange={e => setMensaje(e.target.value)}
            />
            <button type="submit">Post</button>
        </form>
    )
}