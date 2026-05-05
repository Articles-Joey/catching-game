"use client"
import { useEffect, useContext, useState, useRef, Suspense } from 'react';

import Image from 'next/image'
import Link from 'next/link'

import { useLandingNavigation } from '@/hooks/useLandingNavigation';

import ArticlesButton from '@/components/UI/Button';

import { useSocketStore } from '@/hooks/useSocketStore';
import { useSearchParams } from 'next/navigation';

// const game_key = 'catching-game'
// const game_name = 'Catching Game'
// const game_port = 3030

const GameScoreboard = dynamic(() =>
    import('@articles-media/articles-dev-box/GameScoreboard'),
    { ssr: false }
);
const Ad = dynamic(() =>
    import('@articles-media/articles-dev-box/Ad'),
    { ssr: false }
);

import useUserDetails from '@articles-media/articles-dev-box/useUserDetails';
import useUserToken from '@articles-media/articles-dev-box/useUserToken';

import NicknameInput from '@articles-media/articles-dev-box/NicknameInput';
import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';

import { GamepadKeyboard, PieMenu } from '@articles-media/articles-gamepad-helper';

const ReturnToLauncherButton = dynamic(() =>
    import('@articles-media/articles-dev-box/ReturnToLauncherButton'),
    { ssr: false }
);

import SessionButton from '@articles-media/articles-dev-box/SessionButton';

import { useStore } from '@/hooks/useStore';
import dynamic from 'next/dynamic';
import RotatingMascot from '@/components/UI/RotatingMascot';

