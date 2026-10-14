"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import { useStore } from "@/hooks/useStore";
import DebugCard from "./DebugCard";
import GameDetailsPanel from "./GameDetailsPanel";
import MenuCard from "./MenuCard";

function LeftPanelContent() {
    const debug = useStore((state) => state.debug);
    const reloadScene = useStore((state) => state.reloadScene);

    return (
        <Box sx={{ width: "100%", fontSize: "0.875rem" }}>
            <MenuCard sx={{ p: 1 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    <GameMenuPrimaryButtonGroup useStore={useStore} type="GameMenu" useRouter={useRouter} />
                </Box>
            </MenuCard>
            <GameDetailsPanel debug={debug} />
            {debug && <DebugCard reloadScene={reloadScene} />}
        </Box>
    );
}

export default memo(LeftPanelContent);
