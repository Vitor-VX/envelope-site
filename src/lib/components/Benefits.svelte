<script lang="ts">
  import {
    UserCheck,
    MailSearch,
    Shield,
    MessageSquare,
    Heart,
    Music,
  } from "lucide-svelte";
</script>

<section class="benefits">
  <div class="container">
    <h2 class="text-center section-title">
      Por que presentear com o Envelope do Amor?
    </h2>

    <div class="grid grid-3">
      <div class="benefit-card card">
        <div class="benefit-icon icon-red">
          <UserCheck size={40} />
        </div>
        <h3>Experiência Única</h3>
        <p>
          Crie um envelope personalizado com suas fotos, mensagem especial,
          contador de tempo e sua trilha sonora favorita.
        </p>
      </div>

      <div class="benefit-card card">
        <div class="benefit-icon icon-pink">
          <MessageSquare size={40} />
        </div>
        <h3>Acesso Imediato</h3>
        <p>
          O QR Code e o link da sua página exclusiva são enviados direto no seu <strong
            >WhatsApp</strong
          > e E-mail após a confirmação.
        </p>
      </div>

      <div class="benefit-card card">
        <div class="benefit-icon icon-gold">
          <Shield size={40} />
        </div>
        <h3>Amor com Segurança</h3>
        <p>
          Pagamento via Pix com processamento instantâneo, seguro e com a
          garantia de entrega da nossa plataforma.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .benefits {
    padding: 100px 0;
    background: #fffafa;
    position: relative;
  }

  .section-title {
    font-family: "Great Vibes", cursive;
    color: #5e0b15;
    font-size: clamp(2.5rem, 8vw, 3.5rem);
    margin-bottom: 60px;
    position: relative;
    line-height: 1.1;
  }

  .section-title::after {
    content: "❤❤❤";
    display: block;
    font-size: 1.2rem;
    color: #ff4d6d;
    margin-top: 15px;
    letter-spacing: 8px;
  }

  .benefit-card {
    text-align: center;
    border: 1px solid #feeafa;
    padding: 45px 30px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 25px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .benefit-card:hover {
    border-color: #ffccd5;
    transform: translateY(-12px);
    box-shadow: 0 25px 50px rgba(230, 57, 70, 0.1);
  }

  .benefit-icon {
    margin-bottom: 28px;
    width: 85px;
    height: 85px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    transition: transform 0.5s ease;
  }

  .benefit-card:hover .benefit-icon {
    transform: rotate(12deg) scale(1.1);
  }

  .icon-red {
    background: #fff0f3;
    color: #ff4d6d;
  }

  .icon-pink {
    background: #fdf0f0;
    color: #ff8fa3;
  }

  .icon-gold {
    background: #fff9eb;
    color: #d4af37;
  }

  .benefit-card h3 {
    font-family: "Poppins", sans-serif;
    color: #4a0e0e;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 18px;
  }

  .benefit-card p {
    color: #8d5b5b;
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    .benefits {
      padding: 60px 0;
    }

    .section-title {
      font-size: 2.2rem;
      margin-bottom: 40px;
      padding: 0 15px;
    }

    .benefit-card {
      padding: 35px 20px;
      margin: 0 10px;
    }
  }
</style>
