

export const shareScheme = (title) => {
    const shareText = `Check out this scheme: ${title}\n\nLearn more here: ${window.location.href}`;
    // mutile chize direct share nhi kar sakte that why share text
    if (navigator.share) {
        navigator.share({
            text: shareText,
        })
            .then(() => console.log("Shared successfully"))
            .catch((error) => console.log("Sharing failed", error));
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert("Scheme URL copied to clipboard!");
        }).catch((error) => {
            console.error("Failed to copy URL: ", error);
            alert("Failed to copy URL to clipboard.");
        });
    }
};