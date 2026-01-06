"use client"
import { useEffect, useContext, useState, useRef } from 'react';

import Image from 'next/image'
import Link from 'next/link'

import { useLandingNavigation } from '@/hooks/useLandingNavigation';

// import { useSelector, useDispatch } from 'react-redux'

// import ROUTES from 'components/constants/routes'

import ArticlesButton from '@/components/UI/Button';
// import SingleInput from '@/components/Articles/SingleInput';
import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
// import IsDev from '@/components/IsDev';
// import { ChromePicker } from 'react-color';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '@/hooks/useGameStore';

// import GameScoreboard from 'components/Games/GameScoreboard'

// const Ad = dynamic(() => import('components/Ads/Ad'), {
//     ssr: false,
// });



// const PrivateGameModal = dynamic(
//     () => import('app/(site)/community/games/four-frogs/components/PrivateGameModal'),
//     { ssr: false }
// )

const assets_src = 'games/Cannon/'

const game_key = 'catching-game'
const game_name = 'Catching Game'

// import helloWorld from 'articles-dev-box';

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

    // const userReduxState = useSelector((state) => state.auth.user_details)
    const userReduxState = false

    const [nickname, setNickname] = useLocalStorageNew("game:nickname", userReduxState.display_name)

    // const [showInfoModal, setShowInfoModal] = useState(false)
    // const [showSettingsModal, setShowSettingsModal] = useState(false)
    // const [showPrivateGameModal, setShowPrivateGameModal] = useState(false)

    const setShowInfoModal = useGameStore((state) => state.setShowInfoModal)
    const setShowSettingsModal = useGameStore((state) => state.setShowSettingsModal)
    const setShowCreditsModal = useGameStore((state) => state.setShowCreditsModal)

    const [lobbyDetails, setLobbyDetails] = useState({
        players: [],
        games: [],
    })

    const elementsRef = useRef([]);
    useLandingNavigation(elementsRef);

    useEffect(() => {

        setShowInfoModal(localStorage.getItem('game:four-frogs:rulesAnControls') === 'true' ? true : false)

        // if (userReduxState._id) {
        //     console.log("Is user")
        // }

        socket.on('game:death-race-landing-details', function (msg) {
            console.log('game:death-race-landing-details', msg)

            if (JSON.stringify(msg) !== JSON.stringify(lobbyDetails)) {
                setLobbyDetails(msg)
            }
        });

        return () => {
            socket.off('game:death-race-landing-details');
        };

    }, [])

    useEffect(() => {

        if (socket.connected) {
            socket.emit('join-room', 'game:death-race-landing');
        }

        return function cleanup() {
            socket.emit('leave-room', 'game:death-race-landing')
        };

    }, [socket.connected]);

    useEffect(() => {

        // console.log(
        //     helloWorld()
        // );

    }, [])

    return (

        <div className="catching-game-landing-page">



            {/* {showPrivateGameModal &&
                <PrivateGameModal
                    show={showPrivateGameModal}
                    setShow={setShowPrivateGameModal}
                />
            } */}

            <div className='background-wrap'>
                <Image
                    src={`${process.env.NEXT_PUBLIC_CDN}games/Catching Game/catching-game-toontown-thumbnail.webp`}
                    alt=""
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center', filter: 'blur(10px)' }}
                />
            </div>

            <div className="container d-flex flex-column-reverse flex-lg-row justify-content-center align-items-center">

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

                        {/* <div style={{ position: 'relative', height: '200px' }}>
                            <Image
                                src={Logo}
                                alt=""
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div> */}

                        <div className='card-header d-flex align-items-center'>

                            <div className="flex-grow-1">

                                <div className="form-group articles mb-0">
                                    <label htmlFor="nickname">Nickname</label>
                                    {/* <SingleInput
                                        value={nickname}
                                        setValue={setNickname}
                                        noMargin
                                    /> */}
                                    <input
                                        ref={el => elementsRef.current[0] = el}
                                        type="text"
                                        className="form-control"
                                        id="nickname"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        placeholder="Enter your nickname"
                                    />
                                </div>

                                <div className='mt-1' style={{ fontSize: '0.8rem' }}>Visible to all players</div>

                            </div>
                        </div>

                        <div className="card-body">

                            <div
                            //  className='mb-3'
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

                            {/* <div className="fw-bold mb-1 small text-center">
                                {lobbyDetails.players.length || 0} player{lobbyDetails.players.length > 1 && 's'} in the lobby.
                            </div> */}

                            {/* <div className="servers">
    
                                {[1, 2, 3, 4].map(id => {
    
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
    
                            </div> */}

                        </div>

                        <div className="card-footer d-flex flex-wrap justify-content-center">

                            <ArticlesButton
                                ref={el => elementsRef.current[2] = el}
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowSettingsModal(true)
                                }}
                            >
                                <i className="fad fa-cog"></i>
                                Settings
                            </ArticlesButton>

                            <ArticlesButton
                                ref={el => elementsRef.current[3] = el}
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowInfoModal(true)
                                }}
                            >
                                <i className="fad fa-info-square"></i>
                                Rules & Controls
                            </ArticlesButton>

                            <Link href={'https://github.com/Articles-Joey/catching-game'} target='_blank' rel='noopener noreferrer' className='w-50'>
                                <ArticlesButton
                                    ref={el => elementsRef.current[4] = el}
                                    className={`w-100`}
                                    small
                                    onClick={() => {
                                        
                                    }}
                                >
                                    <i className="fab fa-github"></i>
                                    Github
                                </ArticlesButton>
                            </Link>

                            <ArticlesButton
                                ref={el => elementsRef.current[5] = el}
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowCreditsModal(true)
                                }}
                            >
                                <i className="fad fa-users"></i>
                                Credits
                            </ArticlesButton>

                        </div>

                    </div>

                    {launcher_mode &&
                        <ArticlesButton
                            ref={el => elementsRef.current[6] = el}
                            className={`w-100`}
                            small
                            style={{
                                zIndex: 10,
                                position: "relative",
                            }}
                            onClick={() => {
                                window.history.back()
                            }}
                        >
                            <i className="fad fa-gamepad"></i>
                            Return to Games
                        </ArticlesButton>
                    }
                </div>

                {/* <GameScoreboard game="Death Race" /> */}

                {/* <Ad section={"Games"} section_id={game_name} /> */}

            </div>
        </div>
    );
}