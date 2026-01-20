"use client";
import { useGameStore } from '@/hooks/useGameStore';
import { useStore } from '@/hooks/useStore';
import dynamic from 'next/dynamic'

const InfoModal = dynamic(
    () => import('@/components/UI/InfoModal'),
    { ssr: false }
)

const SettingsModal = dynamic(
    () => import('@/components/UI/SettingsModal'),
    { ssr: false }
)

const CreditsModal = dynamic(
    () => import('@/components/UI/CreditsModal'),
    { ssr: false }
)

const FriendsList = dynamic(
    () => import('@articles-media/articles-dev-box/FriendsList'),
    { ssr: false }
)

import useUserDetails from '@articles-media/articles-dev-box/useUserDetails';
import useUserToken from '@articles-media/articles-dev-box/useUserToken';

export default function GlobalClientModals() {

    const showInfoModal = useGameStore((state) => state.showInfoModal)
    const setShowInfoModal = useGameStore((state) => state.setShowInfoModal)

    const showSettingsModal = useGameStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useGameStore((state) => state.setShowSettingsModal)

    const showCreditsModal = useGameStore((state) => state.showCreditsModal)
    const setShowCreditsModal = useGameStore((state) => state.setShowCreditsModal)

    const friendsModal = useStore((state) => state.friendsModal)
    const setFriendsModal = useStore((state) => state.setFriendsModal)

    const {
        data: userToken,
        error: userTokenError,
        isLoading: userTokenLoading,
        mutate: userTokenMutate
    } = useUserToken(
        "3030"
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
            {showInfoModal &&
                <InfoModal
                    show={showInfoModal}
                    setShow={setShowInfoModal}
                />
            }

            {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                />
            }

            {showCreditsModal &&
                <CreditsModal
                    show={showCreditsModal}
                    setShow={setShowCreditsModal}
                />
            }

            {friendsModal &&
                <FriendsList
                    componentType="modal"
                    show={friendsModal}
                    setShow={setFriendsModal}
                    user_id={
                        userDetails ? userDetails.user_id : null
                    }
                    user_token={
                        userToken ? userToken : null
                    }
                    // className="123"
                    // style={{
                    //     backgroundColor: 'pink'
                    // }}
                    // id="456"
                />
            }
        </>
    )
}