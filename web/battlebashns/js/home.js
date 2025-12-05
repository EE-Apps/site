let gameType = 'singleplayer';
import TurboCloudClient from "../eelibs/js/websocket.js";

try { document.getElementById('btnSinglePlayer').onclick = () => {
    gameType = 'singleplayer';
    window.pages.switch('singleplayerPage');
};
} catch(e) { /* игнорируем, если кнопки нет на странице */ }

document.getElementById('btnConnectPeer').onclick = () => {
    gameType = 'multiplayer';
    window.pages.switch('connectPage');
};

document.getElementById('btnMultiplayer').onclick = () => {
    gameType = 'multiplayer';

    const cloud = new TurboCloudClient({
        projectId: "battlebashns",
        username: `guest${Math.floor(Math.random() * 100)}`,
    });

    cloud.connect().then(() => {
        console.log('[Home] Cloud connected, now rendering rooms');
        window.cloud = cloud;
        renderRooms(cloud);
    }).catch(err => {
        console.error('[Home] Failed to connect to cloud:', err);
    });

    window.pages.switch('lobbyPage');
}

document.querySelectorAll('.btnBackHome').forEach(btn => {
    btn.onclick = () => {
        window.pages.switch('homePage');
    };
});