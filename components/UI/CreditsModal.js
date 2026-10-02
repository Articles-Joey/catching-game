"use client";

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";
import WebIcon from "@mui/icons-material/Web";
import ArticlesModal from "./ArticlesModal";
import ArticlesButton from "./Button";
import { useModalNavigation } from "@/hooks/useModalNavigation";
import B from "@articles-media/articles-gamepad-helper/dist/img/Xbox UI/B.svg";

export default function CreditsModal({ show = true, setShow }) {
    const [showModal, setShowModal] = useState(true);
    const elementsRef = useRef([]);
    useModalNavigation(elementsRef, () => setShowModal(false));

    return (
        <ArticlesModal
            title="Game Credits"
            show={show && showModal}
            setShow={(visible) => {
                setShow(visible);
                setShowModal(true);
            }}
            footerOverride={(setOpen) => (
                <>
                    <Box />
                    <ArticlesButton
                        ref={(el) => { elementsRef.current[3] = el; }}
                        variant="outline-dark"
                        onClick={() => setOpen(false)}
                        startIcon={<Box component="img" src={B.src} alt="" sx={{ width: 24 }} />}
                    >
                        Close
                    </ArticlesButton>
                </>
            )}
        >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", py: 1 }}>
                <Typography component="h6" variant="subtitle1" sx={{ mb: 1 }}>Developer: Articles Joey</Typography>
                <ArticlesButton
                    href="https://github.com/articles-joey/catching-game"
                    target="_blank"
                    rel="noopener noreferrer"
                    ref={(el) => { elementsRef.current[0] = el; }}
                    startIcon={<GitHubIcon />}
                    sx={{ mb: 3 }}
                >
                    View on GitHub
                </ArticlesButton>
                <Typography component="h6" variant="subtitle1" sx={{ mb: 1 }}>Publisher: Articles Media</Typography>
                <ArticlesButton
                    href="https://github.com/Articles-Media"
                    target="_blank"
                    rel="noopener noreferrer"
                    ref={(el) => { elementsRef.current[1] = el; }}
                    startIcon={<WebIcon />}
                    sx={{ mb: 3 }}
                >
                    View Website
                </ArticlesButton>
                <Typography component="h6" variant="subtitle1" sx={{ mb: 1 }}>Attributions</Typography>
                <ArticlesButton
                    href="https://github.com/Articles-Joey/catching-game/blob/main/README.md#attributions"
                    target="_blank"
                    rel="noopener noreferrer"
                    ref={(el) => { elementsRef.current[2] = el; }}
                    startIcon={<GitHubIcon />}
                >
                    View on GitHub
                </ArticlesButton>
            </Box>
        </ArticlesModal>
    );
}
