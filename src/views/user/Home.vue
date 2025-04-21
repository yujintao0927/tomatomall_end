
<script setup lang="ts">
import { ref , computed} from 'vue'
import {router} from "../../router";
import {userInfo, userInfoUpdate} from "../../api/user.ts";
import {ElMessage} from "element-plus";
import {getAllProductInfo} from "../../api/products";
import {CartItem} from "../../type";
import {
  addProductToCart,
  deleteCartItemById,
  getCartList,
  startPay,
  submitOrder,
  updateQuantity
} from "../../api/shopping";

import {
  provinceAndCityData,
  pcTextArr,
  regionData,
  pcaTextArr,
  codeToText,
} from "element-china-area-data";


const user = ref(
{
  username: 'yujintao',
  name: '于锦涛',
  telephone: '15146705116',
  email: '2879549937@qq.com',
  avatar: 'https://via.placeholder.com/150'
})
//
// getUserInfo();
// validateUser();

const isDropdownVisible = ref(false)
const isEditing = ref(false)
const editedUser = ref(user)

//当前已售卖的所有商品
const products = ref([
  { id: 1, title: '番茄T恤1', price: 99, rate: 10,cover: 'https://via.placeholder.com/150' },
  { id: 2, title: '番茄T恤2', price: 99, rate: 10,cover: 'https://via.placeholder.com/150' },
  { id: 3, title: '番茄T恤3', price: 99, rate: 10,cover: 'https://via.placeholder.com/150' },
])
// getProductInfo();


const cart = ref<CartItem[]>([])
// getCart()

//控制购物车列表是否可见
const cartVisible = ref(false)
//总金额
const totalPrice = computed(() =>
    cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
)
//总物品数
const totalItems = computed(() =>
    cart.value.reduce((count, item) => count + item.quantity, 0)
)


// 模拟：购物车商品 ID 列表
const cartItemIds = ref(['101', '102'])
// 自动提取购物车商品 ID
// const cartItemIds = computed(() => cart.value.map(item => item.id))

// 模拟：地址列表
const selectedRegion = ref([])

// 弹窗控制
const payDialogVisible = ref(false)
const paymentMethod = ref('alipay') // 默认支付宝
const isOrderSubmitted = ref(false)
const paymentForm = ref('')

const order = ref({
  orderId: '',
  username: '',
  totalAmount: 0,
  paymentMethod: '',
  createTime: '',
  status: '',
})

//保存修改的用户信息
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

//退出登录
const handleLogout = () => {
  router.push('/login')
}

//在加载界面前，先获得用户信息
function getUserInfo() {
  userInfo(sessionStorage.getItem("username")).then(res => {
    user.value = res.data.data;
  })
}

//在加载界面前，获得全部商品信息
function getProductInfo() {
  getAllProductInfo().then(res => {
    products.value = res.data.data;
  })
}

//验证用户身份
function validateUser() {
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
}

//将商品添加到购物车
function addToCart(product) {
  const existing = cart.value.find(item => item.productId === product.id)
  if (existing) {
    existing.quantity += 1
    // updateItemQuantity(existing.cartItemId, existing.quantity)
  } else {
    cart.value.push({ ...product, quantity: 1 })
    // addItem(product.id, 1)
  }
}

//将商品移除购物车
function removeFromCart(id) {
  cart.value = cart.value.filter(item => item.id !== id)
  // deleteItem(id)
  // getCart()
}

//支付订单
function payOrder() {
  // startPay(Number(order.value.orderId)).then(res => {
  //   paymentForm.value = res.data.data.paymentForm
  //   document.write(paymentForm.value)
  //   document.forms[0].submit()
  // })
  ElMessage.success('支付成功！')
  cart.value = []
  cartVisible.value = false
  isOrderSubmitted.value = false
  payDialogVisible.value = false
}

