<script lang="ts">
    import "../../app.css";
</script>

<div class="envelpe-layout">
    <main class="envelpe-main">
        <slot />
    </main>
</div>

<style>
    .envelpe-layout {
        display: flex;
        min-height: 100vh;
        background: #f8fafc;
    }

    .envelpe-main {
        flex: 1;
        margin-left: 280px;
        overflow: hidden;
    }

    @media (max-width: 768px) {
        .envelpe-main {
            margin-left: 0;
        }
    }
</style>