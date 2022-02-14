import { defineComponent,reactive,ref, toRaw } from "vue";
import { NButton, NDrawer, NDrawerContent, NSpace, NSpin, NTree } from "naive-ui";
import { getAction, postAction } from "@/api/manage";

export default defineComponent({
    name: 'RolePermissionDrawer',
    emits: ['ok'],
    setup(props, { emit, expose }) {
        // 首页id
        const firstId = '1475678576111116290'
        const url = reactive({
            treeSelect: '/sys/permission/select',
            checked: '/sys/rolePermission/getPermissionIdList',
            save: '/sys/rolePermission/saveBatch'
        })
        const roleId = ref('')
        const treeOptions = ref([])
        const expandedKeys = ref<Array<string>>()
        const checkedKeys = ref<Array<string>>()

        const visible = ref(false)
        const loading = ref(false)

        const loadData = (id:string) => {
            // @ts-ignore
            getAction(url.treeSelect).then((res: Result<any>) => {
                if(res.success) {
                    treeOptions.value = res.result || []
                    getSelected(id)
                }
            })
        }
        const getSelected = (id: string) => {
            // @ts-ignore
            getAction(url.checked, { id: id }).then((res: Result<any>) => {
                if(res.success) {
                    checkedKeys.value = res.result.length > 0 ? res.result : [firstId]
                    expandedKeys.value = res.result || []
                }
            })
        }

        const changeCheckedKeys = (keys: Array<string>) => {
            checkedKeys.value = keys
        }
        const changeExpandedKeys = (keys: Array<string>) => {
            expandedKeys.value = keys
        }

        const updateVisible = (show: boolean) => {
            visible.value = show
        }

        const show = (id:string) => {
            visible.value = true
            roleId.value = id
            loadData(id)
        }
        const close = () => {
            visible.value = false
        }
        const save = () => {
            let saveData = toRaw(checkedKeys.value)
            console.log(saveData)
            loading.value = true
            // @ts-ignore
            postAction(url.save, { roleId: roleId.value, permissionIdList: saveData }).then((res: Result<any>) => {
                if(res.success) {
                    window.$message.success('保存成功')
                } else {
                    window.$message.error(res.message)
                }
            }).finally(() => {
                loading.value = false
                close()
            })
        }

        expose({
            show,
            close
        })

        return () => {
            return (
                <NSpin show={ loading.value }>
                    <NDrawer show={ visible.value }  width='600px' onUpdate:show={ updateVisible }>
                        <NDrawerContent title='角色权限配置' closable>
                            {{
                                default: () => <NTree blockLine checkable data={ treeOptions.value } expandedKeys={ expandedKeys.value } checkedKeys={ checkedKeys.value } onUpdateExpandedKeys={ changeExpandedKeys } onUpdateCheckedKeys={ changeCheckedKeys } />,
                                footer: () => (
                                    <NSpace>
                                        <NButton onClick={ close }>取消</NButton>
                                        <NButton type="success" onClick={ save }>保存</NButton>
                                    </NSpace>
                                )
                            }} 
                        </NDrawerContent>
                    </NDrawer>
                </NSpin>
            )
        }
    }
})