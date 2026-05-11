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

import GameMenu from '@articles-media/articles-dev-box/GameMenu';
import UiOverlay from '@/components/UI/UiOverlay';
import Link from 'next/link';
import classNames from 'classnames';

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
    const showMenu = useStore((state) => state.showMenu)
    const nickname = useStore((state) => state.nickname)

    // const score = useGameStore((state) => state.score)

    // const health = useGameStore((state) => state.health)
    const players = useGameStore(state => state.gameState.players)
    const score = useMemo(() => {
        const player = players?.find(p => p.id === socket.id)
        return player ? player.score : 0;
    }, [players, socket.id])
    // const health = useMemo(() => {
    //     const player = players?.find(p => p.id === socket.id)
    //     return player ? player.health : 0;
    // }, [players, socket.id])

    const setScore = useGameStore((state) => state.setScore)
    const setHealth = useGameStore((state) => state.setHealth)
    const setTimer = useGameStore((state) => state.setTimer)

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    useEffect(() => {

        if (server && socket.connected) {
            const roomName = `game:${process.env.NEXT_PUBLIC_GAME_KEY}-room-${server}`;
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

    const status = useGameStore(state => state.gameState.status)
    const sceneKey = useStore((state) => state.sceneKey)

    useEffect(() => {
        setHealth(5);
        setScore(0);
        setTimer(60);
    }, [sceneKey])

    // const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    // const game_name = 'Catching Game'
    // const game_key = 'catching-game'

    return (

        <div
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`,
                {
                    'menu-open': showMenu,
                    'fullscreen': useFullscreen().isFullscreen,
                    'show-sidebar': sidebar,
                }
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
        >

            <Suspense>

                <AudioHandler />

                {status == "Game Over" ?
                    <ArticlesModal
                        show={true}
                        disableClose={true}
                        modalClassName="game-over-modal"
                        title={"Game Over!"}
                        action={() => {
                            // reloadScene()
                            // startGame(server, "In Lobby")
                        }}
                        actionText={"Play Again?"}
                        footerOverride={
                            <div className='d-flex justify-content-between w-100'>
                                <Link href={"/"} className="w-50">
                                    <ArticlesButton
                                        className="w-100"
                                        onClick={() => {
                                            // reloadScene();
                                        }}
                                    >
                                        <i className='fad fa-arrow-left'></i>
                                        Exit to Lobby
                                    </ArticlesButton>
                                </Link>
                                <ArticlesButton
                                    className="w-50"
                                    onClick={() => {
                                        startGame(server, "In Lobby");
                                    }}
                                >
                                    <i className='fad fa-play'></i>
                                    Play Again?
                                </ArticlesButton>
                            </div>
                        }
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

            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Corner Button",
                    menuBarButtonPosition: "Left"
                }}
                sidebarConfig={{
                    style: "Static Panel",
                }}
            />

            <TouchControls />

            <div className='canvas-wrap'>

                <UiOverlay />

                <GameCanvas
                    key={sceneKey}
                />

            </div>

        </div>
    );
}