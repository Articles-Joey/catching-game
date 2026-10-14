"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import formatGameEndedAt from "@/util/formatGameEndedAt";

export default function ScoreList({ title, scores, emptyMessage = "No scores found." }) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography component="h3" variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                {title}
            </Typography>
            {scores.length > 0 ? (
                <Box component="ol" sx={{ m: 0, p: 0, listStyle: "none" }}>
                    {scores.map((entry, index) => (
                        <Box
                            component="li"
                            key={`${entry.endedAt ?? "legacy"}-${index}`}
                            sx={{ p: 1, borderBottom: 1, borderColor: "divider" }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                {entry.score} {entry.score === 1 ? "point" : "points"}
                            </Typography>
                            <Typography
                                component={entry.endedAt ? "time" : "span"}
                                dateTime={entry.endedAt ?? undefined}
                                variant="caption"
                                sx={{ display: "block", color: "text.secondary" }}
                            >
                                {formatGameEndedAt(entry.endedAt)}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            ) : <Box>{emptyMessage}</Box>}
        </Box>
    );
}
