
<script setup lang="ts">
import { ref } from 'vue'
import {router} from "../router/index.ts";
import type { Book } from '../type.ts'
import {userInfo, userInfoUpdate} from "../api/user.ts";
import {ElMessage} from "element-plus";

const user = ref('')

getUserInfo();

if (!user) {
  ElMessage({
    message: "未登录",
    type: 'error',
    center: true,
  })
  router.push('/login')
}
if(sessionStorage.getItem("role")!='USER') {
  ElMessage({
    message: "当前身份无法查看该页面",
    type: 'error',
    center: true,
  })
  router.push('/login')
}

const isDropdownVisible = ref(false)
const isEditing = ref(false)
const editedUser = ref(user)

const recentBooks = ref<Book[]>([
  {
    id: 1,
    title: '三体',
    author: '刘慈欣',
    cover: 'https://placeholder.co/200x300',
    progress: 75
  },
  {
    id: 2,
    title: '活着',
    author: '余华',
    cover: 'https://placeholder.co/200x300',
    progress: 30
  },
  {
    id: 3,
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    cover: 'https://placeholder.co/200x300',
    progress: 90
  }
])

const handleSave = () => {
  if (editedUser.value) {
    userInfoUpdate(user.value).then(res => {
      if (res.data.code === '200') {
        ElMessage({
          message: "登录成功！",
          type: 'success',
          center: true,
        })
      }else {
        ElMessage({
          message: res.data.msg,
          type: 'error',
          center: true,
        })
      }
    isEditing.value = false
    })
  }
}

const handleLogout = () => {
  router.push('/login')
}

function getUserInfo() {
  userInfo(sessionStorage.getItem("username")).then(res => {
    user.value = res.data.data;
  })
}
</script>

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>🍅 番茄书店</h1>
        </div>

        <nav class="nav-menu">
          <a href="#" class="nav-link">首页</a>
          <a href="#" class="nav-link">书库</a>
          <a href="#" class="nav-link">推荐</a>
          <a href="#" class="nav-link">排行榜</a>
        </nav>

        <div v-if="user" class="user-menu" @click="isDropdownVisible = !isDropdownVisible">
          <img :src="user.avatar" :alt="user.name" class="user-avatar">
          <div v-if="isDropdownVisible" class="dropdown-menu">
            <a href="#" class="dropdown-item">个人中心</a>
            <a href="#" class="dropdown-item">我的书架</a>
            <a href="#" class="dropdown-item">设置</a>
            <a href="#" class="dropdown-item" @click="handleLogout">退出登录</a>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-grid">
        <!-- User Profile Section -->
        <div v-if="user" class="profile-card">
          <div class="profile-header">
            <img :src="user.avatar" :alt="user.name" class="profile-avatar">
            <h2>{{ user.name }}</h2>
            <p class="email">{{ user.email }}</p>
          </div>

          <div class="profile-info" v-if="!isEditing">
            <button class="edit-button" @click="isEditing = true">
              编辑资料
            </button>
          </div>

          <div class="profile-edit" v-if="isEditing===true">
            <div class="edit-form">
              <div class="form-group">
                <label>名称</label>
                <input v-model="editedUser.name" type="text">
              </div>
              <div class="form-group">
                <label>邮箱</label>
                <input v-model="editedUser.email" type="email">
              </div>
              <div class="form-group">
                <label>最爱类型</label>
                <input v-model="editedUser.favoriteGenre" type="text">
              </div>
              <div class="button-group">
                <button class="save-button" @click="handleSave">保存</button>
                <button class="cancel-button" @click="isEditing = false">取消</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookshelf Section -->
        <div class="bookshelf-section">
          <div class="section-header">
            <h2>最近阅读</h2>
            <a href="#" class="view-all">查看全部</a>
          </div>

          <div class="books-grid">
            <div v-for="book in recentBooks" :key="book.id" class="book-card">
              <img :src="book.cover" :alt="book.title" class="book-cover">
              <div class="book-info">
                <h3>{{ book.title }}</h3>
                <p class="author">{{ book.author }}</p>
                <div class="progress-bar">
                  <div class="progress" :style="{ width: `${book.progress}%` }"></div>
                </div>
                <span class="progress-text">{{ book.progress }}%</span>
              </div>
            </div>
          </div>

          <div class="recommendations">
            <h2>为你推荐</h2>
            <div class="recommendation-placeholder">
              <p>根据您的阅读喜好，我们为您精选了一些好书...</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
}

.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #e74c3c;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #e74c3c;
}

.user-menu {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  min-width: 150px;
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
  color: #e74c3c;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
}

.profile-header h2 {
  margin: 0;
  color: #2c3e50;
}

.email {
  color: #666;
  margin-top: 0.5rem;
}

.profile-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: center;
}

.stat-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.edit-button {
  width: 100%;
  padding: 0.75rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background: #c0392b;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
}

.save-button, .cancel-button {
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button {
  background: #e74c3c;
  color: white;
}

.save-button:hover {
  background: #c0392b;
}

.cancel-button {
  background: #f8f9fa;
  color: #2c3e50;
}

.cancel-button:hover {
  background: #e9ecef;
}

.bookshelf-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
}

.view-all {
  color: #e74c3c;
  text-decoration: none;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.book-card {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.book-info {
  padding: 1rem;
}

.book-info h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.author {
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.progress-bar {
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  margin: 0.5rem 0;
}

.progress {
  height: 100%;
  background: #e74c3c;
  border-radius: 2px;
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
}

.recommendations {
  margin-top: 3rem;
}

.recommendations h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.recommendation-placeholder {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: #666;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-menu {
    width: 100%;
    justify-content: center;
  }
}
</style>