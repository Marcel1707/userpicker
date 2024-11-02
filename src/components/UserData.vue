<template>
  <h3>User List</h3>

  <div class="p-field p-grid" style="display: flex; gap: 8px; width: 100%;">
    <InputText v-model="newUserName" placeholder="Enter a username" style="flex: 1;" />
    <Button label="Add User" icon="pi pi-plus" @click="addUser" class="addButton" style="flex: none;" />
  </div>

  <DataTable :value="users" v-model:editingRows="editingRows" editMode="row" @row-edit-save="onRowEditSave" class="user-table">

    <Column field="name" header="Username" style="width: 90%">
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" />
      </template>
    </Column>

    <Column style="width: 5%">
      <template #body="{ index }">
        <Button icon="pi pi-trash" @click="deleteUser(index)" class="p-button p-component p-button-icon-only p-button-secondary p-button-rounded p-button-text p-datatable-row-editor-init">
        </Button>
      </template>
    </Column>

    <Column :rowEditor="true" style="width: 5%" bodyStyle="text-align:center"></Column>
  </DataTable>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default defineComponent({
  components: {
    DataTable,
    Column,
    InputText,
    Button,
  },
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  emits: ['update-users'],
  setup(props, { emit }) {
    const newUserName = ref('');
    const editingRows = ref([]);

    const addUser = () => {
      if (newUserName.value) {
        const newUser = { name: newUserName.value };
        const updatedUsers = [...props.users, newUser];
        emit('update-users', updatedUsers);
        newUserName.value = '';
      }
    };

    const onRowEditSave = (event) => {
      const { newData, index } = event;
      const updatedUsers = props.users.map((user, i) => {
        return i === index ? { ...user, name: newData.name } : user;
      });
      emit('update-users', updatedUsers);
    };

    const deleteUser = (index) => {
      const updatedUsers = props.users.filter((_, i) => i !== index);
      emit('update-users', updatedUsers);
    };

    return {
      newUserName,
      editingRows,
      addUser,
      onRowEditSave,
      deleteUser,
    };
  },
});
</script>

<style>

.addButton {
  text-align: right;
}

.user-table {
  margin-top: 1rem;
  width: 100%;
}
</style>
