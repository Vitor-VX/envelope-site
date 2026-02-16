<script lang="ts">
  import { HandHeart, Heart, Play, Eye, Sparkles, X } from "lucide-svelte";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let onStartCheckout: () => void;

  let urlPreview = "https://envelopedoamor.shop/envelope/11e7d962d9f6";
  let showPreview = false;

  function onOpenPreview() {
    showPreview = true;
  }

  function onClosePreview() {
    showPreview = false;
  }

  const carrosel = ["https://files.botsync.site/envelope/img-site/img_03.png"];

  let current = 0;
  let interval: any;

  function next() {
    current = (current + 1) % carrosel.length;
  }

  onMount(() => {
    interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  });
</script>

<section class="hero">
  <div class="floating-elements">
    <div class="f-heart h1">❤</div>
    <div class="f-heart h2">❤</div>
    <div class="f-heart h3">❤</div>
  </div>

  <div class="container">
    <div class="hero-content">
      <div class="badge">
        <Sparkles size={14} />
        Eternize seu sentimento
      </div>

      <h1 class="hero-title">
        <span class="title-icon">
          <Heart size={40} fill="currentColor" />
        </span>
        Seu Envelope do Amor
        <span class="title-icon">
          <Heart size={40} fill="currentColor" />
        </span>
      </h1>

      <p class="hero-subtitle">
        Uma surpresa digital mágica. Transforme suas fotos e palavras em um
        <strong>envelope interativo</strong> que toca música e emociona quem você
        ama.
      </p>

      <div class="preview-container">
        <div class="device-frame">
          <div class="image-carousel" on:click={onOpenPreview}>
            {#each carrosel as image, i}
              <img
                src={image}
                alt="Modelo do Envelope"
                class:active={i === current}
              />
            {/each}

            <div class="preview-trigger">
              <div class="play-btn pulse">
                <Play size={24} fill="white" />
              </div>
              <span>Ver como funciona</span>
            </div>

            <div class="carousel-dots">
              {#each carrosel as _, i}
                <span class:active={i === current} />
              {/each}
            </div>
          </div>
        </div>
        <p class="tap-info">Toque na imagem para ver a animação</p>
      </div>

      <div class="cta-section">
        <button class="btn btn-primary btn-large" on:click={onStartCheckout}>
          <HandHeart size={20} />
          Criar Meu Envelope Agora
        </button>
        <div class="price-container">
          <p class="price-info">
            De <span class="price-old">R$ 29,90</span> por apenas
            <span class="price">R$ 18,90</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

{#if showPreview}
  <div class="modal-overlay" in:fade on:click={onClosePreview}>
    <div class="modal-content" in:fly={{ y: 50 }} on:click|stopPropagation>
      <div class="modal-header">
        <div class="header-info">
          <Heart size={16} fill="#db2777" color="#db2777" />
          <span>Exemplo de Cartinha</span>
        </div>
        <button class="btn-close" on:click={onClosePreview}>
          <X size={24} />
        </button>
      </div>
      <div class="iframe-container">
        <iframe
          src={urlPreview}
          title="Preview do Envelope do Amor"
          frameborder="0"
          allow="autoplay"
        ></iframe>
      </div>
    </div>
  </div>
{/if}

<style>
  @import url("https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@400;600;700&display=swap");

  .hero {
    background: linear-gradient(180deg, #fff5f5 0%, #fff 100%);
    color: #4a0e0e;
    padding: 40px 0 80px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .floating-elements {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .f-heart {
    position: absolute;
    color: #ffccd5;
    opacity: 0.5;
    animation: float 6s infinite ease-in-out;
  }
  .h1 {
    top: 10%;
    left: 5%;
    font-size: 2rem;
  }
  .h2 {
    bottom: 20%;
    right: 5%;
    font-size: 2.5rem;
    animation-delay: 2s;
  }
  .h3 {
    top: 40%;
    left: 85%;
    font-size: 1.5rem;
    animation-delay: 4s;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  .badge {
    background: #ffe3e3;
    color: #e63946;
    padding: 8px 20px;
    border-radius: 50px;
    font-weight: 700;
    font-size: 0.8rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 25px;
    text-transform: uppercase;
    border: 1px solid #ffb5a7;
  }

  .hero-title {
    font-family: "Great Vibes", cursive;
    color: #c9184a;
    font-size: clamp(2.5rem, 8vw, 4.5rem);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    line-height: 1;
  }

  .title-icon {
    color: #ff4d6d;
    display: flex;
    align-items: center;
  }

  .hero-subtitle {
    font-size: 1.2rem;
    color: #8d5b5b;
    max-width: 650px;
    margin: 0 auto 40px;
    line-height: 1.6;
    font-family: "Poppins", sans-serif;
  }

  .device-frame {
    display: inline-block;
    padding: 10px;
    background: #4a0e0e;
    border-radius: 35px;
    box-shadow: 0 30px 60px rgba(74, 14, 14, 0.2);
    border: 4px solid #333;
    margin-bottom: 20px;
  }

  .image-carousel {
    position: relative;
    width: 260px;
    aspect-ratio: 9/16;
    background: white;
    border-radius: 25px;
    overflow: hidden;
    cursor: pointer;
  }

  .image-carousel img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.8s ease;
  }

  .image-carousel img.active {
    opacity: 1;
    z-index: 1;
  }

  .preview-trigger {
    position: absolute;
    inset: 0;
    z-index: 10;
    background: rgba(74, 14, 14, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .play-btn {
    width: 60px;
    height: 60px;
    background: #c9184a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    padding-left: 4px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .preview-trigger span {
    color: white;
    font-weight: 700;
    font-size: 0.85rem;
    text-transform: uppercase;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .pulse {
    animation: pulse-red 2s infinite;
  }
  @keyframes pulse-red {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(201, 24, 74, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 15px rgba(201, 24, 74, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(201, 24, 74, 0);
    }
  }

  .carousel-dots {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
    z-index: 15;
  }

  .carousel-dots span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
  }
  .carousel-dots span.active {
    background: white;
    width: 15px;
    border-radius: 10px;
  }

  .btn-large {
    padding: 20px 40px;
    font-size: 1.2rem;
    border-radius: 50px;
    background: linear-gradient(135deg, #ff4d6d 0%, #c9184a 100%);
    box-shadow: 0 10px 25px rgba(201, 24, 74, 0.3);
    color: white;
    border: none;
    cursor: pointer;
    font-weight: 700;
    box-shadow: 0 10px 25px rgba(201, 24, 74, 0.25);
  }

  /* MODAL STYLES */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .modal-content {
    background: white;
    width: 100%;
    max-width: 420px;
    height: 90vh;
    border-radius: 30px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
  }

  .header-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #4a0e0e;
  }

  .price-container {
    margin-top: 20px;
  }

  .price-info {
    font-size: 1.1rem;
    color: #8d5b5b;
  }

  .price-old {
    text-decoration: line-through;
    opacity: 0.6;
    font-size: 1rem;
    margin: 0 5px;
  }

  .price {
    font-size: 1.8rem;
    font-weight: 800;
    color: #c9184a;
    display: block;
    margin-top: 5px;
  }

  .btn-close {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    display: flex;
    padding: 5px;
  }

  .iframe-container {
    flex: 1;
    background: #fffafa;
  }
  .iframe-container iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  @media (max-width: 768px) {
    .modal-content {
      height: 85vh;
      max-width: 100%;
    }
    .hero-title {
      font-size: 2.8rem;
    }
    .image-carousel {
      width: 220px;
    }
  }
</style>
