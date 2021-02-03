import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as heartRegular} from "@fortawesome/free-regular-svg-icons";
import {faHeart as heartSolid} from "@fortawesome/free-solid-svg-icons";

export default function BotonLike({onSubmited, like}) {
    return (
        <button onClick={onSubmited}>
            {
                like ? (
                        <FontAwesomeIcon className="text-red-dark" icon={heartSolid}/>
                    )
                    : (
                        <FontAwesomeIcon icon={heartRegular}/>
                    )

            }
        </button>

    );
}