<script setup lang="ts">
import { ref , watch} from 'vue'
import { ElMessage } from 'element-plus'
import {Product, StockPile, User} from "../../type";
import {
  addProductInfo, addStockPile,
  delProductInfo,
  getAllProductInfo,
  getProductInfo,
  getStockpile,
  updateProductInfo,
  updateStockpile
} from "../../api/products";
import {userInfo} from "../..//api/user";
import {router} from "../../router";
import {c} from "vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P";


const user = ref<User>()
getUserInfo()
validateUser()
//在加载界面前，先获得用户信息
function getUserInfo() {
  userInfo(sessionStorage.getItem("username")).then(res => {
    user.value = res.data.data;
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
  if(sessionStorage.getItem("role")!='ADMIN') {
    ElMessage({
      message: "当前身份无法查看该页面",
      type: 'error',
      center: true,
    })
    router.push('/login')
  }
}

const productList = ref<Product[]>([])
getProducts()
// const productList = ref([
//   {
//     id: '101',
//     title: '深入理解Java虚拟机',
//     price: 99.5,
//     rate: 9.5,
//     description: 'Java开发者必读经典，全面讲解JVM工作原理',
//     cover: 'https://example.com/covers/jvm.jpg',
//     detail: '本书详细讲解了Java虚拟机的体系结构、内存管理、字节码执行等核心内容',
//     specifications: [
//       { id: '1001', item: '作者', value: '周志明', productId: '101' },
//       { id: '1002', item: '副标题', value: 'JVM高级特性与最佳实践', productId: '101' }
//     ],
//     stock: 100,
//     status: 'on'
//   }
// ])

const editDialogVisible = ref(false)
const editingProduct = ref<Product>()
const editingProductId = ref()
resetEditingProduct()

function resetEditingProduct() {
  editingProduct.value = {
    id: '',
    title: '',
    price: 0,
    rate: 0,
    description: '',
    detail: '',
    cover: '',
    specifications: [],
    stock: 0
  }
}

function getProducts() {
  getAllProductInfo().then(res => {
    productList.value = res.data.data
  })
}

function updateProduct() {
  updateProductInfo(editingProduct.value).then(res => {
    ElMessage.success('修改成功')
  })
}

function addProduct() {
  addProductInfo(editingProduct.value).then(res => {
    editingProduct.value = res.data.data
    console.log(res.data.data)
    console.log(res.data.data.id)
    addStockPile({
      productId: res.data.data.id,
      amount: 0,
      frozen: 0}).then(res => {
      ElMessage.success("库存添加成功")
    })
    ElMessage.success('添加成功')
  })
  getAllProductInfo()
}

function openAddDialog() {
  editDialogVisible.value = true
}

function openEditDialog(id) {
  getProductInfo(Number(id)).then(res => {
    editingProduct.value = res.data.data
    editDialogVisible.value = true
  })
}

function closeProductDialog() {
  editDialogVisible.value = false
  resetEditingProduct()
}

function addSpec() {
  editingProduct.value.specifications.push({ item: '', value: '' })
}

function removeSpec(index) {
  editingProduct.value.specifications.splice(index, 1)
}

function saveProduct() {
  if (editingProduct.value.id) {
    updateProduct()
  } else {
    addProduct()
  }
  editDialogVisible.value = false
  getAllProductInfo()
  resetEditingProduct()
}

const stockDialogVisible = ref(false)
const stock = ref<StockPile>()
resetStock()
function resetStock() {
  stock.value = {
    id: '',
    productId: '',
    amount: 0,
    frozen: 0,
  }
}

function openStockDialog(id) {
  getStockpile(Number(id)).then(res => {
    stock.value = res.data.data
    stockDialogVisible.value = true
  })
}

function closeStockDialog() {
  stockDialogVisible.value = false
  resetStock()
}


function updateStock(id, amount) {
  updateStockpile(Number(id), amount).then(res => {
    console.log(amount)
    ElMessage.success('库存更新成功')
    stockDialogVisible.value = false
  })
}

function deleteProduct(id) {
  delProductInfo(Number(id)).then(res => {
    ElMessage.success('删除成功')
    getProducts()
  })
}


function handleCoverUploadSuccess(response) {
  // 假设后端返回上传后的图片 URL
  this.editingProduct.cover = response.url;
}

function beforeCoverUpload(file) {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    this.$message.error('只能上传图片文件!');
  }
  if (!isLt2M) {
    this.$message.error('图片大小不能超过 2MB!');
  }
  return isImage && isLt2M;
}

</script>

<template>
  <div class="p-10 bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen rounded-xl shadow-xl">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-black text-purple-800 tracking-wider flex items-center gap-2">
        <span>📚 商品管理中心</span>
      </h2>
      <el-button type="primary" size="large" icon="Plus" @click="openAddDialog">新增商品</el-button>
    </div>

    <el-table :data="productList" border stripe class="rounded-xl shadow-lg overflow-hidden">
      <el-table-column prop="id" label="商品ID" width="100" />
      <el-table-column prop="title" label="书名" min-width="150" />
      <el-table-column prop="price" label="价格 (¥)" width="120">
        <template #default="scope">¥ {{ scope.row.price.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="rate" label="评分" width="100"/>
      <el-table-column prop="description" label="简介" min-width="200" />
      <el-table-column label="封面" width="100">
        <template #default="scope">
          <el-image :src="scope.row.cover" style="width: 60px; height: 80px" fit="cover" class="rounded shadow-md" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="340">
        <template #default="scope">
          <div class="flex flex-wrap gap-2 justify-start">
            <el-button size="small" type="primary" @click="openEditDialog(scope.row.id)">编辑</el-button>
            <el-button size="small" type="warning" @click="openStockDialog(scope.row.id)">库存</el-button>
            <el-button size="small" type="danger" @click="deleteProduct(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑商品弹窗 -->
    <el-dialog v-model="editDialogVisible" :title="editingProduct.id ? '编辑商品 ✏️' : '新增商品 🛒'" width="600px" class="rounded-xl">
      <el-form :model="editingProduct" label-width="100px" class="px-4 py-2">
        <el-form-item label="书名">
          <el-input v-model="editingProduct.title" placeholder="请输入书名" clearable />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="editingProduct.price" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="评分">
          <el-input v-model="editingProduct.rate" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" v-model="editingProduct.description" rows="2" placeholder="简要描述此书" />
        </el-form-item>
        <el-form-item label="详情">
          <el-input type="textarea" v-model="editingProduct.detail" rows="3" placeholder="详细介绍内容" />
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload
              class="upload-demo"
              action="http://localhost:8080/api/upload"
              :show-file-list="false"
              :on-success="handleCoverUploadSuccess"
              :before-upload="beforeCoverUpload"
          >
            <img v-if="editingProduct.cover" :src="editingProduct.cover" class="cover-preview" />
            <el-button v-else type="primary">上传封面</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品规格">
          <div v-for="(spec, index) in editingProduct.specifications" :key="index" class="mb-2 flex items-center gap-2">
            <el-input v-model="spec.item" placeholder="属性名 (如 作者)" style="width: 40%" />
            <el-input v-model="spec.value" placeholder="属性值 (如 张三)" style="width: 50%" />
            <el-button icon="Delete" type="danger" @click="removeSpec(index)" circle />
          </div>
          <el-button type="primary" plain @click="addSpec" icon="Plus">新增规格</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeProductDialog">取消</el-button>
        <el-button type="primary" @click="saveProduct">保存</el-button>
      </template>
    </el-dialog>

    <!-- 修改库存弹窗 -->
    <el-dialog v-model="stockDialogVisible" title="🧮 修改库存" width="400px">
      <el-form label-width="100px">
        <el-form-item label="商品 ID">
          <el-input v-model="stock.id" disabled />
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input-number v-model="stock.amount" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="冻结库存">
          <el-text v-model="stock.frozen" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeStockDialog">取消</el-button>
        <el-button type="primary" @click="updateStock(stock.productId, stock)">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>


