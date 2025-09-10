<script setup>
import { ref, onMounted, watch } from "vue";
import Pagination from "@/components/pagination.vue";
import { storeToRefs } from "pinia";
import { d$Customer } from "@/stores/customer";
import { d$General } from "@/stores/general";
import { toast } from "vue3-toastify";
import Multiselect from "vue-multiselect";
import Tambah from "@/components/customer/Tambah.vue";
import Edit from "@/components/customer/Edit.vue";
import Detail from "@/components/customer/Detail.vue";
import { initFlowbite } from "flowbite";

const isLoading = ref(false);
const StoreCus = d$Customer();
const StoreGen = d$General();
const { GetDataCusParams, GetDataCusList } = storeToRefs(StoreCus);
const { GetDataProvince, GetDataCity } = storeToRefs(StoreGen);

const HariIni = new Date().toISOString().split("T")[0];
const DataCity = ref([]);
const DataProvince = ref([]);
const selectedCity = ref();
const selectedProvince = ref();
const selectedCustomer = ref();
const DataCustomer = ref([]);
const selectedsortBy = ref("created_at");
const selectedsortDirection = ref("desc");
const selectedstartDate = ref();
const selectedendDate = ref();
const ParamsCity = ref();
const ParamsProvince = ref();
const ParamsCustomer = ref();

const currentPage = ref(1);
const totalPages = ref(1);
const totalData = ref(0);
const perPage = ref(10);

const params = ref({});

const ApiCusWithParams = async () => {
  params.value = {
    page: currentPage.value,
    perPage: perPage.value,
    sortBy: selectedsortBy.value,
    sortDirection: selectedsortDirection.value,
  };

  if (selectedstartDate.value) params.value.startDate = selectedstartDate.value;
  if (selectedendDate.value) params.value.endDate = selectedendDate.value;
  if (ParamsCustomer.value) params.value.name = ParamsCustomer.value;
  if (ParamsProvince.value) params.value.provinceCode = ParamsProvince.value;
  if (ParamsCity.value) params.value.cityCode = ParamsCity.value;
  await GetCusParams(params.value);
  setPagination();
};

const handlePerPage = async (event) => {
  perPage.value = Number(event.target.value);
  sessionStorage.setItem("perPageCustomer", perPage.value);
  await ApiCusWithParams();
};

const handlesortBy = async (event) => {
  selectedsortBy.value = event.target.value;
  sessionStorage.setItem("sortByCustomer", selectedsortBy.value);
  await ApiCusWithParams();
};

const handlesortDirection = async (event) => {
  selectedsortDirection.value = event.target.value;
  sessionStorage.setItem("sortDirectionCustomer", selectedsortDirection.value);
  await ApiCusWithParams();
};

const handlestartDate = async (event) => {
  selectedstartDate.value = event.target.value;
  sessionStorage.setItem("startDateCustomer", selectedstartDate.value);
  await ApiCusWithParams();
};

const handleendDate = async (event) => {
  selectedendDate.value = event.target.value;
  sessionStorage.setItem("endDateCustomer", selectedendDate.value);
  await ApiCusWithParams();
};

const handleProvince = async (value) => {
  selectedProvince.value = value;
  ParamsProvince.value = value.code;
  sessionStorage.setItem("provinceCustomer", JSON.stringify(value));
  await ApiCusWithParams();
};

const handleCity = async (value) => {
  selectedCity.value = value;
  ParamsCity.value = value.code;
  sessionStorage.setItem("cityCustomer", JSON.stringify(value));
  await ApiCusWithParams();
};

const handleCustomer = async (value) => {
  selectedCustomer.value = value;
  ParamsCustomer.value = value.name;
  sessionStorage.setItem("customerCustomer", JSON.stringify(value));
  await ApiCusWithParams();
};

const RemoveHandleProvince = async () => {
  selectedProvince.value = null;
  ParamsProvince.value = null;
  sessionStorage.removeItem("provinceCustomer");
  await ApiCusWithParams();
};

const RemoveHandleCity = async () => {
  selectedCity.value = null;
  ParamsCity.value = null;
  sessionStorage.removeItem("cityCustomer");
  await ApiCusWithParams();
};

const RemoveHandleCustomer = async () => {
  selectedCustomer.value = null;
  ParamsCustomer.value = null;
  sessionStorage.removeItem("customerCustomer");
  await ApiCusWithParams();
};

const goToPage = async (page) => {
  currentPage.value = page;
  sessionStorage.setItem("currentPageCustomer", currentPage.value);
  await ApiCusWithParams();
};

