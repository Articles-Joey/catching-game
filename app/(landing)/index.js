"use client"
import { useEffect, useContext, useState, useRef, Suspense } from 'react';

import Image from 'next/image'
import Link from 'next/link'

import { useLandingNavigation } from '@/hooks/useLandingNavigation';

import ArticlesButton from '@/components/UI/Button';

import { useSocketStore } from '@/hooks/useSocketStore';
import { useSearchParams } from 'next/navigation';

import useUserDetails from '@articles-media/articles-dev-box/useUserDetails';
import useUserToken from '@articles-media/articles-dev-box/useUserToken';
import NicknameInput from '@articles-media/articles-dev-box/NicknameInput';
import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';
import SessionButton from '@articles-media/articles-dev-box/SessionButton';
import { GamepadKeyboard, PieMenu } from '@articles-media/articles-gamepad-helper';
const ReturnToLauncherButton = dynamic(() =>
    import('@articles-media/articles-dev-box/ReturnToLauncherButton'),
    { ssr: false }
);
const GameScoreboard = dynamic(() =>
    import('@articles-media/articles-dev-box/GameScoreboard'),
    { ssr: false }
);
const Ad = dynamic(() =>
    import('@articles-media/articles-dev-box/Ad'),
    { ssr: false }
);

import PageTemplateLandingPage from '@articles-media/articles-dev-box/PageTemplateLandingPage';

// const backgroundImage = `img/preview.webp`;
const LandingBackgroundAnimation = dynamic(() =>
    import('@/components/Game/LandingBackgroundAnimation'),
    {
        ssr: false,
        // loading: () => <img
        //     src={backgroundImage.src}
        //     alt=""
        //     // fill
        //     style={{ objectFit: 'cover', objectPosition: 'center', filter: 'blur(10px)' }}
        // />
    }
);

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
        authenticated,
        loginSocket
    } = useSocketStore(state => ({
        socket: state.socket,
        authenticated: state.authenticated,
        loginSocket: state.loginSocket,
    }));

    const darkMode = useStore((state) => state.darkMode)
    const toontownMode = useStore((state) => state.toontownMode)
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
        <>

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

            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                // RotatingMascot={RotatingMascot}
                Link={Link}
                // logoImage={`/img/temp_logo.webp`}
                LandingBackgroundAnimation={
                    <LandingBackgroundAnimation />
                }
                heroOverride={<>
                    <img
                        src={
                            toontownMode ?
                                "img/temp_logo.webp"
                                :
                                "img/temp_logo.webp"
                        }
                        alt="Hero Image"
                        className='w-100'
                    />
                </>}
                NicknameInputConfig={{
                    // PreComponent:
                    //     <>
                    //         <img
                    //             className='panel-bg me-2'
                    //             src="img/toontown_icon.webp"
                    //             width={70}
                    //             height={70}
                    //         />
                    //     </>
                }}
                backgroundImage={
                    toontownMode ?
                        darkMode ?
                            `img/dark-preview.webp`
                            :
                            `img/preview.webp`
                        :
                        darkMode ?
                            `img/dark-preview.webp`
                            :
                            `img/preview.webp`
                }
                singlePlayerConfig={{
                    attachServerType: "single-player",
                }}
                multiplayerConfig={{
                    type: "WebSocket",
                    // comingSoon: true,
                    defaultServers: 2,
                    // privateServerSupport: false,
                    onlinePlayersTemplate: "2.0",
                }}
            />

        </>
    );
}