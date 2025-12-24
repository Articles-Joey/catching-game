"use client";
import { useGameStore } from '@/hooks/useGameStore';
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

export default function GlobalClientModals() {

    const showInfoModal = useGameStore((state) => state.showInfoModal)
    const setShowInfoModal = useGameStore((state) => state.setShowInfoModal)

    const showSettingsModal = useGameStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useGameStore((state) => state.setShowSettingsModal)

    const showCreditsModal = useGameStore((state) => state.showCreditsModal)
    const setShowCreditsModal = useGameStore((state) => state.setShowCreditsModal)

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
        </>
    )
}