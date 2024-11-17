<script setup>
import PickerWheel from './components/PickerWheel.vue'
import UserData from './components/UserData.vue'
import {ref, onMounted, watch} from "vue";

const users = ref([]);

const updateUsers = (newUsers) => {
  users.value = newUsers;
  localStorage.setItem('users', JSON.stringify(newUsers));
};

onMounted(() => {
  const storedUsers = localStorage.getItem('users');
  users.value = storedUsers ? JSON.parse(storedUsers) : [];
});

watch(users, (newUsers) => {
  localStorage.setItem('users', JSON.stringify(newUsers));
}, { deep: true });

</script>

<template>
  <div class="container">
    <div class="left-section">
      <PickerWheel :users="users" @update-users="updateUsers"></PickerWheel>
    </div>
    <div class="right-section">
      <UserData :users="users" @update-users="updateUsers"></UserData>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  gap: 2rem;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.left-section {
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>
