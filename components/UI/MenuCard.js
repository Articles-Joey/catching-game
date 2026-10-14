import Box from "@mui/material/Box";

export default function MenuCard({ sx = [], ...props }) {
    return (
        <Box
            {...props}
            sx={[
                {
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    overflowWrap: "break-word",
                    bgcolor: "transparent",
                    color: "inherit",
                    border: 1,
                    borderColor: "var(--game-menu-divider-color, rgba(1, 80, 2, 0.2))",
                    borderRadius: 0,
                    fontSize: "0.875rem",
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        />
    );
}