function getCart() {
  getCartList().then(res => {
    cart.value = res.data.data;
  })
}
function updateItemQuantity(cartItemId, quantity) {
  updateQuantity(Number(cartItemId), quantity).then(res => {
    if (res.data.code === '200') {
    } else if(res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

function addItem(productId, quantity) {
  addProductToCart(Number(productId), quantity).then(res => {
    cart.value.push(res.data.data)
  })
}

function deleteItem(cartItemId) {
  deleteCartItemById(Number(cartItemId)).then(res => {
    if (res.data.code === '200') {
    } else if(res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

// 打开支付弹窗
function openPayDialog() {
  payDialogVisible.value = true
}

function handleSubmitPay() {
  // submitOrder(cartItemIds, fullAddress, paymentMethod).then(res => {
  //   order.value = res.data.data
  // })
  // payDialogVisible.value = false
  isOrderSubmitted.value = true
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
              <div class="button-group">
                <button class="save-button" @click="handleSave">保存</button>
                <button class="cancel-button" @click="isEditing = false">取消</button>
              </div>
            </div>
          </div>
        </div>

        <div class="shopping-container">
          <!-- 商品展示区 -->
          <div class="product-list">
            <el-card v-for="item in products" :key="item.id" class="product-card" shadow="hover">
              <img :src="item.image" class="product-image" />
              <h3>{{ item.title }}</h3>
              <p class="price">￥{{ item.price }}</p>
              <el-button type="primary" @click="addToCart(item)">加入购物车</el-button>
            </el-card>
          </div>

          <!-- 购物车侧边栏 -->
          <el-drawer v-model="cartVisible" title="购物车" direction="rtl" size="30%">
            <div v-if="cart.length === 0" class="empty-text">购物车为空</div>
            <div v-else class="cart-items">
              <div v-for="item in cart" :key="item.id" class="cart-item">
                <span>{{ item.title }}</span>
                <el-input-number v-model="item.quantity" :min="1" />
                <span class="price">￥{{ item.price * item.quantity }}</span>
                <el-button type="danger" icon="Delete" @click="removeFromCart(item.id)" circle />
              </div>
              <div class="cart-footer">
                <div class="total">总计：￥{{ totalPrice }}</div>
                <el-button type="success" @click="openPayDialog" :disabled="cart.length === 0">立即支付</el-button>
              </div>
            </div>
          </el-drawer>

          <!-- 悬浮购物车按钮 -->
          <el-button class="floating-cart-btn" type="primary" icon="ShoppingCart" @click="cartVisible = true">
            购物车（{{ totalItems }}）
          </el-button>
          <!-- 支付弹窗 -->
          <el-dialog v-model="payDialogVisible" title="确认支付信息">
            <div class="mb-3">
              <el-cascader
                  placeholder="请选择省市区"
                  size="large"
                  :options="pcaTextArr"
                  v-model="selectedRegion">
              </el-cascader>
            </div>

            <div class="mb-3">
              <p>选择支付方式：</p>
              <el-radio-group v-model="paymentMethod">
                <el-radio label="alipay">支付宝</el-radio>
                <el-radio label="wechat">微信</el-radio>
                <el-radio label="credit_card">信用卡</el-radio>
              </el-radio-group>
            </div>

            <template #footer>
              <el-button @click="payDialogVisible = false ">取消</el-button>
              <el-button type="primary" @click="handleSubmitPay">提交订单</el-button>
            </template>
            <div v-if="isOrderSubmitted" class="mt-6 p-4 border rounded shadow">
              <el-descriptions title="订单详情" border :column="2">
                <el-descriptions-item label="订单号">{{ order.orderId }}</el-descriptions-item>
                <el-descriptions-item label="用户名">{{ order.username }}</el-descriptions-item>
                <el-descriptions-item label="支付方式">{{ order.paymentMethod }}</el-descriptions-item>
                <el-descriptions-item label="下单时间">{{ order.createTime }}</el-descriptions-item>
                <el-descriptions-item label="订单金额">￥{{ order.totalAmount }}</el-descriptions-item>
                <el-descriptions-item label="订单状态">{{ order.status }}</el-descriptions-item>
              </el-descriptions>

              <div class="mt-4 text-right">
                <el-button type="success" @click="payOrder">立即支付</el-button>
              </div>
            </div>
          </el-dialog>
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

.shopping-container {
  padding: 2rem;
  background: #f9f9f9;
  min-height: 100vh;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.product-card {
  text-align: center;
  padding: 1rem;
  transition: 0.3s;
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
}

.price {
  font-weight: bold;
  color: #f56c6c;
  margin: 10px 0;
}

.floating-cart-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  gap: 10px;
}

.cart-footer {
  margin-top: 20px;
  text-align: right;
}

.total {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.empty-text {
  text-align: center;
  color: #999;
  padding: 2rem;
}
</style>