<template>
  <div class="admin-dashboard">
    <el-button type="primary" @click="openDialog()">添加商品</el-button>
    <el-table :data="products" style="width: 100%" stripe>
      <el-table-column prop="title" label="商品名称" width="200" />
      <el-table-column prop="price" label="价格" width="120" />
      <el-table-column prop="rate" label="rate" width="120" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" width="500">
        <template #default="{ row }">
          <el-button type="primary" @click="openDialog(row.id)">编辑</el-button>
          <el-button type="danger" @click="deleteProduct(row.id)">删除</el-button>
          <el-button type="success" @click="openStockPileDialog(row.id)">调整库存</el-button>
          <el-button type="danger" @click="openSpecificationDialog(row.id)">规格说明</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑商品' : '添加商品'">
      <el-form :model="currentProduct" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="currentProduct.title" />
        </el-form-item>
        <el-form-item label="rate">
          <el-input-number v-model="currentProduct.price" :min="0" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="currentProduct.rate" :min="0" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="currentProduct.description" type="textarea" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
              class="upload-demo"
              action="/upload"
              :on-success="handleUploadSuccess"
              :show-file-list="false">
            <el-button type="primary">上传图片</el-button>
          </el-upload>
          <el-image v-if="currentProduct.cover" :src="currentProduct.cover" style="width: 100px; height: 100px;" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProduct">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="stockpileDialogVisible" :title="'调整库存'">
      <el-form :model="currentStockpile" label-width="80px">
        <el-form-item label="库存">
          <el-input v-model="currentStockpile.amount" />
        </el-form-item>
        <el-form-item label="冻结数">
          <el-input-number v-model="currentStockpile.frozen" :min="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="stockpileDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveStockpile()">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="specificationDialogVisible" :title="'规格说明'">
      <el-table :data="products" style="width: 100%" stripe>
        <el-table-column prop="item" label="商品名称" width="200" />
        <el-table-column prop="value" label="价格" width="120" />
      </el-table>
      <template #footer>
        <el-button @click="specificationDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  addProductInfo, delProductInfo,
  getAllProductInfo,
  getProductInfo,
  getStockpile,
  updateProductInfo, updateStockpile
} from "../../api/products.ts";

import {router} from "../../router/index.ts";


if(sessionStorage.getItem("role")!=='ADMIN') {
  ElMessage({
    message: "当前身份无法查看该页面",
    type: 'error',
    center: true,
  })
  router.push('/login')
}

const products = ref([]);

const dialogVisible = ref(false);
const stockpileDialogVisible = ref(false);
const specificationDialogVisible = ref(false);
const isEdit = ref(false);
const currentProduct = ref({ id: null, title: '', price: 0, rate: 0, description: '', cover: '' });
const currentStockpile = ref({ id: null, productId: null, amount: 0, frozen: 0 });
const currentSpecifications = ref([{ id: null, productId: null, item: '', value: ''}]);

const openDialog = (id = null) => {
  if (id) {
    getProductById(id)
    isEdit.value = true;
  } else {
    Object.assign(currentProduct.value, { id: null, title: '', price: 0, rate: 0, description: '', cover: '' });
    isEdit.value = false;
  }
  dialogVisible.value = true;
};


function openSpecificationDialog(id) {
  getProductInfo(Number(id)).then(res => {
    if (res.data.code === '200') {
      console.log("成功");
      console.log(res.data)
      currentSpecifications.value = res.data.data.specifications;
      ElMessage.success('商品规格信息获取成功');
      specificationDialogVisible.value = true
    } else if(res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

function openStockPileDialog(id) {
  getStockpile(Number(id)).then(res => {
    if (res.data.code === '200') {
      console.log("成功");
      console.log(res.data)
      currentStockpile.value = res.data.data
      ElMessage.success('商品库存信息获取成功');
    } else if(res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
  stockpileDialogVisible.value = true;
}


function getProductById(id) {
  getProductInfo(Number(id)).then(res => {
    if (res.data.code === '200') {
      console.log("成功");
      console.log(res.data)
      currentProduct.value = res.data.data;
      ElMessage.success('商品信息获取成功');
    } else if(res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

const allProduct = () => {
  getAllProductInfo().then(res => {
    if (res.data.code === '200') {
      console.log("成功");
      console.log(res.data)
      products.value = res.data.data;
      ElMessage.success('商品信息获取成功');
    } else if(res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

allProduct();

const saveProduct = () => {
  if (isEdit.value) {
    updateProductInfo(currentProduct.value).then(res => {
      if (res.data.code === '200') {
        ElMessage.success('商品信息更新成功');
        dialogVisible.value = false;
        allProduct();
      } else if(res.data.code === '400') {
        ElMessage({
          message: res.data.msg,
          type: 'error',
          center: true,
        })
      }
    })
  } else {
    addProductInfo(currentProduct.value).then(res => {
      if (res.data.code === '200') {
        ElMessage.success('商品添加成功');
        dialogVisible.value = false;
        allProduct();
      } else if(res.data.code === '400') {
        ElMessage({
          message: res.data.msg,
          type: 'error',
          center: true,
        })
      }
    })
  }
  dialogVisible.value = false;
};

function saveStockpile() {
  updateStockpile(currentStockpile.value.productId, currentStockpile.value.amount).then(res => {
    if (res.data.code === '200') {
      ElMessage.success('库存更新成功');
      stockpileDialogVisible.value = false;
    } else if(res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

const deleteProduct = (id) => {
  delProductInfo(id).then(res => {
    if (res.data.code === '200') {
      ElMessage.success('商品已删除');
      allProduct();
    } else if(res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
};

const handleUploadSuccess = (response) => {
  currentProduct.image = response.url;
  ElMessage.success('图片上传成功');
};

// const products = computed(() => productStore.products);
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}
.upload-demo {
  display: flex;
  align-items: center;
}
</style>
