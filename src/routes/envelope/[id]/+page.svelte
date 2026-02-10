<script lang="ts">
    import {
        Sparkles,
        Image as ImageIcon,
        Youtube,
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
        startDate: "2021-01-12",
        timeCounter:
            "3 anos, 1 meses, 8 dias, 17 horas, 44 minutos e 59 segundos",
        sender: "João",
        hasMusic: true,
        musicName: "Nossa Música Especial",
        artistName: "Jorge & Mateus",
        musicUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    };

    let isOpen = false;
    let isOpening = false;
    let isPlaying = false;
    let currentPhotoIndex = 0;

    $: validPhotos = formData.photos.filter((p) => p !== null);

    onMount(() => {
        const interval = setInterval(() => {
            if (validPhotos.length > 1) {
                currentPhotoIndex =
                    (currentPhotoIndex + 1) % validPhotos.length;
            }
        }, 4000);
        return () => clearInterval(interval);
    });

    function handleOpen() {
        isOpening = true;
        // Simula o tempo de ler a cartinha saindo do envelope antes de abrir o caderno
        setTimeout(() => {
            isOpen = true;
            isPlaying = true; // Inicia a animação da música
        }, 1200);
    }

    function getYoutubeThumbnail(url: string) {
        const regExp =
            /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11
            ? `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`
            : "https://files.botsync.site/modelos-certificados/modelo_padrao.jpeg";
    }

    $: videoThumbnail = getYoutubeThumbnail(formData.musicUrl);
</script>

