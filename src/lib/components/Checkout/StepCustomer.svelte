<script lang="ts">
  import {
    User,
    Phone,
    Mail,
    Heart,
    Calendar,
    Check,
    Camera,
    ImageIcon,
    Sparkles,
    Type,
    Music,
    Clock,
    Trash2,
    Youtube,
    Send,
    Lock,
    ChevronRight,
    Plane,
  } from "lucide-svelte";
  import {
    checkoutStore,
    updateCustomerData,
    updatePersonData,
  } from "$lib/stores/checkoutStore";
  import { track } from "$lib/track/meta";
  import { fade, slide } from "svelte/transition";

  export let onNext: () => void;

  let customerData = {
    name: "",
    whatsapp: "",
    email: "",
  };

  let confirmWhatsapp = false;

  $: ({ selectedProduct, people, totalAmount, selectedExtras } =
    $checkoutStore);

  function handleDataUpdate(field: string, value: any) {
    updatePersonData(0, { [field]: value });
  }

  function handlePhotoUpload(index: number, e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const currentPhotos = [...(people[0]?.photos || [null, null, null])];
        currentPhotos[index] = event.target?.result as string;
        handleDataUpdate("photos", currentPhotos);
      };
      reader.readAsDataURL(target.files[0]);
    }
  }

  function removePhoto(index: number) {
    const currentPhotos = [...(people[0]?.photos || [null, null, null])];
    currentPhotos[index] = null;
    handleDataUpdate("photos", currentPhotos);
  }

  function onlyNumbers(value: string) {
    return value.replace(/\D/g, "");
  }

  function formatPhone(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})/, "$1-$2");
  }

  function handleSubmit() {
    const p = people[0];
    if (!customerData.email || !customerData.name || !customerData.whatsapp) {
      alert("Por favor, preencha seus dados de envio.");
      return;
    }
    if (!p?.title || !p?.message || !p?.sender) {
      alert("Por favor, preencha o título, a mensagem e a assinatura.");
      return;
    }
    if (!confirmWhatsapp) {
      alert("Por favor, confirme que seu WhatsApp está correto.");
      return;
    }

    track("initiate_checkout", { value: totalAmount });
    updateCustomerData({
      ...customerData,
      whatsapp: onlyNumbers(customerData.whatsapp),
    });
    onNext();
    
    track("initiate_checkout", { value: totalAmount });
  }
</script>

<div class="love-bg-decoration">
  <div class="floating-heart h1">❤</div>
  <div class="floating-heart h2">❤</div>
  <div class="floating-heart h3">❤</div>
</div>

