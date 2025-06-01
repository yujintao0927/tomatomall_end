<script setup lang="ts">
import { ref } from 'vue'
import {router} from '../../router/index';
import { ElMessage } from 'element-plus'
import {createAd, delAd, getAd, updateAd} from "../../api/advertisement.ts";
import {Advertisement} from "../../type.ts"
import {get} from "axios";

//获得广告
const ads = ref<Advertisement[]>([])
getAdvertisement()

function getAdvertisement() {
  getAd().then(res => {
    if (res.data.code === '200') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
      ads.value = res.data.data
    } else {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })

}

const dialogVisible = ref(false)
const editingAd = ref<Advertisement>()


function openAddDialog() {
  initEditingAd()
  dialogVisible.value = true
}

function openEditDialog(ad) {
  editingAd.value = { ...ad }
  dialogVisible.value = true
}

function saveAd() {
  if (editingAd.value.id) {
    updateAd(editingAd.value).then(res => {
      if (res.data.code === '200') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
        ElMessage.success("更新成功")
      } else {
        ElMessage({
          message: res.data.msg,
          type: 'error',
          center: true,
        })
      }
    })
  } else {
    createAd(editingAd.value).then(res => {
      if (res.data.code === '200') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
        ElMessage.success('广告添加成功')
      } else {
        ElMessage({
          message: res.data.msg,
          type: 'error',
          center: true,
        })
      }
    })
  }
  dialogVisible.value = false
  getAdvertisement()
}

function deleteAd(id) {
  delAd(Number(id)).then(res => {
      if (res.data.code === '200') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
        ElMessage.success('广告删除成功')
      } else {
        ElMessage({
          message: res.data.msg,
          type: 'error',
          center: true,
        })
      }
  })
  getAdvertisement()
}

function goToProduct(productId) {
  router.push(`/products/${productId}`)
}

function initEditingAd() {
  editingAd.value = {
    id: '',
    title: '',
    content: '',
    imageUrl: '',
    productId: '',
  }
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
          <el-link type="primary" @click="goToProduct(Number(scope.row.productId))">
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
    <el-dialog v-model="dialogVisible" width="600px">
      <el-form :model="editingAd" label-width="100px" class="px-2">
        <el-form-item label="标题">
          <el-input v-model="editingAd.title" placeholder="请输入广告标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="editingAd.content" rows="3" placeholder="广告内容" />
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="editingAd.imageUrl" placeholder="图片地址" />
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input-number v-model="editingAd.productId" :min="1" />
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