<!-- FUNDO ANIMADO COM CORAÇÕES LUCIDE -->
<div class="floating-hearts">
    {#each Array(15) as _, i}
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
        <!-- ENVELOPE INTERATIVO -->
        <div
            class="envelope-container"
            class:opening={isOpening}
            on:click={handleOpen}
            out:fade={{ duration: 400 }}
        >
            <div class="envelope">
                <div class="flap"></div>
                <div class="pocket"></div>

                <!-- A Cartinha que sai de dentro -->
                <div class="letter-inside">
                    <div class="letter-text">
                        <Heart size={18} fill="#db2777" color="#db2777" />
                        <p>Uma mensagem especial para você...</p>
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
                    <Sparkles size={16} /> Clique para abrir
                </div>
            {/if}
        </div>
    {:else}
        <!-- CONTEÚDO DO CADERNO (SCRAPBOOK) -->
        <div
            class="notebook-section"
            in:fly={{ y: 50, duration: 1000, delay: 200 }}
        >
            <div class="notebook-wrapper">
                <div class="notebook-cover">
                    <div class="notebook-page">
                        <div class="page-lines"></div>
                        <div class="page-margin-red"></div>
                        <div class="page-spiral">
                            {#each Array(15) as _}
                                <div class="spiral-hole"></div>
                            {/each}
                        </div>

                        <div class="notebook-content">
                            <h1 class="notebook-title">
                                {formData.title}
                            </h1>

                            <!-- CARROSSEL DE FOTOS -->
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

                            <p class="notebook-message">
                                {formData.message}
                            </p>

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
                                <span class="signature-name"
                                    >{formData.sender}</span
                                >
                            </div>

                            <!-- PLAYER DE MÚSICA ESTILO INSTAGRAM -->
                            {#if formData.hasMusic}
                                <div class="instagram-music-card">
                                    <div class="music-info-wrapper">
                                        <div
                                            class="album-cover"
                                            class:playing={isPlaying}
                                        >
                                            <img
                                                src={videoThumbnail}
                                                alt="Capa"
                                            />
                                            <div class="play-state">
                                                {#if isPlaying}
                                                    <div class="music-bars">
                                                        <span></span><span
                                                        ></span><span></span>
                                                    </div>
                                                {:else}
                                                    <Play
                                                        size={16}
                                                        fill="white"
                                                    />
                                                {/if}
                                            </div>
                                        </div>
                                        <div class="music-details">
                                            <span class="song-title"
                                                >{formData.musicName ||
                                                    "Nossa Música"}</span
                                            >
                                            <span class="song-artist"
                                                >{formData.artistName ||
                                                    "Jorge & Mateus"} • 3:00</span
                                            >
                                        </div>
                                    </div>
                                    <div class="music-action">
                                        <Music size={20} color="white" />
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>

            <button
                class="btn-close"
                on:click={() => ((isOpen = false), (isOpening = false))}
            >
                <X size={18} /> Fechar
            </button>
        </div>
    {/if}
</main>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;600&display=swap");

    :global(body) {
        margin: 0;
        background: #fffafa;
        font-family: "Poppins", sans-serif;
    }

    /* FUNDO ANIMADO */
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
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        position: relative;
        z-index: 1;
    }

    /* ENVELOPE 3D MELHORADO */
    .envelope-container {
        cursor: pointer;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .envelope {
        width: 320px;
        height: 220px;
        background: #ffffff;
        position: relative;
        box-shadow: 0 20px 50px rgba(219, 39, 119, 0.15);
        border-radius: 0 0 12px 12px;
        transition: 0.3s;
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
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
        z-index: 5;
        border-radius: 0 0 12px 12px;
        border: 1px solid #fce7f3;
    }

    .letter-inside {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        height: 85%;
        background: white;
        z-index: 2;
        transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        padding: 20px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .opening .letter-inside {
        transform: translate(-50%, -100px);
    }

    .letter-text {
        font-family: "Great Vibes", cursive;
        color: #db2777;
        text-align: center;
        font-size: 1.3rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
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
        font-weight: 600;
        color: #db2777;
        font-size: 0.9rem;
    }

    .click-hint {
        color: #db2777;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: pulse 2s infinite;
    }

    /* CADERNO PREMIUM */
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
        padding: 12px;
        border-radius: 20px;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
        width: 100%;
    }
    .notebook-page {
        background: white;
        min-height: 700px;
        position: relative;
        border-radius: 4px;
        padding: 4rem 2rem 3rem 4.5rem;
        display: flex;
        flex-direction: column;
        box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.02);
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
        left: 60px;
        top: 0;
        bottom: 0;
        width: 1px;
        background: #ffc4c4;
        z-index: 2;
    }
    .page-spiral {
        position: absolute;
        left: 12px;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        z-index: 10;
    }
    .spiral-hole {
        width: 12px;
        height: 12px;
        background: #1a0208;
        border-radius: 50%;
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.6);
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
        font-size: 2.8rem;
        color: #1a0208;
        margin-bottom: 2rem;
        line-height: 1.1;
    }

    /* ÁREA DA FOTO */
    .photo-area {
        position: relative;
        width: 90%;
        margin: 1rem auto 3rem;
    }
    .photo-frame {
        background: white;
        padding: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border: 1px solid #f0f0f0;
    }
    .photo-frame img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        display: block;
        border-radius: 2px;
    }

    .tape {
        position: absolute;
        width: 80px;
        height: 30px;
        background: rgba(210, 207, 182, 0.4);
        backdrop-filter: blur(1px);
        z-index: 6;
    }
    .tape-tl {
        top: -15px;
        left: -25px;
        transform: rotate(-30deg);
    }
    .tape-br {
        bottom: -15px;
        right: -25px;
        transform: rotate(-35deg);
    }

    .notebook-message {
        font-family: "Great Vibes", cursive;
        font-size: 1.8rem;
        color: #2d0a14;
        line-height: 31px;
        margin-bottom: 2rem;
    }

    .timer-box {
        background: #fff1f4;
        border-radius: 15px;
        padding: 20px;
        text-align: center;
        border: 1px solid #fce7f3;
        margin-bottom: 2rem;
    }
    .timer-label {
        font-family: "Great Vibes", cursive;
        font-size: 2rem;
        color: #db2777;
        display: block;
    }
    .timer-text {
        font-size: 0.9rem;
        font-weight: 600;
        color: #4a0e0e;
    }

    .signature {
        margin-top: auto;
        text-align: right;
        font-family: "Great Vibes", cursive;
        font-size: 1.5rem;
        color: #888;
    }
    .signature-name {
        color: #1a0208;
        font-size: 2.2rem;
        font-weight: 500;
        margin-left: 10px;
    }

    /* INSTAGRAM MUSIC PLAYER */
    .instagram-music-card {
        background: #121212;
        border-radius: 12px;
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        max-width: 100%;
    }

    .music-info-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .album-cover {
        width: 48px;
        height: 48px;
        border-radius: 6px;
        position: relative;
        overflow: hidden;
    }
    .album-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .play-state {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .music-bars {
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 15px;
    }
    .music-bars span {
        width: 3px;
        background: white;
        border-radius: 10px;
        animation: musicBar 0.8s ease-in-out infinite;
    }
    .music-bars span:nth-child(2) {
        animation-delay: 0.2s;
    }
    .music-bars span:nth-child(3) {
        animation-delay: 0.4s;
    }

    @keyframes musicBar {
        0%,
        100% {
            height: 5px;
        }
        50% {
            height: 15px;
        }
    }

    .music-details {
        display: flex;
        flex-direction: column;
    }
    .song-title {
        color: white;
        font-size: 0.9rem;
        font-weight: 700;
    }
    .song-artist {
        color: #b3b3b3;
        font-size: 0.75rem;
    }

    .btn-close {
        background: white;
        color: #db2777;
        border: 1.5px solid #db2777;
        padding: 12px 35px;
        border-radius: 50px;
        font-weight: 700;
        cursor: pointer;
        transition: 0.3s;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.05);
            opacity: 0.8;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @media (max-width: 600px) {
        .envelope {
            width: 300px;
            height: 200px;
        }
        .notebook-page {
            padding-left: 3.5rem;
            padding-right: 1.5rem;
        }
        .notebook-title {
            font-size: 2.2rem;
        }
    }
</style>
