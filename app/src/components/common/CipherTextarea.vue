<!-- Komponenta pro textový vstup a výstup -->
<template>
  <section>
    <!-- vstup -->
    <section class="textarea-wrap">
      <textarea
        class="secondary-color"
        :placeholder="vstupniPlaceholder"
        :value="vstupniText"
        @input="zpracovatVstup"
      ></textarea>

      <button
        type="button"
        class="copy-btn"
        title="Kopírovat vstup"
        @click="$parent.kopirovat(vstupniText)"
        style="background: var(--input-bg)"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="9"
            y="9"
            width="11"
            height="11"
            rx="2"
            stroke="currentColor"
            stroke-width="2"
          />
          <rect
            x="4"
            y="4"
            width="11"
            height="11"
            rx="2"
            stroke="currentColor"
            stroke-width="2"
            opacity="0.6"
          />
        </svg>
      </button>
    </section>

    <!-- výstup -->
    <section class="textarea-wrap">
      <textarea
        class="secondary-color"
        :placeholder="vystupniPlaceholder"
        :value="vystupniText"
        readonly
      ></textarea>
      <button
        type="button"
        class="copy-btn"
        title="Kopírovat výsledek"
        @click="$parent.kopirovat(vystupniText)"
        style="background: var(--input-bg)"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="9"
            y="9"
            width="11"
            height="11"
            rx="2"
            stroke="currentColor"
            stroke-width="2"
          />
          <rect
            x="4"
            y="4"
            width="11"
            height="11"
            rx="2"
            stroke="currentColor"
            stroke-width="2"
            opacity="0.6"
          />
        </svg>
      </button>
    </section>
  </section>
</template>

<script>
import "@/assets/styles/common/textarea.css";
export default {
  name: "CipherTextarea",
  props: {
    vstupniText: String,
    vystupniText: String,
    vstupniPlaceholder: {
      type: String,
      default: "Zadejte text",
    },
    vystupniPlaceholder: {
      type: String,
      default: "Výsledek",
    },
    customFilter: Function,
    predFiltrem: Function,
  },
  methods: {
    // ošetření vstupu uživatele pouza velké znaky abecedy, mezery a tečky nebo customFilter z dané šifry
    zpracovatVstup(event) {
      let novaHodnota = event.target.value;
      const puvodniHodnota = this.vstupniText;

      if (this.predFiltrem) {
        novaHodnota = this.predFiltrem(novaHodnota, puvodniHodnota);
      }
    
      if (this.customFilter) {
        novaHodnota = this.customFilter(novaHodnota);
      } else {
        novaHodnota = novaHodnota.replace(/[^a-zA-Z\s.]/g, "").toUpperCase();
      }

      this.$parent.vstupniText = novaHodnota;
      event.target.value = novaHodnota;
    },
  },
};
</script>
