<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">用户管理</h1>
        <p class="text-gray-500 mt-1">管理系统用户</p>
      </div>
      <button class="btn-primary" @click="handleAddUser">
        添加用户
      </button>
    </div>

    <!-- User Table -->
    <div class="card-base">
      <div class="overflow-x-auto">
        <table class="table-base">
          <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>姓名</th>
              <th>邮箱</th>
              <th>手机号</th>
              <th>角色</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userList" :key="user.id">
              <td>{{ user.id }}</td>
              <td class="font-medium">{{ user.username }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email || '-' }}</td>
              <td>{{ user.phone || '-' }}</td>
              <td>
                <span 
                  :class="[
                    'px-2 py-1 rounded text-xs font-medium',
                    user.role === 'admin' ? 'bg-primary-50 text-primary' : 'bg-gray-100 text-gray-600'
                  ]"
                >
                  {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                </span>
              </td>
              <td>{{ user.createTime }}</td>
              <td>
                <button
                  class="text-primary hover:text-primary-600 text-sm font-medium mr-3"
                  @click="handleEdit(user)"
                >
                  编辑
                </button>
                <button
                  class="text-error hover:text-error-600 text-sm font-medium"
                  @click="handleDelete(user)"
                >
                  删除
                </button>
              </td>
            </tr>
            <!-- Empty State -->
            <tr v-if="userList.length === 0">
              <td colspan="8" class="text-center py-12">
                <div class="text-gray-400">
                  <span class="text-4xl">👥</span>
                  <p class="mt-2">暂无用户数据</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserInfo } from '@/types'

const userList = ref<Array<UserInfo & { createTime: string }>>([])

/**
 * Load user list (mock data)
 */
const loadUserList = () => {
  userList.value = [
    {
      id: 1,
      username: 'admin',
      name: '管理员',
      role: 'admin',
      email: 'admin@example.com',
      phone: '13800138000',
      createTime: '2026-01-01 10:00:00',
    },
    {
      id: 2,
      username: 'user1',
      name: '张三',
      role: 'user',
      email: 'zhangsan@example.com',
      phone: '13800138001',
      createTime: '2026-01-15 14:30:00',
    },
    {
      id: 3,
      username: 'user2',
      name: '李四',
      role: 'user',
      email: 'lisi@example.com',
      phone: '13800138002',
      createTime: '2026-02-01 09:15:00',
    },
  ]
}

const handleAddUser = () => {
  alert('添加用户功能')
}

const handleEdit = (user: any) => {
  alert(`编辑用户：${user.name}`)
}

const handleDelete = (user: any) => {
  if (confirm(`确定要删除用户 ${user.name} 吗？`)) {
    alert('删除成功')
    loadUserList()
  }
}

onMounted(() => {
  loadUserList()
})
</script>
