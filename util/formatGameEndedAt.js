export default function formatGameEndedAt(endedAt) {
    if (!endedAt || !Number.isFinite(Date.parse(endedAt))) return "Date unavailable";

    return new Date(endedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "medium",
    });
}
