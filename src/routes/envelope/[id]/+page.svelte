<script lang="ts">
    import {
        Sparkles,
        Image as ImageIcon,
        Play,
        Pause,
        Heart,
        X,
        Music,
    } from "lucide-svelte";
    import { fade, scale, fly } from "svelte/transition";
    import { onMount } from "svelte";

    let formData = {
        title: "Para o Amor da Minha Vida",
        photos: [
            "https://imgs.search.brave.com/SEykVtWoeUj3u7z2sCFGflLi3g37umbQCkHOVN3Tg3k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3RpL2ZvdG9z/LWdyYXRpcy90Mi81/OTM0MDc4Ny1mZWxp/ei1jYXNhbC1yZWxh/eGFudGUtanVudG9z/LWVtLXVtYS1zb2Zh/LWRlbnRyby11bWEt/YWNvbGhlZG9yLWlu/dGVyaW9yLWNvbmZp/Z3VyYWNhby1kZW50/cm8tY2Fsb3Jvc28t/c3VhdmUtYmx1c2Fz/LWZvdG8uanBn",
            null,
            null,
        ],
        message:
            "Cada momento ao seu lado é um presente precioso que guardo no coração. Você é minha inspiração, minha alegria e meu maior amor. Obrigado por tornar minha vida mais bonita e cheia de significado.",
        showTimer: true,
        timeCounter:
            "3 anos, 1 meses, 8 dias, 17 horas, 44 minutos e 59 segundos",
        sender: "João",
        hasMusic: true,
        musicName: "Nossa Música Especial",
        artistName: "Jorge & Mateus",
        musicUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    };

    let isOpen = false;
    let isOpening = false;
    let isPlaying = false;
    let currentPhotoIndex = 0;
    let player: any;

    $: validPhotos = formData.photos.filter((p) => p !== null);

    function getYoutubeId(url: string) {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    }

    function initYouTubePlayer() {
        if ((window as any).YT && (window as any).YT.Player) {
            player = new (window as any).YT.Player("youtube-player", {
                height: "0",
                width: "0",
                videoId: getYoutubeId(formData.musicUrl),
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    rel: 0,
                    modestbranding: 1,
                },
                events: {
                    onStateChange: (event: any) => {
                        isPlaying =
                            event.data ===
                            (window as any).YT.PlayerState.PLAYING;
                    },
                },
            });
        }
    }

    onMount(() => {
        const interval = setInterval(() => {
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

        return () => {
            clearInterval(interval);
            if (player && player.destroy) player.destroy();
        };
    });

    function toggleMusic() {
        if (!player || typeof player.getPlayerState !== "function") return;
        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }

    function handleOpen() {
        isOpening = true;
        setTimeout(() => {
            isOpen = true;
            if (
                formData.hasMusic &&
                player &&
                typeof player.playVideo === "function"
            ) {
                player.playVideo();
            }
        }, 1200);
    }
</script>

<!-- ELEMENTO DE ÁUDIO OCULTO -->
{#if formData.hasMusic}
    <!-- <audio bind:this={audio} src={formData.audioSrc} loop></audio> -->
    <div
        id="youtube-player"
        style="position: absolute; width: 0; height: 0; pointer-events: none;"
    ></div>
{/if}

<!-- FUNDO ANIMADO -->
<div class="floating-hearts">
    {#each Array(20) as _, i}
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
        <!-- ENVELOPE CENTRALIZADO -->
        <div
            class="envelope-container"
            class:opening={isOpening}
            on:click={handleOpen}
        >
            <div class="envelope">
                <div class="flap"></div>
                <div class="pocket"></div>

                <div class="letter-inside">
                    <div class="letter-text">
                        <Heart size={24} fill="#db2777" color="#db2777" />
                        <p>Para o meu grande amor...</p>
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
        <!-- CADERNO RESPONSIVO -->
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
                                <div class="timer-text">
                                    {formData.timeCounter}
                                </div>
                            </div>
                        {/if}

                        <div class="signature">
                            <span>Assinado:</span>
                            <span class="signature-name">{formData.sender}</span
                            >
                        </div>

                        <!-- PLAYER ESTILO INSTAGRAM -->
                        {#if formData.hasMusic}
                            <div
                                class="instagram-player"
                                on:click={toggleMusic}
                            >
                                <div class="player-left">
                                    <div
                                        class="album-art"
                                        class:rotating={isPlaying}
                                    >
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
                                                <Play size={14} fill="white" />
                                            {/if}
                                        </div>
                                    </div>
                                    <div class="song-info">
                                        <div class="song-name">
                                            {formData.musicName}
                                        </div>
                                        <div class="song-meta">
                                            {formData.artistName} • 3:00
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
                    isPlaying = false;
                    audio?.pause();
                }}
            >
                <X size={18} /> Fechar Presente
            </button>
        </div>
    {/if}
</main>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;600&display=swap");

    :global(html, body) {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #fffafa;
    }

    /* FUNDO */
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
        padding: 20px;
        box-sizing: border-box;
        position: relative;
        z-index: 1;
    }

    /* ENVELOPE */
    .envelope-container {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 25px;
        max-width: 90vw;
    }

    .envelope {
        width: 320px;
        max-width: 85vw;
        height: 220px;
        background: #ffffff;
        position: relative;
        box-shadow: 0 20px 50px rgba(219, 39, 119, 0.2);
        border-radius: 0 0 12px 12px;
    }

    .flap {
        position: absolute;
        top: 0;
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
        transform: translateY(-120px);
    }

    .letter-text {
        font-family: "Great Vibes", cursive;
        color: #db2777;
        text-align: center;
        padding: 15px;
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
        bottom: 25px;
        width: 100%;
        text-align: center;
        z-index: 6;
        color: #db2777;
        font-weight: 600;
        font-size: 0.85rem;
    }

    .click-hint {
        color: #db2777;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        animation: pulse 2s infinite;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    /* CADERNO */
    .notebook-section {
        width: 100%;
        max-width: 480px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
    }

    .notebook-case {
        background: #3d0514;
        padding: 10px;
        border-radius: 20px;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
        width: 100%;
        box-sizing: border-box;
    }

    .notebook-page {
        background: white;
        min-height: 80vh;
        position: relative;
        padding: 4rem 1.5rem 3rem 4rem;
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
        left: 55px;
        top: 0;
        bottom: 0;
        width: 1px;
        background: #ffc4c4;
        z-index: 2;
    }
    .page-spiral {
        position: absolute;
        left: 10px;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        z-index: 10;
    }
    .spiral-hole {
        width: 10px;
        height: 10px;
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
        font-size: clamp(2rem, 8vw, 2.8rem);
        color: #1a0208;
        margin-bottom: 1.5rem;
    }

    .photo-area {
        position: relative;
        width: 100%;
        max-width: 300px;
        margin: 1rem auto 2.5rem;
    }
    .photo-frame {
        background: white;
        padding: 6px;
        border: 1px solid #f0f0f0;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    .photo-frame img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        display: block;
    }

    .carousel-indicators {
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
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
        transform: scale(1.4);
    }

    .tape {
        position: absolute;
        width: 70px;
        height: 25px;
        background: rgba(210, 207, 182, 0.4);
        z-index: 6;
    }
    .tape-tl {
        top: -10px;
        left: -20px;
        transform: rotate(-30deg);
    }
    .tape-br {
        bottom: -10px;
        right: -20px;
        transform: rotate(-35deg);
    }

    .notebook-message {
        font-family: "Great Vibes", cursive;
        font-size: 1.6rem;
        color: #2d0a14;
        line-height: 31px;
        margin-bottom: 2rem;
    }

    .timer-box {
        background: #fff1f4;
        border-radius: 15px;
        padding: 15px;
        text-align: center;
        border: 1px solid #fce7f3;
        margin-bottom: 2rem;
    }
    .timer-label {
        font-family: "Great Vibes", cursive;
        font-size: 1.8rem;
        color: #db2777;
        display: block;
    }
    .timer-text {
        font-size: 0.8rem;
        font-weight: 600;
        color: #4a0e0e;
    }

    .signature {
        margin-top: auto;
        text-align: right;
        font-family: "Great Vibes", cursive;
        font-size: 1.4rem;
        color: #888;
    }
    .signature-name {
        color: #1a0208;
        font-size: 2rem;
        margin-left: 8px;
    }

    /* PLAYER INSTAGRAM */
    .instagram-player {
        background: #121212;
        border-radius: 12px;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 25px;
        cursor: pointer;
        user-select: none;
    }

    .player-left {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .album-art {
        width: 44px;
        height: 44px;
        border-radius: 6px;
        overflow: hidden;
        position: relative;
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
        height: 12px;
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
            height: 4px;
        }
        50% {
            height: 12px;
        }
    }

    .song-info {
        display: flex;
        flex-direction: column;
    }
    .song-name {
        color: white;
        font-size: 0.85rem;
        font-weight: 700;
    }
    .song-meta {
        color: #b3b3b3;
        font-size: 0.7rem;
    }
    .player-right {
        color: white;
        opacity: 0.8;
    }

    .btn-close {
        background: #db2777;
        color: white;
        border: none;
        padding: 14px 40px;
        border-radius: 50px;
        font-weight: 700;
        cursor: pointer;
        margin-top: 10px;
        box-shadow: 0 10px 20px rgba(219, 39, 119, 0.2);
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

    @media (max-width: 480px) {
        .notebook-page {
            padding: 3rem 1rem 2rem 3.5rem;
        }
        .page-margin-red {
            left: 48px;
        }
        .notebook-title {
            font-size: 1.8rem;
        }
        .notebook-message {
            font-size: 1.4rem;
        }
        .envelope {
            width: 280px;
            height: 190px;
        }
    }
</style>
