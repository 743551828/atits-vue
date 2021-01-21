<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate()"
      >
        新增
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="roleList"
      style="width: 100%"
      row-key="code"
      border
      ref="table"
    >
      <el-table-column sortable prop="flag" label="标识" width="100px"> </el-table-column>
      <el-table-column sortable prop="name" label="名称"> </el-table-column>
      <el-table-column
        sortable
        prop="description"
        label="描述"
      ></el-table-column>
      <el-table-column sortable prop="type" label="类型"> </el-table-column>
      <el-table-column sortable prop="createdTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdTime) || "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="success" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="queryParams.size"
      @pagination="list"
    />

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="temp.type" placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="标识" prop="flag">
          <el-input v-model="temp.flag" placeholder="请输入标识" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            v-model="temp.description"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="temp.remark"
            placeholder="组织备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
        <el-button
          type="primary"
          @click="
            dialogStatus === '新增' || dialogStatus === '添加'
              ? createData()
              : updateData()
          "
        >
          {{ dialogStatus }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findPage, deletePermission, save, update } from "@/api/permission";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      //模态框是否显示
      dialogFormVisible: false,
      //模态框类型(新增、更新)
      dialogStatus: "",
      props: {
        label: "name",
      },
      // 查询参数
      queryParams: {
        page: 0,
        size: 5,
        sort: [
          {
            sortName: "sortNum",
          },
        ],
      },
      temp: {
        code: "",
        status: "激活",
        remark: "",
        name: "",
        description: "",
        flag: "",
        type: ""
      },
      //总条数
      total: 0,
      roleList: [],
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "change" }],
        flag: [{ required: true, message: "标识不能为空", trigger: "change" }],
        type: [{ required: true, message: "类型不能为空", trigger: "change" }],
      },
    };
  },
  computed: {
    currentPage: {
      get() {
        return this.queryParams.page + 1;
      },
      set(newValue) {
        this.queryParams.page = newValue - 1;
      },
    },
  },
  created() {
    this.list();
  },
  methods: {
    list() {
      this.loading = true;
      findPage(this.queryParams).then((response) => {
        this.roleList = response.data.data;
        this.total = response.data.count;
        this.loading = false;
      });
    },
    resetTemp() {
      this.temp = {
        code: "",
        status: "激活",
        remark: "",
        name: "",
        description: "",
        flag: "",
        type: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "新增";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.temp = row;
      this.dialogStatus = "修改";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      this.$confirm('是否确认删除权限："' + row.name + '"?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deletePermission([row.code]);
        })
        .then(() => {
          this.list();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
        });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          save(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "新增成功",
              type: "success",
              duration: 2000,
            });
            this.list();
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          update(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000,
            });
            this.list();
          });
        }
      });
    },
  },
};
</script>

<style>
</style>