<script setup>
import { ref, onMounted } from "vue";
import { d$Transaction } from "@/stores/transaction";
const StoreGen = d$Transaction();

const customer = ref({});
const sales = ref();
const product = ref([]);
const amountDue = ref();
const amountUntaxed = ref();
const amountTotal = ref();
const dateOrder = ref();
const dateDue = ref();
const paidAt = ref();

const props = defineProps({
  idModal: String,
  idTrans: String,
});

const GetTransbyId = async (id) => {
  try {
    const data = await StoreGen.Api$DetailTransaction(id);
    customer.value = data.customer;
    sales.value = data.sales;
    product.value = data.items;
    amountDue.value = FormatRP(data.amountDue);
    amountUntaxed.value = FormatRP(data.amountUntaxed);
    amountTotal.value = FormatRP(data.amountTotal);
    dateOrder.value = data.dateOrder;
    dateDue.value = data.dateDue;
    paidAt.value = data.paidAt;
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  GetTransbyId(props.idTrans);
});

const FormatRP = (amount) => {
  const number = Number(amount);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
function formatNumber(value) {
  return Number(value).toLocaleString("id-ID", { maximumFractionDigits: 0 });
}
</script>

<template>
  <div
    :id="idModal"
    tabindex="-1"
    aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative p-4 w-full max-w-4xl max-h-full">
      <div class="relative bg-white rounded-md shadow-sm">
        <div
          class="flex items-center justify-between px-2 py-2.5 md:px-4 md:py-4 border-b rounded-t border-gray-200"
        >
          <h3 class="text-base md:text-xl font-semibold text-gray-900">
            Detail transaksi Customer
            <p class="text-xs text-gray-500">
              Reference No:
              <span class="font-semibold">{{ props.idTrans }}</span>
            </p>
          </h3>
          <button
            type="button"
            class="cursor-pointer end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            :data-modal-hide="idModal"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="p-4 md:p-5">
          <!-- Customer & Sales Info -->
          <div class="grid grid-cols-2 gap-4 mb-6 text-xs md:text-sm">
            <div class="space-y-1">
              <p>
                <span class="font-semibold">Customer:</span> {{ customer.name }}
              </p>
              <p>
                <span class="font-semibold">Customer Code:</span>
                {{ customer.code }}
              </p>
              <p><span class="font-semibold">Sales:</span> {{ sales }}</p>
            </div>
            <div class="space-y-1 text-right">
              <p>
                <span class="font-semibold">Date Order:</span> {{ dateOrder }}
              </p>
              <p><span class="font-semibold">Due Date:</span> {{ dateDue }}</p>
              <p><span class="font-semibold">Paid At:</span> {{ paidAt }}</p>
            </div>
          </div>

          <!-- Items Table -->
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg mb-4">
            <div class="relative w-full">
              <table class="w-full text-xs md:text-sm text-left rtl:text-right">
                <thead class="text-xs uppercase bg-gray-700 text-white">
                  <tr>
                    <th class="px-3 py-2 text-left">Product</th>
                    <th class="px-3 py-2">Qty</th>
                    <th class="px-3 py-2">Price</th>
                    <th class="px-3 py-2">Discount</th>
                    <th class="px-3 py-2">Subtotal</th>
                    <th class="px-3 py-2">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(data, index) in product"
                    class="bg-white border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td
                      class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {{ data.productName }}
                    </td>
                    <td class="px-3 py-2">
                      {{ formatNumber(data.quantity) }}
                    </td>
                    <td class="px-3 py-2">
                      {{ FormatRP(data.price) }}
                    </td>
                    <td class="px-3 py-2">
                      {{ formatNumber(data.discount) }} %
                    </td>
                    <td class="px-3 py-2">
                      {{ FormatRP(data.priceSubtotal) }}
                    </td>
                    <td class="px-3 py-2">
                      {{ FormatRP(data.marginSubtotal) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Totals -->
          <div class="flex justify-end text-xs md:text-sm">
            <div class="md:w-1/2 w-3/4 space-y-2">
              <div class="flex justify-between">
                <span class="font-semibold">Amount Due:</span>
                <span>{{ amountDue }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold">Amount Untaxed:</span>
                <span>{{ amountUntaxed }}</span>
              </div>
              <div
                class="flex justify-between text-sm md:text-lg font-bold border-t pt-2"
              >
                <span>Total:</span>
                <span>{{ amountTotal }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
