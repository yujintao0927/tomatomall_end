<script setup>
import { ref } from 'vue'
import {router} from '../../router/index';
import { ElMessage } from 'element-plus'


const ads = ref([
  {
    id: 1,
    title: '限时优惠📢',
    content: '全场满100减20，限时促销！',
    image_url: 'https://picsum.photos/seed/ad1/400/200',
    product_id: 101
  },
  {
    id: 2,
    title: '新书上架📚',
    content: '《深入理解JVM》火热上市，点击了解！',
    image_url: 'https://picsum.photos/seed/ad2/400/200',
    product_id: 102
  }
])

const dialogVisible = ref(false)
const editingAd = ref({})

function openAddDialog() {
  editingAd.value = {
    title: '',
    content: '',
    image_url: '',
    product_id: null
  }
  dialogVisible.value = true
}

function openEditDialog(ad) {
  editingAd.value = { ...ad }
  dialogVisible.value = true
}

function saveAd() {
  if (editingAd.value.id) {
    const idx = ads.value.findIndex(ad => ad.id === editingAd.value.id)
    if (idx !== -1) ads.value[idx] = { ...editingAd.value }
    ElMessage.success('广告更新成功')
  } else {
    editingAd.value.id = Date.now()
    ads.value.push({ ...editingAd.value })
    ElMessage.success('广告添加成功')
  }
  dialogVisible.value = false
}

function deleteAd(id) {
  ads.value = ads.value.filter(ad => ad.id !== id)
  ElMessage.success('广告删除成功')
}

function goToProduct(productId) {
  router.push(`/products/${productId}`)
}
</script>

<template>
  <div class="p-8 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 min-h-screen rounded-xl shadow-lg">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-purple-800 flex items-center gap-2">
        <i class="el-icon-picture-outline"></i> 广告管理
      </h2>
      <el-button type="primary" size="large" icon="Plus" @click="openAddDialog">新增广告</el-button>
    </div>

    <el-table :data="ads" border stripe class="rounded-xl shadow-md" style="background-color: white">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="标题">
        <template #default="scope">
          <el-link type="primary" @click="goToProduct(scope.row.product_id)">
            {{ scope.row.title }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" />
      <el-table-column label="图片" width="120">
        <template #default="scope">
          <el-image
              :src="scope.row.image_url"
              style="width: 100px; height: 60px; border-radius: 8px"
              fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column prop="product_id" label="商品ID" width="100" />
      <el-table-column label="操作" width="240">
        <template #default="scope">
          <div class="flex gap-2">
            <el-button size="small" type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteAd(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑广告弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editingAd.id ? '编辑广告 ✏️' : '新增广告 🛒'" width="600px">
      <el-form :model="editingAd" label-width="100px" class="px-2">
        <el-form-item label="标题">
          <el-input v-model="editingAd.title" placeholder="请输入广告标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="editingAd.content" rows="3" placeholder="广告内容" />
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="editingAd.image_url" placeholder="图片地址" />
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input-number v-model="editingAd.product_id" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAd">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<style scoped>
.el-dialog {
  border-radius: 16px;
}

.el-table {
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
}

.el-button {
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: scale(1.05);
}

h2 {
  animation: fadeInDown 0.8s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