export default function LobbyPage() {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries())
    let {
        controllerMode,
        launcher_mode,
    } = searchParamsObject

    launcher_mode = launcher_mode === '1' ? true : false

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const darkMode = useStore((state) => state.darkMode)
    const toggleDarkMode = useStore((state) => state.toggleDarkMode)

    const nickname = useStore((state) => state.nickname)
    const setNickname = useStore((state) => state.setNickname)
    const nicknameKeyboard = useStore((state) => state.nicknameKeyboard)
    const randomNickname = useStore((state) => state.randomNickname)
    const _hasHydrated = useStore((state) => state._hasHydrated)

    const setShowInfoModal = useStore((state) => state.setShowInfoModal)
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)
    const setShowCreditsModal = useStore((state) => state.setShowCreditsModal)

    const lobbyDetails = useStore((state) => state.lobbyDetails)
    const setLobbyDetails = useStore((state) => state.setLobbyDetails)

    const elementsRef = useRef([]);
    useLandingNavigation(elementsRef);

    useEffect(() => {

        if (socket.connected) {
            socket.emit('join-room', `game:${process.env.NEXT_PUBLIC_GAME_KEY}-landing`);
        }

        return function cleanup() {
            socket.emit('leave-room', `game:${process.env.NEXT_PUBLIC_GAME_KEY}-landing`);
        };

    }, [socket.connected]);

    const {
        data: userToken,
        error: userTokenError,
        isLoading: userTokenLoading,
        mutate: userTokenMutate
    } = useUserToken(
        process.env.NEXT_PUBLIC_GAME_PORT
    );

    const {
        data: userDetails,
        error: userDetailsError,
        isLoading: userDetailsLoading,
        mutate: userDetailsMutate
    } = useUserDetails({
        token: userToken
    });

    return (

        <div className="catching-game-landing-page">

            <Suspense>
                <GamepadKeyboard
                    disableToggle={true}
                    active={nicknameKeyboard}
                    onFinish={(text) => {
                        console.log("FINISH KEYBOARD", text)
                        useStore.getState().setNickname(text);
                        useStore.getState().setNicknameKeyboard(false);
                    }}
                    onCancel={(text) => {
                        console.log("CANCEL KEYBOARD", text)
                        // useStore.getState().setNickname(text);
                        useStore.getState().setNicknameKeyboard(false);
                    }}
                />
                <PieMenu
                    options={[
                        {
                            label: 'Settings',
                            icon: 'fad fa-cog',
                            callback: () => {
                                setShowSettingsModal(prev => !prev)
                            }
                        },
                        {
                            label: 'Go Back',
                            icon: 'fad fa-arrow-left',
                            callback: () => {
                                window.history.back()
                            }
                        },
                        {
                            label: 'Credits',
                            icon: 'fad fa-info-circle',
                            callback: () => {
                                setShowCreditsModal(true)
                            }
                        },
                        {
                            label: 'Game Launcher',
                            icon: 'fad fa-gamepad',
                            callback: () => {
                                window.location.href = 'https://games.articles.media';
                            }
                        },
                        {
                            label: `${darkMode ? "Light" : "Dark"} Mode`,
                            icon: 'fad fa-palette',
                            callback: () => {
                                toggleDarkMode()
                            }
                        }
                    ]}
                    onFinish={(event) => {
                        console.log("Event", event)
                        if (event.callback) {
                            event.callback()
                        }
                    }}
                />
            </Suspense>

            <div className='background-wrap'>
                {darkMode ?
                    <Image
                        src={`/img/dark-preview.webp`}
                        alt=""
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center', filter: 'blur(10px)' }}
                    />
                    :
                    <Image
                        src={`/img/preview.webp`}
                        alt=""
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center', filter: 'blur(10px)' }}
                    />
                }
            </div>

            <div className="container d-flex flex-column flex-lg-row justify-content-center align-items-center py-3">

                <div
                    style={{ "width": "20rem" }}
                >

                    <img
                        src={`/img/temp_logo.webp`}
                        alt="Catching Game Logo"
                        className="mt-4"
                        height={200}
                        style={{
                            objectFit: "contain",
                            width: "100%"
                        }}
                    >
                    </img>

                    <div
                        className="card card-articles card-sm mb-4"
                    >

                        <div className='card-header d-flex align-items-center'>

                            <NicknameInput 
                                useStore={useStore}
                            />

                        </div>

                        <div className="card-body">

                            <div
                             className='mb-3'
                            >
                                <Link href={{
                                    pathname: `/play`
                                }}>
                                    <ArticlesButton
                                        ref={el => elementsRef.current[1] = el}
                                        className={`w-100`}
                                        small
                                    >
                                        <i className="fas fa-play"></i>
                                        Play Single Player
                                    </ArticlesButton>
                                </Link>
                            </div>

                            <div className="fw-bold mb-1 small text-center">
                                {lobbyDetails.players.length || 0} player{lobbyDetails.players.length !== 1 && 's'} in the lobby.
                            </div>

                            <div className="servers">
    
                                {[
                                    ...Array(2).keys().map(i => i + 1)
                                ].map(id => {
    
                                    let lobbyLookup = lobbyDetails?.fourFrogsGlobalState?.games?.find(lobby =>
                                        parseInt(lobby.server_id) == id
                                    )
    
                                    return (
                                        <div key={id} className="server">
    
                                            <div className='d-flex justify-content-between align-items-center w-100 mb-2'>
                                                <div className="mb-0" style={{ fontSize: '0.9rem' }}><b>Server {id}</b></div>
                                                <div className='mb-0'>{lobbyLookup?.players?.length || 0}/4</div>
                                            </div>
    
                                            <div className='d-flex justify-content-around w-100 mb-1'>
                                                {[1, 2, 3, 4].map(player_count => {
    
                                                    let playerLookup = false
    
                                                    if (lobbyLookup?.players?.length >= player_count) playerLookup = true
    
                                                    return (
                                                        <div key={player_count} className="icon" style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            ...(playerLookup ? {
                                                                backgroundColor: 'black',
                                                            } : {
                                                                backgroundColor: 'gray',
                                                            }),
                                                            border: '1px solid black'
                                                        }}>
    
                                                        </div>
                                                    )
                                                })}
                                            </div>
    
                                            <Link
                                                className={``}
                                                href={{
                                                    pathname: `/play`,
                                                    query: {
                                                        server: id
                                                    }
                                                }}
                                            >
                                                <ArticlesButton
                                                    className="px-5"
                                                    small
                                                >
                                                    Join
                                                </ArticlesButton>
                                            </Link>
    
                                        </div>
                                    )
                                })}
    
                            </div>

                        </div>

                        <div className="card-footer d-flex flex-wrap justify-content-center">

                            <GameMenuPrimaryButtonGroup 
                                useStore={useStore}
                                type="Landing"
                            />

                        </div>

                    </div>

                    <SessionButton
                        port={process.env.NEXT_PUBLIC_GAME_PORT}
                        friendsButton={true}
                    />

                    <ReturnToLauncherButton />

                </div>

                <GameScoreboard
                    game={process.env.NEXT_PUBLIC_GAME_NAME}
                    style="Default"
                    darkMode={darkMode ? true : false}
                    prepend={
                        <div
                            style={{
                                width: '100%',
                                height: '200px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <RotatingMascot />
                        </div>
                    }
                />

                <Ad
                    style="Default"
                    section={"Games"}
                    section_id={process.env.NEXT_PUBLIC_GAME_NAME}
                    darkMode={darkMode ? true : false}
                    user_ad_token={userToken}
                    userDetails={userDetails}
                    userDetailsLoading={userDetailsLoading}
                />

            </div>
        </div>
    );
}