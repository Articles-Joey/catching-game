import { useState, useRef, useEffect } from "react";

import { Modal, Form } from "react-bootstrap"

import ArticlesButton from "@/components/UI/Button";
import { useModalNavigation } from "@/hooks/useModalNavigation";

export default function FourFrogsSettingsModal({
    show,
    setShow,
}) {

    const [showModal, setShowModal] = useState(true)

    const [lightboxData, setLightboxData] = useState(null)

    const [tab, setTab] = useState('Controls')

    const elementsRef = useRef([]);
    useModalNavigation(elementsRef, () => setShowModal(false));

    // Reset refs when tab changes
    useEffect(() => {
        elementsRef.current = [];
    }, [tab]);

    return (
        <>
            {/* {lightboxData && (
                <Lightbox
                    mainSrc={lightboxData?.location}
                    onCloseRequest={() => setLightboxData(null)}
                    reactModalStyle={{
                        overlay: {
                            zIndex: '2000'
                        }
                    }}
                />
            )} */}

            <Modal
                className="articles-modal"
                size='md'
                show={showModal}
                // To much jumping with little content for now
                // centered
                scrollable
                onExited={() => {
                    setShow(false)
                }}
                onHide={() => {
                    setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Game Settings</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    <div className='p-2'>
                        {[
                            'Visuals',
                            'Controls',
                            'Audio',
                            'Chat'
                        ].map((item, i) =>
                            <ArticlesButton
                                ref={el => elementsRef.current[i] = el}
                                key={item}
                                active={tab == item}
                                onClick={() => { setTab(item) }}
                            >
                                {item}
                            </ArticlesButton>
                        )}
                    </div>

                    <hr className="my-0" />

                    <div className="p-2">
                        {tab == 'Visuals' &&
                            <>
                                <div className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <Form.Check
                                            ref={el => elementsRef.current[4] = el}
                                            type="switch"
                                            id="dark-mode-switch"
                                            label="Dark Mode"
                                            // value={enabled}
                                            checked={darkMode}
                                            onChange={() => {
                                                toggleDarkMode();
                                            }}
                                        />
                                    </div>
                                    <div className="small mt-2">
                                        {`Dark Mode changes the game's color scheme to be easier on the eyes in low light environments.`}
                                    </div>
                                </div>

                                <hr />

                                <div>
                                    
                                </div>
                            </>
                        }
                        {tab == 'Controls' &&
                            <div>
                                {[
                                    {
                                        action: 'Move Up',
                                        defaultKeyboardKey: 'W'
                                    },
                                    {
                                        action: 'Move Down',
                                        defaultKeyboardKey: 'S'
                                    },
                                    {
                                        action: 'Move Left',
                                        defaultKeyboardKey: 'A'
                                    },
                                    {
                                        action: 'Move Right',
                                        defaultKeyboardKey: 'D'
                                    },
                                    {
                                        action: 'Drop Insect',
                                        defaultKeyboardKey: 'Space'
                                    },
                                    {
                                        action: 'Stop Powerup',
                                        defaultKeyboardKey: 'ArrowDown'
                                    },
                                    {
                                        emote: true,
                                        action: 'Stick out Tongue',
                                        defaultKeyboardKey: 'ArrowDown'
                                    },
                                    {
                                        emote: true,
                                        action: 'Rotate Left',
                                        defaultKeyboardKey: 'ArrowLeft'
                                    },
                                    {
                                        emote: true,
                                        action: 'Rotate Right',
                                        defaultKeyboardKey: 'ArrowRight'
                                    }
                                ].map((obj, i) =>
                                    <div key={obj.action}>
                                        <div className="flex-header border-bottom pb-1 mb-1">

                                            <div>
                                                <div>{obj.action}</div>
                                                {obj.emote && <div className="span badge bg-dark">Emote</div>}
                                            </div>

                                            <div>

                                                <div className="badge badge-hover bg-articles me-1">{obj.defaultKeyboardKey}</div>

                                                <ArticlesButton
                                                    ref={el => elementsRef.current[4 + i] = el}
                                                    className=""
                                                    small
                                                >
                                                    Change Key
                                                </ArticlesButton>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                        {tab == 'Audio' &&
                            <>
                                <Form.Label className="mb-0">Game Volume</Form.Label>
                                <Form.Range ref={el => elementsRef.current[4] = el} />
                                <Form.Label className="mb-0">Music Volume</Form.Label>
                                <Form.Range ref={el => elementsRef.current[5] = el} />
                            </>
                        }
                        {tab == 'Chat' &&
                            <>
                                <Form.Check
                                    ref={el => elementsRef.current[4] = el}
                                    type="switch"
                                    id="custom-switch"
                                    label="Game chat panel"
                                />
                                <Form.Check
                                    ref={el => elementsRef.current[5] = el}
                                    type="switch"
                                    id="custom-switch"
                                    label="Censor chat"
                                />
                                <Form.Check
                                    ref={el => elementsRef.current[6] = el}
                                    type="switch"
                                    id="custom-switch"
                                    label="Game chat speech bubbles"
                                />
                            </>
                        }
                    </div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    {/* <div></div> */}


                    <div>

                        <ArticlesButton
                            ref={el => elementsRef.current[100] = el}
                            variant="outline-dark"
                            onClick={() => {
                                setShow(false)
                            }}
                            className="d-flex align-items-center"
                        >
                            <img src="/img/Xbox UI/B.svg" className="me-1" alt="Close" />
                            Close
                        </ArticlesButton>

                        <ArticlesButton
                            ref={el => elementsRef.current[101] = el}
                            variant="outline-danger ms-3"
                            onClick={() => {
                                setShow(false)
                            }}
                        >
                            Reset
                        </ArticlesButton>

                    </div>


                    {/* <ArticlesButton variant="success" onClick={() => setValue(false)}>
                    Save
                </ArticlesButton> */}

                </Modal.Footer>

            </Modal>
        </>
    )

}