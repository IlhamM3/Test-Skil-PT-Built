<script setup>
import { ref, onMounted, watch } from "vue";
import Pagination from "@/components/pagination.vue";
import { storeToRefs } from "pinia";
import { d$Customer } from "@/stores/customer";
import { d$Transaction } from "@/stores/transaction";
import { d$General } from "@/stores/general";
import Multiselect from "vue-multiselect";
import Detail from "@/components/Transaction/detail.vue";
import { initFlowbite } from "flowbite";

const isLoading = ref(false);
const StoreTrans = d$Transaction();
const StoreGen = d$General();
const StoreCus = d$Customer();
const { GetDataCusList } = storeToRefs(StoreCus);
const { GetDataTransaction } = storeToRefs(StoreTrans);
const { GetDataSales } = storeToRefs(StoreGen);
const HariIni = new Date().toISOString().split("T")[0];

const DataTrans = ref([]);
const DataSales = ref([]);
const selectedTrans = ref();
const selectedSales = ref();

const selectedCustomer = ref();
const DataCustomer = ref([]);
const selectedsortBy = ref("created_at");
const selectedsortDirection = ref("desc");
const today = new Date();
const oneWeekAgo = new Date();
oneWeekAgo.setDate(today.getDate() - 7);
const selectedstartDate = ref(oneWeekAgo.toISOString().split("T")[0]);
const selectedendDate = ref(today.toISOString().split("T")[0]);
const ParamsSales = ref();
const ParamsTrans = ref();
const ParamsCustomer = ref();

const currentPage = ref(1);
const totalPages = ref(1);
const totalData = ref(0);
const perPage = ref(10);

const params = ref({});

const ApiTransWithParams = async () => {
  params.value = {
    page: currentPage.value,
    perPage: perPage.value,
    sortBy: selectedsortBy.value,
    sortDirection: selectedsortDirection.value,
    startDate: selectedstartDate.value,
    endDate: selectedendDate.value,
  };

  if (ParamsCustomer.value) params.value.customerCode = ParamsCustomer.value;
  if (ParamsSales.value) params.value.salesCode = ParamsSales.value;
  if (ParamsTrans.value) params.value.IdTransaksi = ParamsTrans.value;

  await GetTransParams(params.value);
  SetDataTransaction();
};

const handlePerPage = async (event) => {
  perPage.value = Number(event.target.value);
  sessionStorage.setItem("PerPageTrans", perPage.value);
  await ApiTransWithParams();
};

const handlesortBy = async (event) => {
  selectedsortBy.value = event.target.value;
  sessionStorage.setItem("SortByTrans", selectedsortBy.value);
  await ApiTransWithParams();
};

const handlesortDirection = async (event) => {
  selectedsortDirection.value = event.target.value;
  sessionStorage.setItem("SortDirectionTrans", selectedsortDirection.value);
  await ApiTransWithParams();
};

const handlestartDate = async (event) => {
  selectedstartDate.value = event.target.value;
  sessionStorage.setItem("StartDateTrans", selectedstartDate.value);
  await ApiTransWithParams();
};

const handleendDate = async (event) => {
  selectedendDate.value = event.target.value;
  sessionStorage.setItem("EndDateTrans", selectedendDate.value);
  await ApiTransWithParams();
};

const handleTrans = async (value) => {
  selectedTrans.value = value;
  ParamsTrans.value = value.referenceNo;
  sessionStorage.setItem("SelectedTrans", JSON.stringify(value));
  await ApiTransWithParams();
};

const RemoveHandleTrans = async () => {
  selectedTrans.value = null;
  ParamsTrans.value = null;
  sessionStorage.removeItem("SelectedTrans");
  await ApiTransWithParams();
};

const handleSales = async (value) => {
  selectedSales.value = value;
  ParamsSales.value = value.code;
  sessionStorage.setItem("SelectedSalesTrans", JSON.stringify(value));
  await ApiTransWithParams();
};

const RemoveHandleSales = async () => {
  selectedSales.value = null;
  ParamsSales.value = null;
  sessionStorage.removeItem("SelectedSalesTrans");
  await ApiTransWithParams();
};

const handleCustomer = async (value) => {
  selectedCustomer.value = value;
  ParamsCustomer.value = value.code;
  sessionStorage.setItem("SelectedCustomerTrans", JSON.stringify(value));
  await ApiTransWithParams();
};

