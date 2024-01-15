import { NextPage } from "next"

interface VideoPlayerProps {
    selectedServer: string | undefined,
    handleVideoLoaded: () => void;
}

const VideoPlayer: NextPage<VideoPlayerProps> = ({selectedServer, handleVideoLoaded }) => {
    return (
        <>
            <iframe
                referrerPolicy="no-referrer"
                width="100%"
                height="100%"
                style={{ aspectRatio: '7/5', backgroundColor: 'black', border: "0" }}
                src={selectedServer}
                allowFullScreen
                title="Watch now"
                onLoad={handleVideoLoaded}
                // sandbox="allow-orientation-lock allow-modals allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
                allow="encrypted-media; gyroscope; picture-in-picture; fullscreen"
            >Sorry 😭 !</iframe>
        </>
    )
}

export default VideoPlayer