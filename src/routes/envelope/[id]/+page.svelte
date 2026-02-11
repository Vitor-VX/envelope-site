<script lang="ts">
    import {
        Sparkles,
        Image as ImageIcon,
        Play,
        Heart,
        X,
        Music,
    } from "lucide-svelte";
    import icon from "$lib/assets/ic_site.png";
    import { fade, scale, fly } from "svelte/transition";
    import { onMount, onDestroy, tick } from "svelte";
    import { page } from "$app/stores";
    import { get } from "svelte/store";

    let id: string;
    let formData: any = null;
    let isOpen = false;
    let isOpening = false;
    let isPlaying = false;
    let currentPhotoIndex = 0;
    let player: any;
    let timeInterval: any;
    let timeCounter = "";

    onMount(() => {
        id = get(page).params.id ?? "";
        getPage();
    });

    onDestroy(() => {
        if (timeInterval) clearInterval(timeInterval);
        if (player && player.destroy) player.destroy();
    });

    const getPage = async () => {
        try {
            const request = await fetch(
                `https://vxsoftware.space/api/v1/offers/envelope/slug/${id}`,
            );
            const response = await request.json();

            if (response.success) {
                const data = response.data;
                formData = {
                    title: data.title,
                    message: data.message,
                    sender: data.signature,
                    photos: data.photos ?? [],
                    showTimer: data.options?.showCounter ?? false,
                    startDate: data.options?.startDate
                        ? new Date(data.options.startDate)
                        : null,
                    hasMusic: data.options?.hasMusic ?? false,
                    musicUrl: data.options?.musicUrl ?? null,
                    musicName: data.options?.musicName ?? null,
                };

                if (formData.showTimer && formData.startDate) {
                    startTimer();
                }

                if (formData.hasMusic && formData.musicUrl) {
                    initYouTube();
                }
            }
        } catch (err) {
            console.error("Erro ao buscar envelope:", err);
        }
    };

    function startTimer() {
        const update = () => {
            const now = new Date().getTime();
            const start = formData.startDate.getTime();
            const diff = now - start;

            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
            const months = Math.floor(
                (diff % (1000 * 60 * 60 * 24 * 365.25)) /
                    (1000 * 60 * 60 * 24 * 30.44),
            );
            const days = Math.floor(
                (diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24),
            );
            const hours = Math.floor(
                (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            timeCounter = `${years} anos, ${months} meses, ${days} dias, ${hours} horas, ${minutes} min e ${seconds} seg`;
        };
        update();
        timeInterval = setInterval(update, 1000);
    }

    function initYouTubePlayer() {
        const videoId = getYoutubeId(formData.musicUrl);
        if (!videoId) return;

        player = new (window as any).YT.Player("youtube-player", {
            height: "0",
            width: "0",
            videoId: videoId,
            playerVars: { autoplay: 0, controls: 0 },
            events: {
                onStateChange: (e: any) => {
                    isPlaying =
                        e.data === (window as any).YT.PlayerState.PLAYING;
                },
            },
        });
    }

    function getYoutubeId(url: string) {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    }

    function toggleMusic() {
        if (!player) return;
        isPlaying ? player.pauseVideo() : player.playVideo();
    }

    function handleOpen() {
        isOpening = true;
        setTimeout(() => {
            isOpen = true;
            if (formData.hasMusic && player) player.playVideo();
        }, 1200);
    }

    async function initYouTube() {
        if (!formData?.hasMusic || !formData?.musicUrl) return;

        await tick();

        if (!(window as any).YT) {
            await loadScript();
        }

        createPlayer();
    }

    function loadScript() {
        return new Promise<void>((resolve) => {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);

            (window as any).onYouTubeIframeAPIReady = () => {
                resolve();
            };
        });
    }

    function createPlayer() {
        const videoId = getYoutubeId(formData.musicUrl);
        if (!videoId) return;

        player = new (window as any).YT.Player("youtube-player", {
            height: "0",
            width: "0",
            videoId,
            playerVars: { autoplay: 0, controls: 0 },
            events: {
                onStateChange: (e: any) => {
                    isPlaying =
                        e.data === (window as any).YT.PlayerState.PLAYING;
                },
            },
        });
    }

    $: validPhotos = formData?.photos?.filter((p: string) => !!p) ?? [];

    onMount(() => {
        const photoInterval = setInterval(() => {
            if (validPhotos.length > 1) {
                currentPhotoIndex =
                    (currentPhotoIndex + 1) % validPhotos.length;
            }
        }, 4000);

        if (!(window as any).YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
            (window as any).onYouTubeIframeAPIReady = initYouTubePlayer;
        } else {
            initYouTubePlayer();
        }

        return () => clearInterval(photoInterval);
    });
</script>

<svelte:head>
    <link rel="icon" href={icon} />
</svelte:head>

{#if formData}
    {#if formData.hasMusic}
        <div
            id="youtube-player"
            style="position: absolute; visibility: hidden;"
        ></div>
    {/if}

    <div class="floating-hearts">
        {#each Array(15) as _}
            <div
                class="heart-particle"
                style="left: {Math.random() *
                    100}%; animation-delay: {Math.random() * 10}s;"
            >
                <Heart
                    fill="#ffb5a7"
                    color="#ffb5a7"
                    size={12 + Math.random() * 20}
                />
            </div>
        {/each}
    </div>

    <main class="letter-viewer">
        {#if !isOpen}
            <div
                class="envelope-container"
                class:opening={isOpening}
                on:click={handleOpen}
                out:fade
            >
                <div class="envelope">
                    <div class="flap"></div>
                    <div class="pocket"></div>
                    <div class="letter-inside">
                        <div class="letter-text">
                            <Heart size={24} fill="#db2777" color="#db2777" />
                            <p>Uma mensagem especial...</p>
                        </div>
                    </div>
                    <div class="seal">
                        <Heart fill="#db2777" color="#db2777" size={40} />
                    </div>
                    <div class="envelope-label">
                        <p>Para: {formData.title}</p>
                    </div>
                </div>
                {#if !isOpening}
                    <div class="click-hint" in:fade>
                        <Sparkles size={16} /> Toque para abrir
                    </div>
                {/if}
            </div>
        {:else}
            <div class="notebook-section" in:fly={{ y: 50, duration: 1000 }}>
                <div class="notebook-case">
                    <div class="notebook-page">
                        <div class="page-lines"></div>
                        <div class="page-margin-red"></div>
                        <div class="page-spiral">
                            {#each Array(14) as _}<div
                                    class="spiral-hole"
                                ></div>{/each}
                        </div>

                        <div class="notebook-content">
                            <h1 class="notebook-title">{formData.title}</h1>

                            <div class="photo-area">
                                <div class="tape tape-tl"></div>
                                <div class="photo-frame">
                                    {#if validPhotos.length > 0}
                                        {#each [validPhotos[currentPhotoIndex]] as src (currentPhotoIndex)}
                                            <img
                                                {src}
                                                alt="Foto"
                                                in:fade={{ duration: 600 }}
                                            />
                                        {/each}
                                        {#if validPhotos.length > 1}
                                            <div class="carousel-indicators">
                                                {#each validPhotos as _, i}
                                                    <div
                                                        class="dot"
                                                        class:active={i ===
                                                            currentPhotoIndex}
                                                    ></div>
                                                {/each}
                                            </div>
                                        {/if}
                                    {:else}
                                        <div class="photo-placeholder">
                                            <ImageIcon size={40} />
                                        </div>
                                    {/if}
                                </div>
                                <div class="tape tape-br"></div>
                            </div>

                            <p class="notebook-message">{formData.message}</p>

                            {#if formData.showTimer}
                                <div class="timer-box">
                                    <span class="timer-label">Juntos há:</span>
                                    <div class="timer-text">{timeCounter}</div>
                                </div>
                            {/if}

                            <div class="signature">
                                <span>Assinado:</span>
                                <span class="signature-name"
                                    >{formData.sender}</span
                                >
                            </div>

                            {#if formData.hasMusic}
                                <div
                                    class="instagram-player"
                                    on:click={toggleMusic}
                                >
                                    <div class="player-left">
                                        <div class="album-art">
                                            <img
                                                src="https://files.botsync.site/modelos-certificados/modelo_padrao.jpeg"
                                                alt="Capa"
                                            />
                                            <div class="player-icon-overlay">
                                                {#if isPlaying}
                                                    <div class="sound-bars">
                                                        <span></span><span
                                                        ></span><span></span>
                                                    </div>
                                                {:else}
                                                    <Play
                                                        size={14}
                                                        fill="white"
                                                        color="white"
                                                    />
                                                {/if}
                                            </div>
                                        </div>
                                        <div class="song-info">
                                            <div class="song-name">
                                                {formData.musicName}
                                            </div>
                                            <div class="song-meta">
                                                {formData.sender} • Love Mix
                                            </div>
                                        </div>
                                    </div>
                                    <div class="player-right">
                                        <Music size={18} />
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
                <button
                    class="btn-close"
                    on:click={() => {
                        isOpen = false;
                        isOpening = false;
                        player?.pauseVideo();
                    }}
                >
                    <X size={18} /> Fechar
                </button>
            </div>
        {/if}
    </main>
{/if}

<style>
    @import url("https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;600&display=swap");

    :global(html, body) {
        margin: 0;
        padding: 0;
        width: 100%;
        min-height: 100%;
        background: #fffafa;
        overflow-x: hidden;
    }

    .floating-hearts {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
    }

    .heart-particle {
        position: absolute;
        bottom: -50px;
        opacity: 0;
        animation: floatUp 12s linear infinite;
    }

    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        20% {
            opacity: 0.4;
        }
        80% {
            opacity: 0.4;
        }
        100% {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
        }
    }

    .letter-viewer {
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 15px;
        box-sizing: border-box;
        position: relative;
        z-index: 1;
    }

    .envelope-container {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        width: 100%;
        max-width: 320px;
    }

    .envelope {
        width: 100%;
        height: 200px;
        background: #ffffff;
        position: relative;
        box-shadow: 0 20px 50px rgba(219, 39, 119, 0.2);
        border-radius: 0 0 12px 12px;
    }

    .flap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fbcfe8;
        clip-path: polygon(0 0, 100% 0, 50% 50%);
        transition: transform 0.6s ease;
        transform-origin: top;
        z-index: 10;
    }

    .opening .flap {
        transform: rotateX(180deg);
        z-index: 1;
    }

    .pocket {
        position: absolute;
        inset: 0;
        background: #ffffff;
        clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
        z-index: 5;
        border-radius: 0 0 12px 12px;
        border: 1px solid #fce7f3;
    }

    .letter-inside {
        position: absolute;
        bottom: 10px;
        left: 5%;
        width: 90%;
        height: 85%;
        background: white;
        z-index: 2;
        transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
    }

    .opening .letter-inside {
        transform: translateY(-100px);
    }

    .letter-text {
        font-family: "Great Vibes", cursive;
        color: #db2777;
        text-align: center;
        font-size: 1.1rem;
    }

    .seal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 11;
        transition: opacity 0.3s;
    }

    .opening .seal {
        opacity: 0;
    }

    .envelope-label {
        position: absolute;
        bottom: 20px;
        width: 100%;
        text-align: center;
        z-index: 6;
        color: #db2777;
        font-weight: 600;
        font-size: 0.8rem;
    }

    .click-hint {
        color: #db2777;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        animation: pulse 2s infinite;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .notebook-section {
        width: 100%;
        max-width: 450px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .notebook-case {
        background: #3d0514;
        padding: 8px;
        border-radius: 16px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        width: 100%;
        box-sizing: border-box;
    }

    .notebook-page {
        background: white;
        min-height: 500px;
        position: relative;
        padding: 3rem 1rem 2rem 3.2rem;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .page-lines {
        position: absolute;
        inset: 0;
        background-image: repeating-linear-gradient(
            transparent,
            transparent 30px,
            #f0f3f7 30px,
            #f0f3f7 31px
        );
        z-index: 1;
    }
    .page-margin-red {
        position: absolute;
        left: 45px;
        top: 0;
        bottom: 0;
        width: 1px;
        background: #ffc4c4;
        z-index: 2;
    }
    .page-spiral {
        position: absolute;
        left: 8px;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        z-index: 10;
    }
    .spiral-hole {
        width: 9px;
        height: 9px;
        background: #1a0208;
        border-radius: 50%;
    }

    .notebook-content {
        position: relative;
        z-index: 5;
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .notebook-title {
        font-family: "Great Vibes", cursive;
        font-size: 2.2rem;
        color: #1a0208;
        margin-bottom: 1rem;
        line-height: 1.2;
    }

    .photo-area {
        position: relative;
        width: 100%;
        max-width: 260px;
        margin: 1rem auto 2rem;
    }
    .photo-frame {
        background: white;
        padding: 5px;
        border: 1px solid #f0f0f0;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    .photo-frame img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        display: block;
    }

    .carousel-indicators {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 5px;
    }
    .dot {
        width: 5px;
        height: 5px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transition: 0.3s;
    }
    .dot.active {
        background: white;
        transform: scale(1.3);
    }

    .tape {
        position: absolute;
        width: 60px;
        height: 22px;
        background: rgba(210, 207, 182, 0.4);
        z-index: 6;
    }
    .tape-tl {
        top: -8px;
        left: -15px;
        transform: rotate(-30deg);
    }
    .tape-br {
        bottom: -8px;
        right: -15px;
        transform: rotate(-35deg);
    }

    .notebook-message {
        font-family: "Great Vibes", cursive;
        font-size: 1.4rem;
        color: #2d0a14;
        line-height: 31px;
        margin-bottom: 1.5rem;
        word-wrap: break-word;
    }

    .timer-box {
        background: #fff1f4;
        border-radius: 12px;
        padding: 12px;
        text-align: center;
        border: 1px solid #fce7f3;
        margin-bottom: 1.5rem;
    }
    .timer-label {
        font-family: "Great Vibes", cursive;
        font-size: 1.6rem;
        color: #db2777;
        display: block;
        margin-bottom: 5px;
    }
    .timer-text {
        font-size: 0.75rem;
        font-weight: 600;
        color: #4a0e0e;
        line-height: 1.4;
    }

    .signature {
        margin-top: auto;
        text-align: right;
        font-family: "Great Vibes", cursive;
        font-size: 1.3rem;
        color: #888;
    }
    .signature-name {
        color: #1a0208;
        font-size: 1.8rem;
        margin-left: 5px;
    }

    .instagram-player {
        background: #121212;
        border-radius: 10px;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 15px;
        cursor: pointer;
    }
    .player-left {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .album-art {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
        flex-shrink: 0;
    }
    .album-art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .player-icon-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .sound-bars {
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 10px;
    }
    .sound-bars span {
        width: 2px;
        background: white;
        animation: barAnim 0.8s ease-in-out infinite;
    }
    .sound-bars span:nth-child(2) {
        animation-delay: 0.2s;
    }
    .sound-bars span:nth-child(3) {
        animation-delay: 0.4s;
    }
    @keyframes barAnim {
        0%,
        100% {
            height: 3px;
        }
        50% {
            height: 10px;
        }
    }
    .song-info {
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .song-name {
        color: white;
        font-size: 0.8rem;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .song-meta {
        color: #b3b3b3;
        font-size: 0.65rem;
    }
    .player-right {
        color: white;
        opacity: 0.8;
        flex-shrink: 0;
    }

    .btn-close {
        background: #db2777;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 50px;
        font-weight: 700;
        cursor: pointer;
        margin-top: 10px;
        box-shadow: 0 8px 15px rgba(219, 39, 119, 0.2);
        font-size: 0.9rem;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }

    @media (max-width: 400px) {
        .notebook-title {
            font-size: 1.8rem;
        }
        .notebook-message {
            font-size: 1.3rem;
        }
        .notebook-page {
            padding-left: 2.8rem;
        }
        .page-margin-red {
            left: 38px;
        }
        .page-spiral {
            left: 6px;
        }
        .envelope {
            height: 180px;
        }
    }
</style>
