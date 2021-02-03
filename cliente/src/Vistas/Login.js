import React, {useState} from 'react';
import Main from "../Componentes/Main";
import {Link } from 'react-router-dom';



/**
 * Retorno en formato JSX
 * @constructor
 */
export default function Login({ login}) {

    const [emailYPasword, setEmailYPasword] = useState({
        email: '',
        password: '',

    });

    /**
     * Cuando cambia un valor en el formulario
     * @param e
     */
    function handleInputChange(e) {
        setEmailYPasword({
            ...emailYPasword,
            [e.target.name]: e.target.value
        });
    }

    /**
     * Cuando se envie el formulario
     * llamamos esta funcion
     * Asincrona
     * @param e
     */
    async function handleSubmit(e) {
        e.preventDefault();
        try {
          await login(emailYPasword.email, emailYPasword.password);

        } catch (error) {
            console.log(error);
        }

    }


    return (
        <Main center>
            <div className="FormContainer">
                <h1 className="Form__titulo">Instagram</h1>
                <div>
                    <form onSubmit={handleSubmit}>
                        <input type="email" name="email" required className="Form__field" placeholder="Email"
                               onChange={handleInputChange}
                               value={emailYPasword.email}
                        />
                        <input type="password" name="password" required className="Form__field"
                               onChange={handleInputChange}
                               value={emailYPasword.password}
                               placeholder="Contraseña"/>

                        <button type="submit" className="Form__submit">
                            Login
                        </button>

                        <p className="FormContainer__info">
                            No tienes cuenta ? <Link to="/signup">Signup</Link>

                        </p>


                    </form>
                </div>

            </div>
        </Main>

    )
}