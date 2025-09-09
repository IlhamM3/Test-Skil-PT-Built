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
import DatePicker from "vue-datepicker-next";
import { d$Summary } from "@/stores/summary";
import { d$General } from "@/stores/general";
import Multiselect from "vue-multiselect";
const isLoading = ref(false);
const StoreSummary = d$Summary();
const StoreGen = d$General();
const { GetSummariesYear } = storeToRefs(StoreSummary);
const { GetDataSales } = storeToRefs(StoreGen);

const DataSales = ref([]);
const DataSummary = ref({
  current: { year: null, amount: 0 },
  previous: { year: null, amount: 0 },
});
const params = ref({});
const ParamsSales = ref();
const selectedSales = ref();

const selectedstartDate = ref(new Date().getFullYear());

const GetSummaryParams = async (params) => {
  isLoading.value = true;
  try {
    const res = await StoreSummary.Api$SumYear(params);
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
    year: selectedstartDate.value,
  };

  if (ParamsSales.value) params.value.salesCode = ParamsSales.value;
  await GetSummaryParams(params.value);
};

onMounted(async () => {
  await ApiSummary();
  await GetSales();
});

watch(GetDataSales, (newVal) => {
  if (newVal?.items) {
    DataSales.value = newVal.items;
  }
});
watch(GetSummariesYear, (newVal) => {
  if (newVal) {
    DataSummary.value = {
      current: newVal.current,
      previous: newVal.previous,
    };
  }
});

const handlestartDate = async (value) => {
  const dateObj = new Date(value);
  const year = dateObj.getFullYear();
  selectedstartDate.value = year;
  await ApiSummary();
};
const handleSales = async (value) => {
  selectedSales.value = value;
  ParamsSales.value = value.code;
  await ApiSummary();
};
const RemoveHandleSales = async () => {
  selectedSales.value = null;
  ParamsSales.value = null;
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
  const prevYear = DataSummary.value?.previous?.year ?? "";
  const prevAmount = Number(DataSummary.value?.previous?.amount ?? 0);

  const currYear = DataSummary.value?.current?.year ?? "";
  const currAmount = Number(DataSummary.value?.current?.amount ?? 0);

  return {
    labels: ["Amount"],
    datasets: [
      {
        label: `Previous (${prevYear})`,
        data: [prevAmount],
        backgroundColor: "rgba(16, 185, 129, 0.7)",
      },
      {
        label: `Current (${currYear})`,
        data: [currAmount],
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
      <h1 class="text-lg md:text-2xl font-semibold">Yearly Summary</h1>
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-5 items-center md:w-[50%] w-full"
      >
        <div class="flex flex-col space-y-1 w-full">
          <label for="StartYear" class="text-sm font-medium text-gray-700">
            Start Year
          </label>
          <DatePicker
            id="StartYear"
            v-model:value="selectedstartDate"
            type="year"
            format="YYYY"
            value-format="YYYY"
            :placeholder="selectedstartDate"
            class="!w-full rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            @change="handlestartDate"
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
