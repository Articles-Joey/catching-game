import { useEffect, useState, useRef } from "react";

import Image from "next/image";
import dynamic from 'next/dynamic'

// import { useSelector } from 'react-redux'

import { Modal } from "react-bootstrap"

// import ViewUserModal from "@/components/UI/ViewUserModal"

// import BasicLoading from "@/components/loading/BasicLoading";

// import powerups from "app/(site)/community/games/four-frogs/components/powerups";

// import games from "../constants/games";
const games = []

// import IsDev from "@/components/UI/IsDev";
import ArticlesButton from "./Button";
import { useModalNavigation } from "@/hooks/useModalNavigation";

export default function InfoModal({
    show,
    setShow,
    credits
}) {

    const [showModal, setShowModal] = useState(true)

    const [lightboxData, setLightboxData] = useState(null)

    // const userReduxState = useSelector((state) => state.auth.user_details);
    const userReduxState = false

    const [showVideo, setShowVideo] = useState()

    const elementsRef = useRef([]);
    useModalNavigation(elementsRef, () => setShowModal(false));

    useEffect(() => {

        if (!show.item) {
            setShow({
                ...show,
                item: games.find(game_obj => game_obj.name == show.game)
            })
        }

    }, [])

    return (
        <>

            <Modal
                className="articles-modal games-info-modal"
                size='md'
                show={showModal}
                centered
                scrollable
                onExited={() => {
                    setShow(false)
                }}
                onHide={() => {
                    setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Game Info</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    <div>123</div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <div></div>

                    <ArticlesButton 
                        ref={el => elementsRef.current[0] = el}
                        variant="outline-dark" 
                        onClick={() => {
                            setShow(false)
                        }}
                        className="d-flex align-items-center"
                    >
                        <img src="/img/Xbox UI/B.svg" className="me-1" alt="Close" />
                        Close
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>

        </>
    )

}