import { memo } from "react";

import Link from "next/link";

// import ROUTES from '@/components/constants/routes';

import ArticlesButton from "@/components/UI/Button";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useGameStore } from "@/hooks/useGameStore";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useStore } from "@/hooks/useStore";
import DebugCard from "./DebugCard";

function LeftPanelContent(props) {

    const {
        isFullscreen,
        requestFullscreen,
        exitFullscreen,
        reloadScene
    } = props;

    // const {
    //     socket,
    // } = useSocketStore(state => ({
    //     socket: state.socket,
    // }));

    // const {
    //     score,
    //     playerLocation,
    //     debug,
    //     setDebug
    // } = useGameStore(state => ({
    //     score: state.score,
    //     playerLocation: state.playerLocation,
    //     debug: state.debug,
    //     setDebug: state.setDebug
    // }));

    const debug = useGameStore((state) => state.debug)
    const setDebug = useGameStore((state) => state.setDebug)

    const setShowSettingsModal = useGameStore((state) => state.setShowSettingsModal)

    const darkMode = useStore((state) => state.darkMode)
    const toggleDarkMode = useStore((state) => state.toggleDarkMode)

    const showSidebar = useStore((state) => state.showSidebar)
    const setShowSidebar = useStore((state) => state.setShowSidebar)

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body d-flex flex-wrap">

                    <Link
                        href={'/'}
                        className="w-50"
                    >
                        <ArticlesButton
                            className='w-100'
                            small
                        >
                            <i className="fad fa-arrow-alt-square-left"></i>
                            <span>Leave Game</span>
                        </ArticlesButton>
                    </Link>

                    <ArticlesButton
                        small
                        className="w-50"
                        active={isFullscreen}
                        onClick={() => {
                            if (isFullscreen) {
                                exitFullscreen()
                            } else {
                                requestFullscreen('catching-game-game-page')
                            }
                        }}
                    >
                        {isFullscreen && <span>Exit </span>}
                        {!isFullscreen && <span><i className='fad fa-expand'></i></span>}
                        <span>Fullscreen</span>
                    </ArticlesButton>

                    <ArticlesButton
                        size="sm"
                        className="w-50"
                        onClick={reloadScene}
                    >
                        <i className="fad fa-redo"></i>
                        Reload Game
                    </ArticlesButton>

                    <div className='w-50'>
                        <DropdownButton
                            variant="articles w-100"
                            size='sm'
                            id="dropdown-basic-button"
                            className="dropdown-articles"
                            title={
                                <span>
                                    <i className="fad fa-bug"></i>
                                    <span>Debug </span>
                                    <span>{debug ? 'On' : 'Off'}</span>
                                </span>
                            }
                        >

                            <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                {[
                                    false,
                                    true
                                ]
                                    .map(location =>
                                        <Dropdown.Item
                                            key={location}
                                            onClick={() => {
                                                setDebug(location)
                                            }}
                                            className="d-flex justify-content-between"
                                        >
                                            {location ? 'True' : 'False'}
                                        </Dropdown.Item>
                                    )}

                            </div>

                        </DropdownButton>
                    </div>

                    <div className='w-50 d-flex'>
                        <ArticlesButton
                            // ref={el => elementsRef.current[2] = el}
                            className={`w-100`}
                            small
                            onClick={() => {
                                setShowSettingsModal(true)
                            }}
                        >
                            <i className="fad fa-cog"></i>
                            Settings
                        </ArticlesButton>
                        <ArticlesButton
                            // ref={el => elementsRef.current[2] = el}
                            className={``}
                            small
                            onClick={() => {
                                toggleDarkMode()
                            }}
                        >
                            {darkMode ? <i className="fad fa-sun"></i> : <i className="fad fa-moon"></i>}
                        </ArticlesButton>
                    </div>

                    <ArticlesButton
                            // ref={el => elementsRef.current[2] = el}
                            className={`w-50`}
                            small
                            active={showSidebar}
                            onClick={() => {
                                setShowSidebar(!showSidebar)
                            }}
                        >
                            <i className="fad fa-cog"></i>
                            Sidebar
                        </ArticlesButton>

                </div>

            </div>

            {/* Debug Controls */}
            <DebugCard 
                reloadScene={reloadScene}
            />

        </div>
    )

}

export default memo(LeftPanelContent)