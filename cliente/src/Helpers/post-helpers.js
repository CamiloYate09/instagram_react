import Axios from "axios";

/**
 * Funcion que nos ayuda a enviar a actualizar los likes de
 * una foto.
 * @param post
 * @returns {Promise<*&{estaLike: boolean, numLikes: *}>}
 */
export async function toggleLike(post) {
    const url = `/api/posts/${post._id}/likes`;
    let postConLikeActualizacion;

    if (post.estaLike) {
        await Axios.delete(url, {});
        postConLikeActualizacion = {
            ...post,
            estaLike: false,
            numLikes: post.numLikes - 1
        }
    } else {
        await Axios.post(url, {});
        postConLikeActualizacion = {
            ...post,
            estaLike: true,
            numLikes: post.numLikes + 1
        }
    }
    return postConLikeActualizacion;

}

/**
 *
 * @param post
 * @param mensaje
 * @param usuario
 * @returns {Promise<void>}
 */
export async function comentar(post, mensaje, usuario) {

    const {data: nuevoComentario} = await Axios.post(`/api/posts/${post._id}/comentarios`, {mensaje});
    nuevoComentario.usuario = usuario;

    /**
     * sustituir el post viejo por el post nuevo
     * @type {*&{numComentarios: *, comentarios: *[]}}
     */
    const postConComentariosActualizados = {
        ...post,
        comentarios: [...post.comentarios, nuevoComentario],
        numComentarios: post.numComentarios + 1
    };
    return postConComentariosActualizados;


}