<div class="step-customer">
  <div class="container">
    <div class="content-wrapper">
      <div class="form-section">
        <div class="section-header">
          <div class="header-icon-box">
            <Mail size={32} color="white" strokeWidth={1.5} />
            <div class="heart-badge"><Heart size={14} fill="white" /></div>
          </div>
          <div class="header-texts">
            <span class="pre-title">Personalize seu presente</span>
            <h2>Seu Envelope do Amor</h2>
            <p>Eternize sua história em uma experiência digital inesquecível</p>
          </div>
        </div>

        <!-- VISUAL E FOTOS -->
        <div class="glass-card person-form">
          <h3 class="romantic-title"><ImageIcon size={22} /> Fotos & Título</h3>

          <div class="form-group">
            <label for="env-title">Qual será o título da surpresa?</label>
            <input
              id="env-title"
              type="text"
              placeholder="Ex: Para o Amor da Minha Vida"
              value={people[0]?.title || ""}
              on:input={(e) => handleDataUpdate("title", e.currentTarget.value)}
            />
          </div>

          <div class="form-group">
            <label>Selecione até 3 fotos marcantes</label>
            <div class="photo-grid">
              {#each Array(3) as _, i}
                <div class="photo-slot">
                  {#if people[0]?.photos?.[i]}
                    <div class="photo-preview" in:fade>
                      <img src={people[0].photos[i]} alt="Preview" />
                      <button class="remove-btn" on:click={() => removePhoto(i)}
                        ><Trash2 size={14} /></button
                      >
                    </div>
                  {:else}
                    <label class="upload-label">
                      <ImageIcon size={32} />
                      <span>Adicionar</span>
                      <input
                        type="file"
                        accept="image/*"
                        on:change={(e) => handlePhotoUpload(i, e)}
                      />
                    </label>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- MENSAGEM -->
        <div class="glass-card person-form">
          <h3 class="romantic-title"><Type size={22} /> Mensagem Romântica</h3>

          <div class="form-group">
            <label for="env-msg">O que o seu coração quer dizer?</label>
            <textarea
              id="env-msg"
              rows="5"
              placeholder="Escreva sua carta de amor aqui..."
              value={people[0]?.message || ""}
              on:input={(e) =>
                handleDataUpdate("message", e.currentTarget.value)}
            ></textarea>
          </div>

          <div class="form-group">
            <label for="env-sender">Como você deseja assinar?</label>
            <input
              id="env-sender"
              type="text"
              placeholder="Ex: Com todo meu amor, João"
              value={people[0]?.sender || ""}
              on:input={(e) =>
                handleDataUpdate("sender", e.currentTarget.value)}
            />
          </div>
        </div>

        <!-- EXTRAS -->
        <div class="glass-card person-form">
          <h3 class="romantic-title"><Sparkles size={22} /> Toques Mágicos</h3>

          <div class="extra-option">
            <label class="custom-check-wrapper">
              <input
                type="checkbox"
                checked={people[0]?.showTimer || false}
                on:change={(e) =>
                  handleDataUpdate("showTimer", e.currentTarget.checked)}
              />
              <div class="custom-check-box">
                <Check size={16} strokeWidth={4} />
              </div>
              <div class="text-info">
                <strong>Contador de Tempo Juntos</strong>
                <span
                  >Mostra há quantos dias, horas e minutos vocês estão juntos.</span
                >
              </div>
            </label>

            {#if people[0]?.showTimer}
              <div class="conditional-input" transition:slide>
                <label
                  ><Calendar size={16} /> Data de início do relacionamento</label
                >
                <input
                  type="date"
                  value={people[0]?.startDate || ""}
                  on:change={(e) =>
                    handleDataUpdate("startDate", e.currentTarget.value)}
                />
              </div>
            {/if}
          </div>

          <div class="spacer-line"></div>

          <div class="extra-option">
            <label class="custom-check-wrapper">
              <input
                type="checkbox"
                checked={people[0]?.hasMusic || false}
                on:change={(e) =>
                  handleDataUpdate("hasMusic", e.currentTarget.checked)}
              />
              <div class="custom-check-box">
                <Check size={16} strokeWidth={4} />
              </div>
              <div class="text-info">
                <strong>Trilha Sonora Especial (YouTube)</strong>
                <span>A música tocará automaticamente ao abrir o envelope.</span
                >
              </div>
            </label>

            {#if people[0]?.hasMusic}
              <div class="conditional-input" transition:slide>
                <label><Music size={16} /> Como é o nome da sua Música</label>
                <input
                  type="text"
                  placeholder="Nossa Música"
                  value={people[0]?.musicName || ""}
                  on:input={(e) =>
                    handleDataUpdate("musicName", e.currentTarget.value)}
                />
              </div>
              <div class="conditional-input" transition:slide>
                <label><Youtube size={16} /> Link da música no YouTube</label>
                <input
                  type="url"
                  placeholder="Cole o link do YouTube aqui..."
                  value={people[0]?.musicUrl || ""}
                  on:input={(e) =>
                    handleDataUpdate("musicUrl", e.currentTarget.value)}
                />
              </div>
            {/if}
          </div>
        </div>

        <div class="glass-card customer-section">
          <h3 class="romantic-title">
            <Send size={22} /> Informações de Envio
          </h3>
          <div class="form-group">
            <label>Seu Nome Completo</label>
            <input
              type="text"
              bind:value={customerData.name}
              placeholder="Nome de quem presenteia"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Seu WhatsApp</label>
              <input
                type="text"
                value={customerData.whatsapp}
                on:input={(e) =>
                  (customerData.whatsapp = formatPhone(e.currentTarget.value))}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div class="form-group">
              <label>Seu mellhor E-mail</label>
              <input
                type="email"
                bind:value={customerData.email}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div class="final-confirmation">
            <label class="checkbox-label">
              <input type="checkbox" bind:checked={confirmWhatsapp} />
              <div class="custom-checkbox">
                {#if confirmWhatsapp}<Check size={14} strokeWidth={4} />{/if}
              </div>
              <span
                >Confirmo que meu WhatsApp está correto para receber o link</span
              >
            </label>
          </div>
        </div>

        <button class="btn-purchase-love" on:click={handleSubmit}>
          <Heart size={20} fill="white" />
          Gerar Meu Envelope Agora
          <ChevronRight size={20} />
        </button>
      </div>

      <!-- SUMÁRIO -->
      <aside class="summary-section">
        <div class="order-summary-card">
          <div class="envelope-edge"></div>
          <h3>Resumo do Pedido</h3>
          <div class="summary-item">
            <span>Plano Selecionado</span>
            <span class="price-val">{selectedProduct?.name}</span>
          </div>

          {#each selectedExtras.filter((e) => e.selected) as extra}
            <div class="summary-item extra-row" in:fade>
              <span>{extra.name}</span>
              <span class="price-val"
                >+ R$ {extra.price.toFixed(2).replace(".", ",")}</span
              >
            </div>
          {/each}

          <div class="summary-divider"></div>
          <div class="summary-total">
            <div class="total-label">
              <span>Valor Total</span>
              <small>Em até 12x no cartão</small>
            </div>
            <span class="total-amount"
              >R$ {totalAmount.toFixed(2).replace(".", ",")}</span
            >
          </div>
          <div class="secure-badge">
            <Lock size={14} /> Pagamento 100% Protegido
          </div>
        </div>
      </aside>
    </div>
  </div>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;500;600;700&display=swap");

  :root {
    --primary-love: #ff4d6d;
    --secondary-love: #c9184a;
    --bg-love: #fff8f9;
    --text-deep: #4a0e0e;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .step-customer {
    min-height: 100vh;
    padding: 40px 0;
    position: relative;
    z-index: 2;
  }

  /* DECORAÇÃO */
  .love-bg-decoration {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
  }
  .floating-heart {
    position: absolute;
    color: #ffccd5;
    font-size: 2.5rem;
    opacity: 0.4;
    animation: float 8s infinite ease-in-out;
  }
  .h1 {
    top: 5%;
    left: 3%;
  }
  .h2 {
    top: 75%;
    right: 4%;
    animation-delay: 2s;
  }
  .h3 {
    top: 40%;
    left: 85%;
    animation-delay: 4s;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-30px) rotate(15deg);
    }
  }

  /* LAYOUT */
  .content-wrapper {
    display: grid;
    grid-template-columns: 1.8fr 1.2fr;
    gap: 40px;
  }

  /* HEADER ESTILIZADO */
  .section-header {
    display: flex;
    gap: 20px;
    margin-bottom: 50px;
    align-items: center;
  }

  .header-texts {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
  }

  .header-icon-box {
    width: 70px;
    height: 70px;
    background: var(--secondary-love);
    border-radius: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 10px 20px rgba(201, 24, 74, 0.2);
    flex-shrink: 0;
  }
  .heart-badge {
    position: absolute;
    bottom: -5px;
    right: -5px;
    background: #ff8fa3;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid white;
  }
  .pre-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--primary-love);
    font-weight: 800;
  }
  .section-header h2 {
    font-family: "Great Vibes", cursive;
    color: var(--text-deep);
    font-size: clamp(2.5rem, 6vw, 4rem);
    margin: 0;
    line-height: 0.9;
  }
  .section-header p {
    color: #8d5b5b;
    margin-top: 5px;
    font-size: 1rem;
  }

  /* CARDS */
  .glass-card {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 77, 109, 0.15);
    border-radius: 35px;
    padding: 35px;
    margin-bottom: 25px;
    box-shadow: 0 15px 35px rgba(74, 14, 14, 0.03);
  }

  .romantic-title {
    font-size: 1.2rem;
    color: var(--secondary-love);
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 700;
  }

  .form-group {
    margin-bottom: 25px;
  }
  .form-group label {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    font-weight: 600;
    color: #5e2a2a;
    margin-bottom: 10px;
  }

  input,
  textarea {
    width: 100%;
    padding: 16px 22px;
    border: 1.5px solid #feeafa;
    border-radius: 20px;
    font-family: inherit;
    font-size: 0.95rem;
    background: #fdfdfd;
    transition: all 0.3s;
    box-sizing: border-box;
  }
  input:focus,
  textarea:focus {
    border-color: var(--primary-love);
    background: white;
    box-shadow: 0 0 0 5px rgba(255, 77, 109, 0.08);
    outline: none;
  }

  /* FOTOS GRID */
  .photo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
  .photo-slot {
    margin-top: 10px;
    max-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #fdfdfd;
    border: 2px dashed #ffccd5;
    border-radius: 24px;
    position: relative;
    transition: 0.3s;
    overflow: hidden;
  }

  .photo-slot:hover {
    border-color: var(--primary-love);
    background: #fffcfd;
  }

  .upload-label {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px;
    cursor: pointer;
    color: #4a0e0e;
    gap: 8px;
  }

  .upload-label input {
    display: none;
  }

  .photo-preview {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .photo-preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .remove-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--secondary-love);
    color: white;
    border: none;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  /* EXTRAS */
  .custom-check-wrapper {
    display: flex;
    gap: 15px;
    cursor: pointer;
    align-items: center;
  }
  .custom-check-wrapper input {
    display: none;
  }
  .custom-check-box {
    width: 26px;
    height: 26px;
    border: 2px solid #ffccd5;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background: white;
    transition: 0.3s;
  }
  .custom-check-wrapper input:checked + .custom-check-box {
    background: var(--primary-love);
    border-color: var(--primary-love);
  }
  .text-info strong {
    display: block;
    font-size: 1rem;
    color: var(--text-deep);
  }
  .text-info span {
    font-size: 0.8rem;
    color: #8d5b5b;
  }

  .conditional-input {
    margin-top: 20px;
    padding: 20px;
    background: #fff8f9;
    border-radius: 20px;
    border: 1px solid #feeafa;
  }
  .conditional-input label {
    color: var(--secondary-love);
    font-weight: 700;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .spacer-line {
    height: 1px;
    background: #feeafa;
    margin: 25px 0;
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  /* BOTÃO COMPRA */
  .btn-purchase-love {
    width: 100%;
    padding: 24px;
    border-radius: 60px;
    background: linear-gradient(
      135deg,
      var(--primary-love) 0%,
      var(--secondary-love) 100%
    );
    color: white;
    font-size: 1.3rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    box-shadow: 0 15px 40px rgba(201, 24, 74, 0.25);
    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .btn-purchase-love:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 45px rgba(201, 24, 74, 0.35);
  }

  /* SUMÁRIO */
  .summary-section {
    position: sticky;
    top: 40px;
  }
  .order-summary-card {
    background: white;
    border-radius: 35px;
    padding: 45px 35px;
    border: 1px solid #feeafa;
    box-shadow: 0 20px 60px rgba(74, 14, 14, 0.05);
    position: relative;
    overflow: hidden;
  }
  .envelope-edge {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 12px;
    background: repeating-linear-gradient(
      -45deg,
      #ff4d6d,
      #ff4d6d 15px,
      #fff 15px,
      #fff 30px
    );
  }
  .order-summary-card h3 {
    font-weight: 700;
    color: var(--text-deep);
    margin-bottom: 30px;
    text-align: center;
    font-size: 1.2rem;
  }
  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 18px;
    font-size: 0.95rem;
    color: #5e2a2a;
  }
  .extra-row {
    color: var(--secondary-love);
    font-weight: 600;
  }
  .summary-divider {
    height: 1.5px;
    background: #fff1f4;
    margin: 25px 0;
  }
  .summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  .total-label span {
    display: block;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--text-deep);
  }
  .total-label small {
    color: #8d5b5b;
    font-size: 0.75rem;
  }
  .total-amount {
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--secondary-love);
    letter-spacing: -1px;
  }
  .secure-badge {
    background: #f0fff4;
    color: #236c44;
    padding: 14px;
    border-radius: 20px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 700;
  }

  /* CHECKBOX FINAL */
  .final-confirmation {
    margin-top: 15px;
  }
  .checkbox-label {
    display: flex;
    gap: 12px;
    align-items: center;
    cursor: pointer;
    color: #8d5b5b;
    font-size: 0.85rem;
    line-height: 1.4;
  }
  .checkbox-label input {
    display: none;
  }
  .custom-checkbox {
    width: 22px;
    height: 22px;
    border: 2px solid #ffccd5;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-love);
    flex-shrink: 0;
    background: white;
  }
  .checkbox-label input:checked + .custom-checkbox {
    background: #fff0f3;
    border-color: var(--primary-love);
  }

  /* RESPONSIVIDADE */
  @media (max-width: 1024px) {
    .content-wrapper {
      grid-template-columns: 1fr;
      gap: 30px;
    }
    .summary-section {
      order: -1;
      position: relative;
      top: 0;
    }
    .order-summary-card {
      padding: 35px 25px;
    }
  }

  @media (max-width: 600px) {
    .step-customer {
      padding: 20px 0;
    }
    .glass-card {
      padding: 25px 18px;
      border-radius: 25px;
    }
    .section-header {
      flex-direction: column;
      text-align: center;
      gap: 15px;
    }
    .section-header h2 {
      font-size: 3rem;
    }
    .photo-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    /* .photo-slot {
      border: none;
    }
    .photo-preview {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 12px;
      overflow: hidden;
    }
    .photo-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    } */
    .form-row {
      grid-template-columns: 1fr;
      gap: 0;
    }
    .total-amount {
      font-size: 1.8rem;
    }
    .btn-purchase-love {
      font-size: 1.1rem;
      padding: 18px;
    }
  }
</style>
