<template>
  <el-container>
    <el-main>
      <div class="profile-form">
        <h2>个人信息</h2>
        <el-form :model="form" ref="form" label-width="100px" @submit.prevent="updateProfile">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateProfile">更新</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElForm, ElInput, ElButton, ElFormItem, ElContainer, ElMain } from 'element-plus';

export default defineComponent({
  name: 'ProfilePage',
  components: {
    ElForm,
    ElInput,
    ElButton,
    ElFormItem,
    ElContainer,
    ElMain
  },
  setup() {
    const form = ref({
      username: '',
      email: ''
    });

    const updateProfile = () => {
      console.log(`更新用户名: ${form.value.username}, 邮箱: ${form.value.email}`);
    };

    return {
      form,
      updateProfile
    };
  }
});
</script>

<style scoped>
.profile-form {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