const RemoveHandleCustomer = async () => {
  selectedCustomer.value = null;
  ParamsCustomer.value = null;
  sessionStorage.removeItem("SelectedCustomerTrans");
  await ApiTransWithParams();
};

const goToPage = async (page) => {
  currentPage.value = page;
  await ApiTransWithParams();
};

const GetSales = async () => {
  try {
    const res = await StoreGen.Api$Sales();
  } catch (err) {
    console.error(err);
  }
};

const GetCusList = async () => {
  try {
    const res = await StoreCus.Api$CusList();
  } catch (err) {
    console.error(err);
  }
};

const GetTransParams = async (params) => {
  isLoading.value = true;
  try {
    const res = await StoreTrans.Api$Transaction(params);
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (GetDataTransaction.value.length === 0) {
    await ApiTransWithParams();
    initFlowbite();
  }

  if (GetDataCusList.value.length === 0) {
    await GetCusList();
  }
  if (GetDataSales.value.length === 0) {
    await GetSales();
  }
  DataCustomer.value = GetDataCusList.value.items;
  DataSales.value = GetDataSales.value.items;
  SetDataTransaction();

  const savedPerPage = sessionStorage.getItem("PerPageTrans");
  if (savedPerPage) {
    perPage.value = Number(savedPerPage);
  }
  const savedSortBy = sessionStorage.getItem("SortByTrans");
  if (savedSortBy) {
    selectedsortBy.value = savedSortBy;
  }
  const savedSortDirection = sessionStorage.getItem("SortDirectionTrans");
  if (savedSortDirection) {
    selectedsortDirection.value = savedSortDirection;
  }
  const savedStartDate = sessionStorage.getItem("StartDateTrans");
  if (savedStartDate) {
    selectedstartDate.value = savedStartDate;
  }
  const savedEndDate = sessionStorage.getItem("EndDateTrans");
  if (savedEndDate) {
    selectedendDate.value = savedEndDate;
  }
  const savedTrans = sessionStorage.getItem("SelectedTrans");
  if (savedTrans) {
    selectedTrans.value = JSON.parse(savedTrans);
    ParamsTrans.value = selectedTrans.value.referenceNo;
  }
  const savedSales = sessionStorage.getItem("SelectedSalesTrans");
  if (savedSales) {
    selectedSales.value = JSON.parse(savedSales);
    ParamsSales.value = selectedSales.value.code;
  }
  const savedCustomer = sessionStorage.getItem("SelectedCustomerTrans");
  if (savedCustomer) {
    selectedCustomer.value = JSON.parse(savedCustomer);
    ParamsCustomer.value = selectedCustomer.value.code;
  }
});

const SetDataTransaction = () => {
  DataTrans.value = GetDataTransaction.value.items;
  currentPage.value = GetDataTransaction.value.currentPage || 0;
  totalPages.value = GetDataTransaction.value.lastPage || 0;
  totalData.value = GetDataTransaction.value.total || 0;
  perPage.value = GetDataTransaction.value.perPage || 10;
};

