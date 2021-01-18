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
      :data="tableData"
      style="width: 100%"
      row-key="code"
      border
      ref="table"
      default-expand-all
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
      <el-table-column
        sortable
        align="center"
        width="100"
        prop="status"
        label="状态"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.status === '激活' ? 'success' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="handleAdd(row.code, row.name)"
          >
            添加
          </el-button>
          <el-button type="success" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="组织层级Code" prop="code" hidden>
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="父组织层级Code" prop="parentCode" hidden>
          <el-input v-model="temp.parentCode" />
        </el-form-item>
        <el-form-item
          v-if="temp.parentName !== '' && temp.parentName !== null"
          label="父组织层级"
          prop="parentName"
        >
          <el-input v-model="temp.parentName" :disabled="true" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            v-model="temp.description"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status" hidden>
          <el-input v-model="temp.status" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="temp.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
        <el-button
          type="primary"
          @click="
            dialogStatus === '新增' || dialogStatus === '添加'
              ? createData(dialogStatus)
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
import {
  findAll,
  save,
  update,
  deleteByRecursion,
} from "@/api/departmentLevel";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格数据
      tableData: [],
      //模态框是否显示
      dialogFormVisible: false,
      //模态框类型(新增、添加、更新)
      dialogStatus: "",
      //模态框数据
      temp: {
        code: "",
        parentName: "",
        parentCode: "",
        name: "",
        description: "",
        status: "激活",
        remark: "",
      },
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "change" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询组织层级列表 */
    getList() {
      this.loading = true;
      findAll().then((response) => {
        const { data } = response;
        this.tableData = data;
        this.loading = false;
      });
    },
    resetTemp() {
      this.temp = {
        code: "",
        parentName: "",
        parentCode: "",
        name: "",
        description: "",
        status: "激活",
        remark: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "新增";
      this.dialogFormVisible = true;
      this.temp.parentCode = "-1";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleAdd(code, name) {
      this.resetTemp();
      this.dialogStatus = "添加";
      this.dialogFormVisible = true;
      this.temp.parentCode = code;
      this.temp.parentName = name;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.temp = row;
      this.dialogStatus = "修改";
      this.dialogFormVisible = true;
      this.temp.code = row.code;
      this.temp.parentCode = row.parentCode;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      console.log(row);
      this.$confirm('是否确认删除部门层级："' + row.name + '"?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteByRecursion([row.code]);
        })
        .then(() => {
          this.getList();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
        });
    },
    createData(dialogStatus) {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          save(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: dialogStatus + "成功",
              type: "success",
              duration: 2000,
            });
            this.getList();
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
            this.getList();
          });
        }
      });
    },
  },
};
</script>