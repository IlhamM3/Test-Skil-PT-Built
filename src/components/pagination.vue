<template>
  <div
    class="flex items-center justify-between w-full flex-col-reverse md:flex-row gap-3 md:gap-0"
  >
    <!-- Info data -->
    <div class="md:text-sm text-xs text-gray-600">
      Menampilkan {{ showing }} dari {{ totalData }} data
    </div>

    <!-- Navigasi pagination -->
    <div class="flex items-center gap-2 text-xs md:text-base">
      <!-- Prev -->
      <button
        @click="emitPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="text-gray-500 md:w-9 md:h-9 w-7 h-7 flex items-center justify-center border border-gray-400 rounded-md hover:bg-gray-400 disabled:hover:bg-white disabled:hover:text-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        &lt;
      </button>

      <!-- Pages -->
      <template v-for="(page, idx) in renderPages()" :key="idx">
        <span
          v-if="page === '...'"
          class="md:w-5 md:h-9 h-7 flex items-center justify-center text-gray-400"
        >
          ...
        </span>
        <button
          v-else
          @click="emitPage(page)"
          class="md:w-9 md:h-9 w-7 h-7 flex items-center justify-center border border-gray-400 rounded-md hover:bg-gray-400 hover:text-white cursor-pointer"
          :class="{
            'bg-gray-400 text-white': currentPage === page,
            'text-gray-500': currentPage !== page,
          }"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next -->
      <button
        @click="emitPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="text-gray-500 md:w-9 md:h-9 w-7 h-7 flex items-center justify-center border border-gray-400 rounded-md hover:bg-gray-400 disabled:hover:bg-white disabled:hover:text-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalData: { type: Number, required: true },
  perPage: { type: Number, default: 10 },
});

const emit = defineEmits(["changePage"]);

const emitPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("changePage", page);
  }
};

const showing = computed(() => {
  if (props.totalData === 0) return "0 – 0";
  const start = (props.currentPage - 1) * props.perPage + 1;
  const end = Math.min(props.currentPage * props.perPage, props.totalData);
  return `${start} – ${end}`;
});
const renderPages = () => {
  const pages = [];

  pages.push(1);

  if (props.totalPages <= 7) {
    for (let i = 2; i <= props.totalPages; i++) pages.push(i);
  } else {
    const start = Math.max(2, props.currentPage - 1);
    const end = Math.min(props.totalPages - 1, props.currentPage + 1);

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < props.totalPages - 1) pages.push("...");

    pages.push(props.totalPages);
  }

  return pages;
};
</script>
