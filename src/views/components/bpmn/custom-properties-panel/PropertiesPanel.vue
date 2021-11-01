<template>
  <div class="right-board">
    <div class="field-box">
      <el-scrollbar class="right-scrollbar">
        <el-form label-width="90px" v-if="selectedElements.length === 0">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="基本属性" name="1">
              <el-form-item label="流程标识:">{{ workFlow.flowId }}</el-form-item>
              <el-form-item label="流程名称:">{{ workFlow.flowName }}</el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-form>
        <el-form label-width="90px" v-if="selectedElements.length === 1">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="基本属性" name="1">
              <el-form-item label="唯一标识码:">{{ element.id }}</el-form-item>
              <el-form-item label="名称:">
                <el-input v-model="name" placeholder="请输入名称" clearable :style="{width: width}" />
              </el-form-item>
              <el-form-item
                label="到期时间:"
                v-if="selectedElements[0].type != 'bpmn:StartEvent' && selectedElements[0].type != 'bpmn:EndEvent'"
              >
                <el-input
                  v-model="dueDate"
                  placeholder="请输入到期时间"
                  clearable
                  :style="{width: width}"
                />
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item
              title="权限设置"
              name="2"
              v-if="selectedElements[0].type != 'bpmn:EndEvent'"
            >
              <el-form-item label="表单:" v-if="selectedElements[0].type != 'bpmn:EndEvent'">
                <el-select v-model="formKey" placeholder="请选择表单" clearable :style="{width: width}">
                  <el-option
                    v-for="form in formOptions"
                    :key="form.formId"
                    :label="form.formName"
                    :value="form.formId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="分配模式"
                v-if="selectedElements[0].type != 'bpmn:StartEvent' && selectedElements[0].type != 'bpmn:EndEvent'"
              >
                <el-select
                  v-model="pattern"
                  placeholder="请选择分配模式"
                  clearable
                  :style="{width: width}"
                >
                  <el-option
                    v-for="option in patternOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="用户:"
                v-if="selectedElements[0].type != 'bpmn:StartEvent' && selectedElements[0].type != 'bpmn:EndEvent'"
              >
                <el-input
                  v-model="users.userNames"
                  type="textarea"
                  readonly
                  placeholder="请选择用户"
                  clearable
                  :style="{width: width}"
                  @focus="selectUsers"
                />
              </el-form-item>
              <el-form-item
                label="角色:"
                v-if="selectedElements[0].type != 'bpmn:StartEvent' && selectedElements[0].type != 'bpmn:EndEvent' && pattern != 1 && false"
              >
                <el-select
                  v-model="candidateRoles"
                  multiple
                  collapse-tags
                  placeholder="请选择角色"
                  clearable
                  :style="{width: width}"
                >
                  <el-option
                    v-for="role in roleOptions"
                    :key="role.roleId"
                    :label="role.roleName"
                    :value="role.roleId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="部门:"
                v-if="selectedElements[0].type != 'bpmn:StartEvent' && selectedElements[0].type != 'bpmn:EndEvent' && pattern != 1"
              >
                <el-cascader
                  v-model="candidateGroups"
                  :options="deptOptions"
                  :props="defaultProps"
                  placeholder="请选择部门"
                  collapse-tags
                  clearable
                  :style="{ width: width }"
                ></el-cascader>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item
              title="用户任务监听器"
              name="3"
              v-if="selectedElements[0].type != 'bpmn:StartEvent' && selectedElements[0].type != 'bpmn:EndEvent'"
            >
              <el-form-item
                label="监听器:"
                v-if="selectedElements[0].type != 'bpmn:StartEvent' && selectedElements[0].type != 'bpmn:EndEvent'"
              >
                <el-input
                  v-model="taskListenersNames"
                  type="textarea"
                  readonly
                  placeholder="请选择用户任务监听器"
                  clearable
                  :style="{width: width}"
                  @focus="selectListeners(2)"
                />
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item
              title="执行监听器"
              name="4"
              v-if="selectedElements[0].type != 'bpmn:StartEvent' && selectedElements[0].type != 'bpmn:EndEvent'"
            >
              <el-form-item
                label="监听器:"
                v-if="selectedElements[0].type != 'bpmn:StartEvent' && selectedElements[0].type != 'bpmn:EndEvent'"
              >
                <el-input
                  v-model="executionListenersNames"
                  type="textarea"
                  readonly
                  placeholder="请选择执行监听器"
                  clearable
                  :style="{width: width}"
                  @focus="selectListeners(1)"
                />
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-scrollbar>
    </div>
    <SelectUser
      v-if="isVisiable"
      :isVisiable.sync="isVisiable"
      :selectNum="selectNum"
      @chooseUser="handleUser"
    />
    <SelectListener
      v-if="isShow"
      :isShow.sync="isShow"
      :listenerType="listenerType"
      @chooseListener="handleListener"
    />
  </div>
