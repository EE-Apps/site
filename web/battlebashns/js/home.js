let gameType = 'singleplayer';
import TurboCloudClient from "../eelibs/js/websocket.js";

document.getElementById('btnSinglePlayer').onclick = () => {
    gameType = 'singleplayer';
    window.pages.switch('connectPage');
};

document.getElementById('btnMultiplayer').onclick = () => {
    gameType = 'multiplayer';

    const cloud = new TurboCloudClient({
        projectId: "battlebashns",
        username: `guest${Math.floor(Math.random() * 100)}`,
    });

    cloud.connect();
    window.cloud = cloud;

    renderRooms(cloud);

    window.pages.switch('lobbyPage');
}