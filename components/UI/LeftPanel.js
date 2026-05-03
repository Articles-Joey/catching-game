import { memo } from "react";

import Link from "next/link";

// import ROUTES from '@/components/constants/routes';

import ArticlesButton from "@/components/UI/Button";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useGameStore } from "@/hooks/useGameStore";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useStore } from "@/hooks/useStore";
import DebugCard from "./DebugCard";
import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import GameDetailsPanel from "./GameDetailsPanel";

import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';

function LeftPanelContent(props) {

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    const reloadScene = useStore((state) => state.reloadScene)

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body d-flex flex-wrap">

                    <GameMenuPrimaryButtonGroup 
                        useStore={useStore}
                        type="GameMenu"
                    />

                </div>

            </div>

            <GameDetailsPanel />

            {/* Debug Controls */}
            <DebugCard
                reloadScene={reloadScene}
            />

        </div>
    )

}

export default memo(LeftPanelContent)