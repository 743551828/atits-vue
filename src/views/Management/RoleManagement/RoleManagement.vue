<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <h3>部门层级</h3>
        </div>
        <div class="head-container">
          <el-tree
            :data="departmentLevelData"
            :props="props"
            :expand-on-click-node="false"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>

      <!--用户数据-->
      <el-col :span="20" :xs="24">
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
          <el-table-column sortable prop="name" label="名称"> </el-table-column>
          <el-table-column
            sortable
            prop="description"
            label="描述"
          ></el-table-column>
          <el-table-column sortable prop="createdTime" label="创建时间">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdTime) || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="creator" label="创建人">
            <template slot-scope="scope">
              <span>{{ scope.row.creator || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="departmentLevelName" label="部门层级">
            <template slot-scope="scope">
              <span>{{ scope.row.departmentLevelName || "--" }}</span>
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
      </el-col>
    </el-row>

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="角色code" prop="code" hidden>
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="组织层级" prop="departmentLevelCode">
          <el-cascader
            v-if="dialogStatus == '新增'"
            v-model="departmentLevelCodeList"
            :options="departmentLevelData"
            :props="{ checkStrictly: true, label: 'name', value: 'code' }"
            clearable
            placeholder="请选择部门层级"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
          <el-input v-else v-model="temp.departmentLevelName" disabled />
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
            placeholder="组织层级名称"
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
import { findAll } from "@/api/departmentLevel";
import {
  findByDepartmentLevelCode,
  deleteRole,
  save,
  update,
} from "@/api/role";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      //模态框是否显示
      dialogFormVisible: false,
      //模态框类型(新增、更新)
      dialogStatus: "",
      // 部门层级树选项
      departmentLevelData: undefined,
      // 部门层级名称
      departmentLevelName: undefined,
      departmentLevelCodes: [],
      props: {
        label: "name",
      },
      // 查询参数
      queryParams: {
        departmentLevelCode: "",
        page: 0,
        size: 5,
      },
      temp: {
        code: "",
        status: "激活",
        remark: "",
        name: "",
        description: "",
        departmentLevelCode: "",
      },
      //总条数
      total: 0,
      roleList: [],
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "change" }],
        departmentLevelCode: [
          { required: true, message: "组织层级不能为空", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    departmentLevelCodeList: {
      get() {
        return this.departmentLevelCodes;
      },
      set(newValue) {
        this.departmentLevelCodes = newValue;
        this.temp.departmentLevelCode = newValue[newValue.length - 1];
      },
    },
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
    this.getTreeselect();
  },
  methods: {
    /** 查询部门下拉树结构 */
    getTreeselect() {
      findAll().then((response) => {
        this.departmentLevelData = response.data;
      });
    },
    list() {
      this.loading = true;
      findByDepartmentLevelCode(this.queryParams).then((response) => {
        this.roleList = response.data.data;
        this.total = response.data.count;
        this.loading = false;
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.departmentLevelCode = data.code;
      this.list();
    },
    resetQueryParams() {
      this.queryParams = {
        departmentLevelCode: "",
        page: 0,
        size: 10,
      };
    },
    resetTemp() {
      this.temp = {
        code: "",
        status: "激活",
        remark: null,
        name: "",
        description: "",
        departmentLevelCode: "",
      };
      this.departmentLevelCodes = [];
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
      console.log(row);
      this.$confirm('是否确认删除角色："' + row.name + '"?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteRole([row.code]);
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