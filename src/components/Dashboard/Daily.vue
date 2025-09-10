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
import { d$General } from "@/stores/general";
import Multiselect from "vue-multiselect";
const StoreSummary = d$Summary();
const StoreGen = d$General();
const { GetSummariesDaily } = storeToRefs(StoreSummary);
const { GetDataSales } = storeToRefs(StoreGen);
const isLoading = ref(false);

const DataSales = ref([]);
const DataSummary = ref([]);
const params = ref({});
const ParamsSales = ref();
const selectedSales = ref();
const HariIni = new Date().toISOString().split("T")[0];
const today = new Date();
const oneWeekAgo = new Date();
oneWeekAgo.setDate(today.getDate() - 7);
const selectedstartDate = ref(oneWeekAgo.toISOString().split("T")[0]);
const selectedendDate = ref(today.toISOString().split("T")[0]);

const GetSummaryParams = async (params) => {
  isLoading.value = true;
  try {
    const res = await StoreSummary.Api$SumDaily(params);
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const GetSales = async () => {
  try {
    const res = await StoreGen.Api$Sales();
  } catch (err) {
    console.error(err);
  }
};

const ApiSummary = async () => {
  params.value = {
    startDate: selectedstartDate.value,
    endDate: selectedendDate.value,
  };

  if (ParamsSales.value) params.value.salesCode = ParamsSales.value;
  await GetSummaryParams(params.value);
  DataSummary.value = GetSummariesDaily.value.items;
};

onMounted(async () => {
  if (GetSummariesDaily.value.length === 0) {
    await ApiSummary();
  }
  if (GetDataSales.value.length === 0) {
    await GetSales();
  }
  DataSales.value = GetDataSales.value.items;
  DataSummary.value = GetSummariesDaily.value.items;
  const GetSelectedSales = sessionStorage.getItem("SelectedSalesDaily");
  const StartDateDaily = sessionStorage.getItem("StartDateDaily");
  const EndDateDaily = sessionStorage.getItem("EndDateDaily");
  if (GetSelectedSales) {
    const dataSales = JSON.parse(GetSelectedSales);
    selectedSales.value = dataSales;
    ParamsSales.value = dataSales.code;
  }
  if (StartDateDaily) {
    selectedstartDate.value = JSON.parse(StartDateDaily);
  }
  if (EndDateDaily) {
    selectedendDate.value = JSON.parse(EndDateDaily);
  }
});

const handlestartDate = async (event) => {
  selectedstartDate.value = event.target.value;
  sessionStorage.setItem(
    "StartDateDaily",
    JSON.stringify(selectedstartDate.value)
  );
  await ApiSummary();
};
const handleendDate = async (event) => {
  selectedendDate.value = event.target.value;
  sessionStorage.setItem("EndDateDaily", JSON.stringify(selectedendDate.value));
  await ApiSummary();
};
const handleSales = async (value) => {
  selectedSales.value = value;
  ParamsSales.value = value.code;
  sessionStorage.setItem("SelectedSalesDaily", JSON.stringify(value));
  await ApiSummary();
};

const RemoveHandleSales = async () => {
  selectedSales.value = null;
  ParamsSales.value = null;
  sessionStorage.removeItem("SelectedSalesDaily");
  await ApiSummary();
};
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const chartData = computed(() => {
  const data = Array.isArray(DataSummary.value) ? DataSummary.value : [];

  return {
    labels: data.map((i) => i.date ?? ""),
    datasets: [
      {
        label: "Amount",
        data: data.map((i) => Number(i.amount ?? 0)),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };
});

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

const chartOptions = {
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
      <h1 class="text-lg md:text-2xl font-semibold">Daily Summary</h1>
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-5 items-center md:w-[70%] w-full"
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
          <label for="city" class="text-sm font-medium text-gray-700"
            >Sales</label
          >
          <Multiselect
            v-model="selectedSales"
            :options="DataSales || []"
            label="name"
            track-by="code"
            placeholder="Pilih Sales..."
            :max-height="150"
            @select="handleSales"
            @remove="RemoveHandleSales"
          />
        </div>
      </div>
    </div>
    <div class="w-full overflow-x-auto">
      <div class="min-w-[800px] md:w-full relative">
        <Bar :data="chartData" :options="chartOptions" />
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