const FormatRP = (amount) => {
  const number = Number(amount);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

watch(GetDataCusList, (newVal) => {
  if (newVal?.items) {
    DataCustomer.value = newVal.items;
  }
});
</script>

<template>
  <section
    class="flex flex-col gap-5 border-gray-300 border flex-1 p-6 bg-gray-50 rounded-lg"
  >
    <div class="flex justify-between items-center">
      <h1 class="text-lg md:text-2xl font-semibold">Daftar Transaksi</h1>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      <div class="flex flex-col space-y-1">
        <label for="perPage" class="text-sm font-medium text-gray-700"
          >Per Page</label
        >
        <select
          id="perPage"
          class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          v-model="perPage"
          @change="handlePerPage"
        >
          <option
            v-for="n in [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
            :key="n"
            :value="n"
          >
            {{ n }}
          </option>
        </select>
      </div>

      <div class="flex flex-col space-y-1">
        <label for="sortBy" class="text-sm font-medium text-gray-700"
          >Sort By</label
        >
        <select
          id="sortBy"
          class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          v-model="selectedsortBy"
          @change="handlesortBy"
        >
          <option value="created_at" selected>Created At</option>
        </select>
      </div>

      <div class="flex flex-col space-y-1">
        <label for="sortDirection" class="text-sm font-medium text-gray-700"
          >Sort Direction</label
        >
        <select
          v-model="selectedsortDirection"
          id="sortDirection"
          class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          @change="handlesortDirection"
        >
          <option value="desc" selected>Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div class="flex flex-col space-y-1">
        <label for="startDate" class="text-sm font-medium text-gray-700"
          >Start Date</label
        >
        <input
          type="date"
          :max="HariIni"
          id="startDate"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          v-model="selectedstartDate"
          @change="handlestartDate"
        />
      </div>

      <div class="flex flex-col space-y-1">
        <label for="endDate" class="text-sm font-medium text-gray-700"
          >End Date</label
        >
        <input
          :min="HariIni"
          type="date"
          id="endDate"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          v-model="selectedendDate"
          @change="handleendDate"
        />
      </div>

      <div class="flex flex-col space-y-1">
        <label for="customer" class="text-sm font-medium text-gray-700"
          >Customer</label
        >
        <Multiselect
          v-model="selectedCustomer"
          :options="DataCustomer || []"
          label="name"
          track-by="code"
          placeholder="Pilih Nama..."
          :max-height="150"
          @select="handleCustomer"
          @remove="RemoveHandleCustomer"
        />
      </div>

      <div class="flex flex-col space-y-1">
        <label for="province" class="text-sm font-medium text-gray-700"
          >Reference No</label
        >
        <Multiselect
          v-model="selectedTrans"
          :options="DataTrans || []"
          label="referenceNo"
          track-by="referenceNo"
          placeholder="Pilih ReferenceNo..."
          :max-height="150"
          @select="handleTrans"
          @remove="RemoveHandleTrans"
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

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div class="relative w-full min-w-[700px]">
        <table class="w-full text-sm text-left rtl:text-right">
          <thead class="text-xs uppercase bg-gray-700 text-white">
            <tr>
              <th class="md:px-4 md:py-2 px-2 py-1">No</th>
              <th class="md:px-4 md:py-2 px-2 py-1">Customer</th>
              <th class="md:px-4 md:py-2 px-2 py-1">Sales</th>
              <th class="md:px-4 md:py-2 px-2 py-1">Tanggal Order</th>
              <th class="md:px-4 md:py-2 px-2 py-1">Tanggal Bayar</th>
              <th class="md:px-4 md:py-2 px-2 py-1">Total</th>
              <th class="md:px-4 md:py-2 px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody class="">
            <tr
              v-for="(data, index) in GetDataTransaction.items"
              :key="data.referenceNo"
              class="bg-white border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="md:px-4 md:py-2 px-2 py-1">
                {{ (currentPage - 1) * perPage + index + 1 }}
              </td>
              <td
                class="md:px-4 md:py-2 px-2 py-1 font-medium text-gray-900 w-60 break-words line-clamp-2"
              >
                {{ data.customer.name }}
              </td>
              <td class="md:px-4 md:py-2 px-2 py-1">{{ data.sales || "-" }}</td>
              <td class="md:px-4 md:py-2 px-2 py-1">
                {{ data.dateOrder || "-" }}
              </td>
              <td class="md:px-4 md:py-2 px-2 py-1">
                {{ data.paidAt || "-" }}
              </td>
              <td class="md:px-4 md:py-2 px-2 py-1">
                {{ FormatRP(data.amountTotal) || "-" }}
              </td>
              <td class="md:px-4 md:py-2 px-2 py-1">
                <button
                  :data-modal-target="`Detail-${data.referenceNo}`"
                  :data-modal-toggle="`Detail-${data.referenceNo}`"
                  class="hover:underline cursor-pointer"
                >
                  Detail
                </button>
              </td>
              <Detail
                :id-modal="`Detail-${data.referenceNo}`"
                :id-trans="data.referenceNo"
              />
            </tr>

            <tr v-if="totalData === 0">
              <td
                colspan="6"
                class="md:px-4 md:py-2 px-2 py-1 text-center text-gray-900 md:text-base text-sm"
              >
                Data tidak tersedia
              </td>
            </tr>
          </tbody>
        </table>
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
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      :totalData="totalData"
      :perPage="perPage"
      @changePage="goToPage"
    />
  </section>
</template>
