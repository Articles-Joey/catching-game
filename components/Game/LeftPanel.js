import { memo } from "react";

import Link from "next/link";

// import ROUTES from '@/components/constants/routes';

import ArticlesButton from "@/components/UI/Button";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useGameStore } from "@/hooks/useGameStore";
import { Dropdown, DropdownButton } from "react-bootstrap";

function LeftPanelContent(props) {

    const {
        isFullscreen,
        requestFullscreen,
        exitFullscreen,
        reloadScene
    } = props;

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const {
        score,
        playerLocation,
        debug,
        setDebug
    } = useGameStore(state => ({
        score: state.score,
        playerLocation: state.playerLocation,
        debug: state.debug,
        setDebug: state.setDebug
    }));

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
                                requestFullscreen('maze-game-page')
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

                </div>

            </div>

            {/* Debug Controls */}
            <div
                className="card card-articles card-sm"
            >
                <div className="card-body">

                    <div className="small text-muted">Debug Controls</div>

                    <div className="small border p-2">
                        <div>Score: {score}</div>
                        <div>
                            <span>Position: </span>
                            <span>
                                {playerLocation[0]?.toFixed(2)}
                                <span> - </span>
                                {playerLocation[1]?.toFixed(2)}
                                <span> - </span>
                                {playerLocation[2]?.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* <div className='d-flex flex-column'>
            
                                    <div>
                                        <ArticlesButton
                                            size="sm"
                                            className="w-50"
                                            onClick={reloadScene}
                                        >
                                            <i className="fad fa-redo"></i>
                                            Reload Game
                                        </ArticlesButton>
            
                                        <ArticlesButton
                                            size="sm"
                                            className="w-50"
                                            onClick={reloadScene}
                                        >
                                            <i className="fad fa-redo"></i>
                                            Reset Camera
                                        </ArticlesButton>
                                    </div>
            
                                </div> */}

                </div>
            </div>

        </div>
    )

}

export default memo(LeftPanelContent)