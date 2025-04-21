<template>
  <div class="min-h-screen bg-gradient-to-br from-white to-purple-50 p-8">
    <div class="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-6 flex flex-col md:flex-row gap-6 animate-fade-in">
      <!-- 商品封面图 -->
      <div class="w-full md:w-1/2">
        <el-image
            :src="product.cover"
            fit="cover"
            style="width: 100%; height: 300px; border-radius: 1rem; object-fit: cover"
            :preview-src-list="[product.cover]"
        />
      </div>

      <!-- 商品信息 -->
      <div class="w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <h2 class="text-3xl font-bold text-purple-700 mb-2">{{ product.title }}</h2>
          <p class="text-gray-600 mb-4">{{ product.description }}</p>

          <div class="text-lg text-gray-800 mb-2">
            <strong>规格：</strong>
            <el-tag v-for="(spec, idx) in product.specifications" :key="idx" class="mr-2">{{ spec }}</el-tag>
          </div>

          <div class="text-2xl font-bold text-pink-600 mt-4">
            💰 ¥{{ product.price.toFixed(2) }}
          </div>
        </div>

        <div class="mt-6 flex gap-4">
          <el-button type="primary" icon="Back" @click="goBack">返回</el-button>
          <el-button type="success" icon="ShoppingCartFull">加入购物车</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
// import axios from 'axios'

const route = useRoute()
const router = useRouter()
const productId = route.params.id

console.log(productId)

const product = ref({
  id: productId,
  title: '加载中...',
  description: '',
  cover: 'https://via.placeholder.com/600x400?text=Loading',
  price: 0,
  specifications: []
})

// 🧪 模拟数据源（可以替换为 axios 请求）
const mockProducts = [
  {
    id: '101',
    title: '高级 Java 编程',
    description: '深入理解Java核心原理，从基础到进阶全覆盖！',
    cover: 'https://picsum.photos/id/1015/600/400',
    price: 99.99,
    specifications: ['纸质版', '800页', '2024版']
  },
  {
    id: '102',
    title: '前端开发宝典',
    description: '掌握Vue、React、Node全栈开发的实用指南。',
    cover: 'https://picsum.photos/id/1025/600/400',
    price: 129.5,
    specifications: ['电子书', 'PDF', '实战案例']
  }
]

// 🧠 获取商品详情（模拟请求）
onMounted(() => {
  const found = mockProducts.find(p => p.id === productId)
  if (found) {
    product.value = found
  } else {
    ElMessage.error('未找到该商品！')
    goBack()
  }
})

const goBack = () => {
  router.back()
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease;
}
</style>