const GetProvince = async () => {
  try {
    const res = await StoreGen.Api$Province();
  } catch (err) {
    console.error(err);
  }
};
const GetCity = async () => {
  try {
    const res = await StoreGen.Api$City();
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

const GetCusParams = async (params) => {
  isLoading.value = true;
  try {
    const res = await StoreCus.Api$CusParams(params);
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (GetDataCusParams.value.length === 0) {
    await ApiCusWithParams();
    initFlowbite();
  }
  if (GetDataCusList.value.length === 0) {
    await GetCusList();
  }
  if (GetDataProvince.value.length === 0) {
    await GetProvince();
  }
  if (GetDataCity.value.length === 0) {
    await GetCity();
  }
  DataProvince.value = GetDataProvince.value.items;
  DataCustomer.value = GetDataCusList.value.items;
  DataCity.value = GetDataCity.value.items;
  setPagination();

  if (sessionStorage.getItem("perPageCustomer")) {
    perPage.value = Number(sessionStorage.getItem("perPageCustomer"));
  }
  if (sessionStorage.getItem("sortByCustomer")) {
    selectedsortBy.value = sessionStorage.getItem("sortByCustomer");
  }
  if (sessionStorage.getItem("sortDirectionCustomer")) {
    selectedsortDirection.value = sessionStorage.getItem(
      "sortDirectionCustomer"
    );
  }
  if (sessionStorage.getItem("startDateCustomer")) {
    selectedstartDate.value = sessionStorage.getItem("startDateCustomer");
  }
  if (sessionStorage.getItem("endDateCustomer")) {
    selectedendDate.value = sessionStorage.getItem("endDateCustomer");
  }
  if (sessionStorage.getItem("provinceCustomer")) {
    selectedProvince.value = JSON.parse(
      sessionStorage.getItem("provinceCustomer")
    );
    ParamsProvince.value = selectedProvince.value.code;
  }
  if (sessionStorage.getItem("cityCustomer")) {
    selectedCity.value = JSON.parse(sessionStorage.getItem("cityCustomer"));
    ParamsCity.value = selectedCity.value.code;
  }
  if (sessionStorage.getItem("customerCustomer")) {
    selectedCustomer.value = JSON.parse(
      sessionStorage.getItem("customerCustomer")
    );
    ParamsCustomer.value = selectedCustomer.value.name;
  }
  if (sessionStorage.getItem("currentPageCustomer")) {
    currentPage.value = Number(sessionStorage.getItem("currentPageCustomer"));
  }
});

const setPagination = () => {
  currentPage.value = GetDataCusParams.value.currentPage || 0;
  totalPages.value = GetDataCusParams.value.lastPage || 0;
  totalData.value = GetDataCusParams.value.total || 0;
  perPage.value = GetDataCusParams.value.perPage || 10;
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
      <h1 class="text-lg md:text-2xl">Daftar Customer</h1>
      <button
        data-modal-target="TambahCutomer"
        data-modal-toggle="TambahCutomer"
        class="px-3 py-2 cursor-pointer hover:bg-gray-200 text-black md:text-base text-xs border border-gray-400 rounded-md"
      >
        Tambah Customer
      </button>
      <Tambah idModal="TambahCutomer" :params="params" />
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
          <option value="name">Name</option>
        </select>
      </div>

      <div class="flex flex-col space-y-1">
        <label for="sortDirection" class="text-sm font-medium text-gray-700"
          >Sort Direction</label
        >
        <select
          id="sortDirection"
          class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          v-model="selectedsortDirection"
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
          id="startDate"
          :max="HariIni"
          class="rounded-md border w-full border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
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
          class="rounded-md border w-full border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
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
          >Province</label
        >
        <Multiselect
          v-model="selectedProvince"
          :options="DataProvince || []"
          label="name"
          track-by="code"
          placeholder="Pilih Provinsi..."
          :max-height="150"
          @select="handleProvince"
          @remove="RemoveHandleProvince"
        />
      </div>

      <div class="flex flex-col space-y-1">
        <label for="city" class="text-sm font-medium text-gray-700">Kota</label>
        <Multiselect
          v-model="selectedCity"
          :options="DataCity || []"
          label="name"
          track-by="code"
          placeholder="Pilih kota..."
          :max-height="150"
          @select="handleCity"
          @remove="RemoveHandleCity"
        />
      </div>
    </div>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div class="relative w-full min-w-[700px]">
        <table class="w-full text-sm text-left rtl:text-right">
          <thead class="text-xs uppercase bg-gray-700 text-white">
            <tr>
              <th class="md:px-4 md:py-2 px-2 py-1">No</th>
              <th class="md:px-4 md:py-2 px-2 py-1">Nama</th>
              <th class="md:px-4 md:py-2 px-2 py-1">Provinsi</th>
              <th class="md:px-4 md:py-2 px-2 py-1">Kota</th>
              <th class="md:px-4 md:py-2 px-2 py-1">Alamat</th>
              <th class="md:px-4 md:py-2 px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody class="">
            <tr
              v-for="(data, index) in GetDataCusParams.items"
              :key="data.code"
              class="bg-white border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="md:px-4 md:py-2 px-2 py-1">
                {{ (currentPage - 1) * perPage + index + 1 }}
              </td>
              <td
                class="md:px-4 md:py-2 px-2 py-1 font-medium text-gray-900 whitespace-nowrap"
              >
                {{ data.name }}
              </td>
              <td class="md:px-4 md:py-2 px-2 py-1">{{ data.province }}</td>
              <td class="md:px-4 md:py-2 px-2 py-1">{{ data.city }}</td>
              <td class="md:px-4 md:py-2 px-2 py-1">{{ data.address }}</td>
              <td class="md:px-4 md:py-2 px-2 py-1 flex items-center gap-3">
                <button
                  type="button"
                  :data-modal-target="`Edit-${data.code}`"
                  :data-modal-toggle="`Edit-${data.code}`"
                  class="hover:underline cursor-pointer"
                >
                  Edit
                </button>

                <Edit
                  :idModal="`Edit-${data.code}`"
                  :idCustomer="data.code"
                  :params="params"
                />

                <button
                  :data-modal-target="`Detail-${data.code}`"
                  :data-modal-toggle="`Detail-${data.code}`"
                  class="hover:underline cursor-pointer"
                >
                  Detail
                </button>
                <Detail
                  :idModal="`Detail-${data.code}`"
                  :idCustomer="data.code"
                />
              </td>
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
