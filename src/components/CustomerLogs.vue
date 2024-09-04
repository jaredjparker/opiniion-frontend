<script setup lang="ts">
import { onMounted } from 'vue'
import axios from 'axios'
import { ref } from 'vue'

interface Location {
  locationId: number
  name: string
}

const locations = ref<Array<Location>>([])
const selectedLocation = ref('')
const selectedStartDate = ref('')
const selectedEndDate = ref('')
const allLogs = ref<any[]>([])
const apiUrl: string = import.meta.env.VITE_LOGS_API_URL

const getCustomerLogData = () => {
  axios
    .post(
      `${apiUrl}/opiniionTest`,
      {
        locationId: selectedLocation.value,
        startDate: selectedStartDate.value,
        endDate: selectedEndDate.value
      },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then((response) => {
      const data = response.data
      allLogs.value = data.reduce((acc: any[], document: any) => {
        return acc.concat(
          document.logs.map((log: any) => ({
            ...log,
            customerName: `${log.customer.firstName} ${log.customer.lastName}`
          }))
        )
      }, [])
    })
    .catch((error) => console.log(error))
}

onMounted(() => {
  axios
    .get(`${apiUrl}/locations`)
    .then((response) => (locations.value = response.data))
    .catch((error) => console.log(error))
})
</script>

<template>
  <h1>Customer Logs</h1>
  <div class="row input-wrapper">
    <div class="stack">
      <label for="location-select">Customer Location:</label>
      <select id="location-select" v-model="selectedLocation">
        <option
          v-for="location in locations"
          :key="location.locationId"
          :value="location.locationId"
        >
          {{ location.name }}
        </option>
      </select>
    </div>
    <div class="stack">
      <label for="start">Logs Start Date:</label>
      <input type="date" id="start" name="logs-start-date" v-model="selectedStartDate" />
    </div>
    <div class="stack">
      <label for="end">Logs End Date:</label>
      <input type="date" id="end" name="logs-end-date" v-model="selectedEndDate" />
    </div>
    <div class="stack">
      <button @click="getCustomerLogData">Search</button>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Type</th>
        <th>Text</th>
        <th>Date</th>
        <th>Customer Name</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(log, index) in allLogs" :key="index">
        <td :class="{ error: log.type == 'error' }">{{ log.type.toUpperCase() }}</td>
        <td>{{ log.text }}</td>
        <td>{{ new Date(log.date).toLocaleDateString() }}</td>
        <td>{{ log.customerName }}</td>
      </tr>
    </tbody>
  </table>
</template>
