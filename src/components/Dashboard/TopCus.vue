<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";
import { ref, onMounted, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { d$Summary } from "@/stores/summary";
const isLoading = ref(false);
const StoreSummary = d$Summary();
const { GetSummariesTop } = storeToRefs(StoreSummary);

const DataSummary = ref([]);
const params = ref({});
const selectedLimit = ref(3);

const today = new Date();
const oneWeekAgo = new Date();
oneWeekAgo.setDate(today.getDate() - 7);
const selectedstartDate = ref(oneWeekAgo.toISOString().split("T")[0]);
const selectedendDate = ref(today.toISOString().split("T")[0]);
const HariIni = new Date().toISOString().split("T")[0];

const GetSummaryParams = async (params) => {
  isLoading.value = true;
  try {
    const res = await StoreSummary.Api$SumTop(params);
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const ApiSummary = async () => {
  params.value = {
    startDate: selectedstartDate.value,
    endDate: selectedendDate.value,
    limit: selectedLimit.value,
  };
  await GetSummaryParams(params.value);
};

const handlestartDate = async (event) => {
  selectedstartDate.value = event.target.value;
  await ApiSummary();
};
const handleendDate = async (event) => {
  selectedendDate.value = event.target.value;
  await ApiSummary();
};
const handleLimit = async (event) => {
  selectedLimit.value = Number(event.target.value);
  await ApiSummary();
};

watch(GetSummariesTop, (newVal) => {
  if (newVal?.items) {
    DataSummary.value = newVal.items;
  }
});
onMounted(async () => {
  await ApiSummary();
});

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const shortNumber = (num) => {
  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(4).replace(/\.00$/, "") + "T";
  }
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.0$/, "") + "Jt";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
};

const chartDataTopCus = computed(() => {
  const data = Array.isArray(DataSummary.value) ? DataSummary.value : [];

  return {
    labels: data.map((i) => i.customer?.name ?? ""),
    datasets: [
      {
        label: "amount",
        data: data.map((i) => Number(i.amount ?? 0)),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };
});

const chartOptionsTopCus = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: Rp ${shortNumber(context.raw)}`;
        },
      },
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => `Rp ${shortNumber(value)}`,
      },
    },
    x: {
      ticks: {
        callback: (val, idx) => {
          let name = DataSummary.value[idx].customer.name;
          return name.length > 5 ? name.slice(0, 5) + "..." : name;
        },
      },
    },
  },
};
</script>

<template>
  <div
    class="flex flex-col gap-5 border-gray-300 border flex-1 p-3 md:p-6 bg-gray-50 rounded-lg"
  >
    <div
      class="flex justify-between items-start md:items-center md:flex-row flex-col gap-5"
    >
      <h1 class="text-lg md:text-2xl font-semibold">Top Customer</h1>

      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-5 items-center md:w-[50%] w-full"
      >
        <div class="flex flex-col space-y-1">
          <label for="startDate" class="text-sm font-medium text-gray-700"
            >Start Date</label
          >
          <input
            type="date"
            id="startDate"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            v-model="selectedstartDate"
            :max="HariIni"
            @change="handlestartDate"
          />
        </div>

        <div class="flex flex-col space-y-1">
          <label for="endDate" class="text-sm font-medium text-gray-700"
            >End Date</label
          >
          <input
            type="date"
            id="endDate"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            v-model="selectedendDate"
            :min="HariIni"
            @change="handleendDate"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label for="Limit" class="text-sm font-medium text-gray-700"
            >Limit</label
          >
          <select
            id="Limit"
            class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            @change="handleLimit"
          >
            <option v-for="n in [3, 7, 15]" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="w-full overflow-x-auto">
      <div class="min-w-[400px] md:w-full relative">
        <Bar :data="chartDataTopCus" :options="chartOptionsTopCus" />
        <div
          v-if="isLoading"
          class="absolute inset-0 z-40 flex items-center justify-center bg-gray-900/20"
        >
          <Vue3Lottie
            animationLink="/loading.json"
            :height="120"
            :width="120"
            :loop="true"
            :autoplay="true"
            class="p-0 m-0"
          />
        </div>
      </div>
    </div>
  </div>
</template>
