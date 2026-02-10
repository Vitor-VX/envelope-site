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
  } from "lucide-svelte";
  import {
    checkoutStore,
    updateCustomerData,
    updatePersonData,
  } from "$lib/stores/checkoutStore";
  import { track } from "$lib/track/meta";

  export let onNext: () => void;

  let customerData = {
    name: "",
    whatsapp: "",
    email: "",
  };

  let confirmWhatsapp = false;

  $: ({ selectedProduct, people, totalAmount, selectedExtras } =
    $checkoutStore);

  // Função para atualizar os dados específicos do envelope (armazenados em people[0])
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
      alert(
        "Por favor, preencha o título, a mensagem e a assinatura do seu envelope.",
      );
      return;
    }

    if (p.showTimer && !p.startDate) {
      alert("Por favor, informe a data de início do relacionamento.");
      return;
    }

    if (p.hasMusic && !p.musicUrl) {
      alert("Por favor, insira o link da música do YouTube.");
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
  }
</script>

<div class="step-customer">
  <div class="content-wrapper">
    <div class="form-section">
      <div class="section-header">
        <h2>💌 Crie seu Envelope do Amor</h2>
        <p>Personalize cada detalhe da sua surpresa digital</p>
      </div>

      <!-- SEÇÃO 1: CONTEÚDO VISUAL -->
      <div class="person-form card">
        <h3 class="romantic-title"><ImageIcon size={20} /> Visual e Fotos</h3>

        <div class="form-group">
          <label for="env-title">Título da Mensagem</label>
          <input
            id="env-title"
            type="text"
            placeholder="Ex: Para o grande amor da minha vida"
            value={people[0]?.title || ""}
            on:input={(e) => handleDataUpdate("title", e.currentTarget.value)}
          />
        </div>

        <div class="form-group">
          <label>Fotos Especiais (Até 3)</label>
          <div class="photo-grid">
            {#each Array(3) as _, i}
              <div class="photo-slot">
                {#if people[0]?.photos?.[i]}
                  <div class="photo-preview">
                    <img src={people[0].photos[i]} alt="Preview" />
                    <button class="remove-btn" on:click={() => removePhoto(i)}
                      ><Trash2 size={14} /></button
                    >
                  </div>
                {:else}
                  <label class="upload-label">
                    <Camera size={24} />
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

      <!-- SEÇÃO 2: MENSAGEM -->
      <div class="person-form card">
        <h3 class="romantic-title"><Type size={20} /> Mensagem de Amor</h3>

        <div class="form-group">
          <label for="env-msg">Sua Mensagem</label>
          <textarea
            id="env-msg"
            rows="5"
            placeholder="Escreva aqui tudo o que você sente..."
            value={people[0]?.message || ""}
            on:input={(e) => handleDataUpdate("message", e.currentTarget.value)}
          ></textarea>
        </div>

        <div class="form-group">
          <label for="env-sender">Assinatura</label>
          <input
            id="env-sender"
            type="text"
            placeholder="Ex: Com amor, João"
            value={people[0]?.sender || ""}
            on:input={(e) => handleDataUpdate("sender", e.currentTarget.value)}
          />
        </div>
      </div>

      <!-- SEÇÃO 3: EXTRAS (CONTADOR E MÚSICA) -->
      <div class="person-form card">
        <h3 class="romantic-title"><Sparkles size={20} /> Toques Especiais</h3>

        <!-- Contador -->
        <div class="extra-option">
          <label class="checkbox-container">
            <input
              type="checkbox"
              checked={people[0]?.showTimer || false}
              on:change={(e) =>
                handleDataUpdate("showTimer", e.currentTarget.checked)}
            />
            <span class="checkmark"></span>
            <div class="text">
              <strong>Contador de tempo juntos</strong>
              <p>Ideal para nunca esquecerem a data de vocês.</p>
            </div>
          </label>

          {#if people[0]?.showTimer}
            <div class="conditional-input animate-fade">
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

        <div class="divider-small"></div>

        <!-- Música -->
        <div class="extra-option">
          <label class="checkbox-container">
            <input
              type="checkbox"
              checked={people[0]?.hasMusic || false}
              on:change={(e) =>
                handleDataUpdate("hasMusic", e.currentTarget.checked)}
            />
            <span class="checkmark"></span>
            <div class="text">
              <strong>Adicionar trilha sonora</strong>
              <p>Uma música especial que toca ao abrir o envelope.</p>
            </div>
          </label>

          {#if people[0]?.hasMusic}
            <div class="conditional-input animate-fade">
              <label><Youtube size={16} /> Link da música (YouTube)</label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={people[0]?.musicUrl || ""}
                on:input={(e) =>
                  handleDataUpdate("musicUrl", e.currentTarget.value)}
              />
            </div>
          {/if}
        </div>
      </div>

      <!-- SEÇÃO 4: DADOS DO CLIENTE -->
      <div class="customer-section card">
        <h3 class="romantic-title"><Mail size={20} /> Dados de Envio</h3>
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
            <label>Seu E-mail</label>
            <input
              type="email"
              bind:value={customerData.email}
              placeholder="email@exemplo.com"
            />
          </div>
        </div>

        <div class="checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={confirmWhatsapp} />
            <div class="custom-checkbox">
              {#if confirmWhatsapp}<Check size={14} strokeWidth={4} />{/if}
            </div>
            <span
              >Confirmo que meus dados estão corretos para receber o link.</span
            >
          </label>
        </div>
      </div>

      <button class="btn-compra btn-large" on:click={handleSubmit}>
        Gerar Meu Envelope & Pagar
      </button>
    </div>

    <!-- SUMÁRIO STICKY -->
    <div class="summary-section">
      <div class="order-summary card">
        <h3>Resumo da Surpresa</h3>
        <div class="summary-item">
          <span class="label">Produto:</span>
          <span class="value">Envelope do Amor Digital</span>
        </div>
        <div class="summary-item">
          <span class="label">Fotos inclusas:</span>
          <span class="value"
            >{people[0]?.photos?.filter(Boolean).length || 0}/3</span
          >
        </div>

        <div class="summary-divider"></div>
        <div class="summary-total">
          <span class="label">Total:</span>
          <span class="value"
            >R$ {totalAmount.toFixed(2).replace(".", ",")}</span
          >
        </div>
        <div class="secure-badge">
          <Check size={14} /> Pagamento 100% Seguro
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .step-customer {
    max-width: 1100px;
    margin: 0 auto;
    padding-bottom: 50px;
  }
  .content-wrapper {
    display: grid;
    grid-template-columns: 1.8fr 1.2fr;
    gap: 30px;
    align-items: start;
  }

  .section-header h2 {
    font-family: "Great Vibes", cursive;
    color: #5e0b15;
    font-size: 3rem;
    margin-bottom: 10px;
  }
  .romantic-title {
    font-size: 1.2rem;
    color: #c9184a;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    border-bottom: 1px solid #feeafa;
    padding-bottom: 10px;
  }

  .person-form,
  .customer-section {
    background: #fffafa;
    border: 1px solid #ffccd5;
    padding: 25px;
    border-radius: 20px;
    margin-bottom: 25px;
  }

  .form-group {
    margin-bottom: 15px;
  }
  .form-group label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #4a0e0e;
    margin-bottom: 8px;
  }
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1.5px solid #feeafa;
    border-radius: 12px;
    outline: none;
    transition: 0.3s;
    font-family: inherit;
  }
  .form-group input:focus,
  .form-group textarea:focus {
    border-color: #ff4d6d;
    background: #fff;
  }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-top: 10px;
  }
  .photo-slot {
    aspect-ratio: 1/1;
    background: #fff;
    border: 2px dashed #ffccd5;
    border-radius: 15px;
    overflow: hidden;
    position: relative;
  }
  .upload-label {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #ff8fa3;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    gap: 5px;
  }
  .upload-label input {
    display: none;
  }
  .photo-preview {
    width: 100%;
    height: 100%;
  }
  .photo-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: #db2777;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .extra-option {
    padding: 10px 0;
  }
  .checkbox-container {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
    position: relative;
  }
  .checkbox-container input {
    display: none;
  }
  .checkmark {
    width: 22px;
    height: 22px;
    border: 2px solid #ff4d6d;
    border-radius: 6px;
    flex-shrink: 0;
    position: relative;
    margin-top: 3px;
  }
  .checkbox-container input:checked + .checkmark {
    background: #ff4d6d;
  }
  .checkbox-container input:checked + .checkmark::after {
    content: "✓";
    color: white;
    position: absolute;
    left: 4px;
    top: -1px;
    font-weight: bold;
  }
  .text strong {
    display: block;
    font-size: 0.95rem;
    color: #4a0e0e;
  }
  .text p {
    font-size: 0.8rem;
    color: #8d5b5b;
    margin: 0;
  }

  .conditional-input {
    margin-top: 15px;
    padding-left: 34px;
  }
  .conditional-input label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #c9184a;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 5px;
  }

  .divider-small {
    height: 1px;
    background: #feeafa;
    margin: 15px 0;
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .btn-compra {
    background: linear-gradient(135deg, #ff4d6d 0%, #c9184a 100%);
    color: white;
    border: none;
    padding: 20px;
    border-radius: 50px;
    font-size: 1.2rem;
    font-weight: 700;
    width: 100%;
    box-shadow: 0 10px 25px rgba(201, 24, 74, 0.3);
    cursor: pointer;
    transition: 0.3s;
  }
  .btn-compra:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(201, 24, 74, 0.4);
  }

  .order-summary {
    position: sticky;
    top: 20px;
    background: white;
    border: 2px solid #feeafa;
    padding: 30px;
    border-radius: 25px;
  }
  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 0.9rem;
    color: #4a0e0e;
  }
  .summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 800;
    font-size: 1.4rem;
    color: #c9184a;
    margin-top: 15px;
  }
  .secure-badge {
    background: #f0fff4;
    color: #2f855a;
    padding: 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 700;
    margin-top: 20px;
  }

  .animate-fade {
    animation: fadeIn 0.4s ease;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 850px) {
    .content-wrapper {
      grid-template-columns: 1fr;
    }
    .order-summary {
      position: static;
      margin-top: 20px;
    }
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
