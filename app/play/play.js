"use client"
import { useEffect, useContext, useState, useRef, useMemo, Suspense } from 'react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
import dynamic from 'next/dynamic'
// import Script from 'next/script'

// import { useSelector, useDispatch } from 'react-redux'

// import ROUTES from '@/components/constants/routes';

import ArticlesButton from '@/components/UI/Button';

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import { useControllerStore } from '@/hooks/useControllerStore';

// import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
import LeftPanelContent from '@/components/UI/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';
import { useGameStore } from '@/hooks/useGameStore';
import AudioHandler from '@/components/Game/AudioHandler';
import ArticlesModal from '@/components/UI/ArticlesModal';

const TouchControls = dynamic(() => import('@/components/UI/TouchControls'), {
    ssr: false,
});

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

export default function GamePage() {

    const {
        socket,
        startGame
    } = useSocketStore(state => ({
        socket: state.socket,
        startGame: state.startGame
    }));

    const sidebar = useStore((state) => state.sidebar)
    const nickname = useStore((state) => state.nickname)

    const score = useGameStore((state) => state.score)
    const health = useGameStore((state) => state.health)
    // const timer = useGameStore((state) => state.timer)
    const setScore = useGameStore((state) => state.setScore)
    const setHealth = useGameStore((state) => state.setHealth)
    const timer = useGameStore((state) => state.timer)
    const setTimer = useGameStore((state) => state.setTimer)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    // const { controllerState, setControllerState } = useControllerStore()
    // const [showControllerState, setShowControllerState] = useState(false)

    // const [ cameraMode, setCameraMode ] = useState('Player')

    const [players, setPlayers] = useState([])

    const showMenu = useStore((state) => state.showMenu)
    const setShowMenu = useStore((state) => state.setShowMenu)
    // const [showMenu, setShowMenu] = useState(false)

    useEffect(() => {

        if (sidebar == true) {
            setShowMenu(false)
        }

    }, [sidebar])

    useEffect(() => {

        if (server && socket.connected) {
            const roomName = `game:${game_key}-room-${server}`;
            socket.emit('join-room', roomName, {
                game_id: server,
                nickname: nickname,
                client_version: '1',

            });

            return function cleanup() {
                socket.emit('leave-room', roomName)
            };
        }

    }, [server, socket.connected, nickname]);

    const sceneKey = useStore((state) => state.sceneKey)
    const setSceneKey = useStore((state) => state.setSceneKey)

    useEffect(() => {
        setHealth(5);
        setScore(0);
        setTimer(60);
    }, [sceneKey])

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    let panelProps = {
        // server,
        // players,
        // touchControlsEnabled,
        // setTouchControlsEnabled,
        // reloadScene,
        // controllerState,
        // isFullscreen,
        // requestFullscreen,
        // exitFullscreen,
        // setShowMenu
    }

    const game_name = 'Catching Game'
    const game_key = 'catching-game'

    const status = useGameStore(state => state.gameState.status)

    return (

        <div
            className={`${game_key}-game-page ${isFullscreen && 'fullscreen'} ${sidebar && 'show-sidebar'}`}
            id={`${game_key}-game-page`}
        >

            <Suspense>

                {/* <AudioHandler /> */}

                {status == "Game Over" ?
                    <ArticlesModal
                        show={true}
                        disableClose={true}
                        modalClassName="game-over-modal"
                        title={"Game Over!"}
                        action={() => (
                            // reloadScene()
                            startGame(server)
                        )}
                        actionText={"Play Again?"}
                    >
                        <div className='text-center'>
                            <h2>{`Time's Up!`}</h2>
                            <p className='mb-0'>Your final score is: <strong>{score}</strong></p>
                            {/* <ArticlesButton
                                onClick={() => {
                                    reloadScene();
                                }}
                            >
                                Play Again?
                            </ArticlesButton> */}
                        </div>
                    </ArticlesModal>
                    :
                    ''
                }

            </Suspense>

            <div className="menu-bar card card-articles ">

                <div className="d-flex justify-content-center align-items-center h-100 w-100">
                    <ArticlesButton
                        small
                        className="w-100 h-100"
                        active={showMenu}
                        onClick={() => {
                            setShowMenu(prev => !prev)
                        }}
                    >
                        <i className="fad fa-bars"></i>
                        {/* <span>Menu</span> */}
                    </ArticlesButton>
                </div>

            </div>

            <div className={`mobile-menu ${showMenu && 'show'}`}>
                <div
                    style={{
                        maxWidth: '300px'
                    }}
                    className='mx-auto'
                >
                    <LeftPanelContent
                        {...panelProps}
                    />
                </div>
            </div>

            <TouchControls
            // touchControlsEnabled={touchControlsEnabled}
            />

            <div className='panel-left'>

                <div className='card rounded-0'>
                    <LeftPanelContent
                        {...panelProps}
                    />
                </div>

            </div>

            {/* <div className='game-info'>
                <div className="card card-articles card-sm">
                    <div className="card-body">
                        <pre> 
                            {JSON.stringify(playerData, undefined, 2)}
                        </pre>
                    </div>
                </div>
            </div> */}

            <div className='canvas-wrap'>

                <div className='game-ui-overlay'>

                    <div className='score'>
                        Timer: {timer} - Score: {score}
                    </div>

                    <div>
                        {[...Array(health)].map((_, index) =>
                            <img
                                key={index}
                                src={"/img/heart.png"}
                                width={50}
                            ></img>
                        )}
                    </div>

                </div>

                <GameCanvas
                    key={sceneKey}
                />

            </div>

        </div>
    );
}