</template>

<script>
import { listFormAll } from "@/api/workflow/form";
import { listRoleAll } from "@/api/system/role";
import { treeselect as treeListDept } from "@/api/system/dept";
import SelectUser from "@/views/components/system/SelectUser";
import SelectListener from "@/views/components/workflow/SelectListener";

const patternList = [
  {
    label: "待选模式",
    value: 0,
  },
  {
    label: "直接指派",
    value: 1,
  },
];
const valueTypeList = [
  {
    label: "class",
    value: 1,
  },
  {
    label: "expression",
    value: 2,
  },
];

export default {
  name: "PropertiesPanel",
  props: {
    modeler: {
      type: Object,
      default: () => ({}),
    },
    workFlow: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { SelectUser, SelectListener },
  data() {
    return {
      //
      activeNames: ["1"],
      //统一宽度
      width: "220px",
      //
      formOptions: [],
      //
      patternOptions: patternList,
      //
      pattern: 0,
      //
      selectNum: undefined,
      // 用户列表
      //userOptions: [],
      // 角色列表
      roleOptions: [],
      //
      defaultProps: {
        multiple: true,
        emitPath: false,
        value: "id",
      },
      //
      deptOptions: [],
      //
      listenerOptions: [],
      // 名称
      name: undefined,
      // 到期时间
      dueDate: undefined,
      // 表单
      formKey: undefined,
      // 用户
      users: {
        userIds: undefined,
        userNames: undefined,
      },
      // 角色
      candidateRoles: undefined,
      // 部门
      candidateGroups: undefined,
      //
      selectedElements: [],
      element: null,
      //
      isVisiable: false,
      //
      isShow: false,
      //
      valueTypeOptions: valueTypeList,
      listenerType: undefined,
      //
      taskListeners: undefined,
      taskListenersNames: undefined,
      //
      executionListeners: undefined,
      executionListenersNames: undefined,
    };
  },
  created() {
    this.getFormList();
    //this.getUserList();
    this.getRoleList();
    this.getDeptListTree();
    this.init();
  },
  watch: {
    name: {
      handler(newVal, oldVal) {
        this.handleProperties("name", newVal);
      },
    },
    dueDate: {
      handler(newVal, oldVal) {
        this.handleProperties("dueDate", newVal);
      },
    },
    formKey: {
      handler(newVal, oldVal) {
        this.handleProperties("formKey", newVal);
      },
    },
    pattern: {
      handler(newVal, oldVal) {
        if (newVal === 0) {
          this.handleProperties("assignee", undefined);
          if (this.users.userIds) {
            this.handleProperties("candidateUsers", this.users.userIds);
          }
        } else if (newVal === 1) {
          this.handleProperties("candidateUsers", undefined);
          if (this.users.userIds) {
            this.handleProperties("assignee", this.users.userIds);
          }
          this.candidateRoles = undefined;
          this.candidateGroups = undefined;
        }
      },
    },
    users: {
      handler(newVal, oldVal) {
        if (this.pattern === 0) {
          this.handleProperties("candidateUsers", newVal.userIds);
        } else if (this.pattern === 1) {
          this.handleProperties("assignee", newVal.userIds);
        }
        this.handleProperties("candidateUsersNames", newVal.userNames);
      },
    },
    candidateRoles: {
      handler(newVal, oldVal) {
        let data = newVal ? newVal.toString() : undefined;
        this.handleProperties("candidateRoles", data);
      },
    },
    candidateGroups: {
      handler(newVal, oldVal) {
        let data = newVal ? newVal.toString() : undefined;
        this.handleProperties("candidateGroups", data);
      },
    },
    taskListeners: {
      handler(newVal, oldVal) {
        //console.log("taskListeners", newVal);
        this.createListeners(newVal);
      },
    },
    executionListeners: {
      handler(newVal, oldVal) {
        //console.log("executionlisteners", newVal);
        this.createListeners(newVal);
      },
    },
  },
  methods: {
    createListeners(data) {
      if (data) {
        const bpmnModeler = this.modeler; //this.bpmnModeler();
        const bpmnFactory = bpmnModeler.get("bpmnFactory");
        let extensionElements = this.element.businessObject.get(
          "extensionElements"
        );
        if (!extensionElements) {
          extensionElements = this.createElement(
            "bpmn:ExtensionElements",
            null,
            this.element,
            bpmnFactory
          );
        }
        const length = extensionElements.get("values").length;

        let type =
          this.listenerType === 1
            ? "activiti:ExecutionListener"
            : "activiti:TaskListener";
        if (length > 0) {
          extensionElements.values = extensionElements
            .get("values")
            .filter((t) => t.$type != type);
        }
        // for (let i = 0; i < length; i++) {
        //   // 清除旧值
        //   extensionElements.get("values").pop();
        // }
        data.forEach((evt) => {
          const executionListener = this.createElement(
            type,
            null,
            this.element,
            bpmnFactory
          );
          executionListener.$attrs["id"] = evt.listenerId;
          executionListener.$attrs["name"] = evt.listenerName;
          executionListener.$attrs["event"] = evt.listenerEvent;
          executionListener.$attrs[
            this.valueTypeOptions.find((t) => t.value === evt.valueType).label
          ] = evt.listenerValue;
          extensionElements.get("values").push(executionListener);
        });

        extensionElements =
          extensionElements.get("values").length > 0
            ? extensionElements
            : undefined;
        const modeling = bpmnModeler.get("modeling");
        modeling.updateProperties(this.element, {
          extensionElements: extensionElements,
        });
      }
    },
    createElement(elementType, properties, parent, factory) {
      var element = factory.create(elementType, properties);
      element.$parent = parent;
      return element;
    },
    handleProperties(property, value) {
      let data = {};
      data[property] = value || undefined;
      //console.log(data);
      this.modeler.get("modeling").updateProperties(this.element, data);
    },
    //获取表单
    getFormList() {
      listFormAll().then((response) => {
        this.formOptions = response.rows;
      });
    },
    //获取用户列表
    // getUserList() {
    //   listUser().then((response) => {
    //     this.userOptions = response.rows;
    //   });
    // },
    //获取角色列表
    getRoleList() {
      listRoleAll().then((response) => {
        //console.log(response);
        this.roleOptions = response.data;
      });
    },
    //获取部门
    getDeptListTree() {
      treeListDept().then((response) => {
        this.deptOptions = response.data;
      });
    },
    init() {
      const { modeler } = this;
      //console.log("modeler -> ", modeler);
      modeler.on("selection.changed", (e) => {
        this.selectedElements = e.newSelection;
        //console.log("selectedElements -> ", this.selectedElements);

        this.element = e.newSelection[0];
        //console.log("element -> ", this.element);

        this.setDefaultProperties();
      });
      modeler.on("element.changed", (e) => {
        const { element } = e;
        const { element: currentElement } = this;
        if (!currentElement) {
          return;
        }
        // update panel, if currently selected element changed
        if (element.id === currentElement.id) {
          this.element = element;
        }
      });
    },
    setDefaultProperties() {
      const { element } = this;
      if (element) {
        const { type, businessObject } = element;
        //console.log("businessObject -> ", businessObject);
        //const { name } = businessObject;
        if (this.verifyIsEvent(type)) {
          this.eventType = businessObject.eventDefinitions
            ? businessObject.eventDefinitions[0]["$type"]
            : "";
          //console.log("eventType ->", this.eventType);
        } else if (this.verifyIsTask(type)) {
          this.taskType = type;
        }
        this.setProperties(businessObject);

        //element["name"] = name;
        //const { name, candidateUsers, candidateGroups } = businessObject;
        //this.name = name;
        //console.log(candidateUsers.split(","));
        // if (candidateUsers) {
        //   this.candidateUsers = candidateUsers.split(",").map(Number);
        // }
        // if (candidateGroups) {
        //   this.candidateGroups = candidateGroups.split(",").map(Number);
        // }
      }
    },
    reSetProperties() {
      this.name = undefined;
      this.dueDate = undefined;
      this.formKey = undefined;
      this.pattern = 0;
      this.users = {
        userIds: undefined,
        userNames: undefined,
      };
      this.candidateRoles = undefined;
      this.candidateGroups = undefined;
      this.taskListeners = undefined;
      this.taskListenersNames = undefined;
      this.executionListeners = undefined;
      this.executionListenersNames = undefined;
    },
    setProperties(businessObject) {
      //console.log(businessObject);
      this.reSetProperties();
      const {
        name,
        dueDate,
        formKey,
        candidateUsers,
        candidateUsersNames,
        assignee,
        candidateRoles,
        candidateGroups,
        extensionElements,
      } = businessObject;
      if (name) {
        this.name = name;
      }
      if (dueDate) {
        this.dueDate = dueDate;
      }
      if (formKey) {
        this.formKey = Number(formKey);
      }
      if (candidateUsers) {
        this.pattern = 0;
        this.users.userIds = candidateUsers;
      }
      if (assignee) {
        this.pattern = 1;
        this.users.userIds = assignee;
      }
      this.users.userNames = candidateUsersNames;
      if (candidateRoles) {
        this.candidateRoles = candidateRoles.split(",").map(Number);
      }
      if (candidateGroups) {
        this.candidateGroups = candidateGroups.split(",").map(Number);
      }
      if (extensionElements) {
        //console.log(extensionElements);

        let arrayExtension = new Array();
        extensionElements.get("values").forEach((item) => {
          if (item.$type === "activiti:ExecutionListener") {
            arrayExtension.push(item.$attrs.name);
          }
        });
        this.executionListenersNames = arrayExtension.join(",");

        let arrayUser = new Array();
        extensionElements.get("values").forEach((item) => {
          if (item.$type === "activiti:TaskListener") {
            arrayUser.push(item.$attrs.name);
          }
        });
        this.taskListenersNames = arrayUser.join(",");
      }
    },
    verifyIsEvent(type) {
      return type.includes("Event");
    },
    verifyIsTask(type) {
      return type.includes("Task");
    },
    /**
     * 改变控件触发的事件
     * @param { Object } input的Event
     * @param { String } 要修改的属性的名称
     */
    // changeField(event, type) {
    //   //console.log(event);
    //   //console.log(type);
    //   const value = event.target.value;
    //   this.element[type] = value;
    //   let properties = {};
    //   properties[type] = value;
    //   this.updateProperties(properties);
    // },
    updateProperties(properties) {
      const { modeler, element } = this;
      const modeling = modeler.get("modeling");
      modeling.updateProperties(element, properties);
    },
    selectUsers() {
      this.selectNum = this.pattern === 1 ? "single" : "multiple";
      this.isVisiable = true;
    },
    handleUser(value) {
      this.users = value;
    },
    selectListeners(type) {
      this.listenerType = type;
      this.isShow = true;
    },
    handleListener(value) {
      //console.log(value);
      let listenerNames = value.map((item) => item.listenerName).toString();
      if (this.listenerType === 1) {
        this.executionListeners = value;
        this.executionListenersNames = listenerNames;
      } else {
        this.taskListeners = value;
        this.taskListenersNames = listenerNames;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.right-board {
  position: absolute;
  right: 0;
  top: 0;
  width: 400px;
  border-color: rgba(0, 0, 0, 0.09);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 20px;
  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .el-scrollbar {
    height: 100%;
  }
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label {
  font-size: 14px;
}
.node-icon {
  color: #bebfc3;
}
</style>