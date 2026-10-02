"use client";

import DevBoxDarkModeHandler from "@articles-media/articles-dev-box/DarkModeHandler";
import { useStore } from "@/hooks/useStore";

export default function DarkModeHandler() {
    return <DevBoxDarkModeHandler useStore={useStore} />;
}
