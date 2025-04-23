<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {Product} from "../../type";
import {getProductInfo} from "../../api/products";

const route = useRoute()
const router = useRouter()
const productId = route.params.id

const product = ref<Product>()
getProductById(productId)

function getProductById(id) {
  getProductInfo(Number(id)).then(res => {
    if (res.data.code === '200') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
      product.value = res.data.data
    } else {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}


const goBack = () => {
  router.back()
}
</script>


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
            <el-tag v-for="(spec, idx) in product.specifications" :key="idx" class="mr-2"> {{ spec.item }}: {{ spec.value }}</el-tag>
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
