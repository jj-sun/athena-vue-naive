import { Ref } from 'vue';
import { RowKey } from 'naive-ui/lib/data-table/src/interface';
import { getAction, deleteAction } from "@/api/manage";

export default function useBaseList(url:any,search:any){

    let checkedRowKeysRef = ref<Array<RowKey>>([])
    let loading = ref(false)
    const pagination = reactive({
        page: 1,
        pageCount: 1,
        pageSize: 10,
        itemCount: 0,
        showSizePicker: true,
        pageSizes: [10,20,30,40],
        prefix: ( { itemCount  }: { itemCount:number } ) => {
            return `共${itemCount}条`
        },
        onUpdatePage: (page: number) => {
            pagination.page = page
            loadData(0)
        },
        onUpdatePageSize: (pageSize: number) => {
            pagination.pageSize = pageSize
            pagination.page = 1
            searchQuery()
        }
    })

    let data = ref<BaseModel[]>([])

    let modalForm = ref()

    const rowKey = (rowData: BaseModel): string => {
        return rowData.id
    }

    const getSearchQuery = () => {
        let params = Object.assign({}, search)
        params.page = pagination.page
        params.pageSize = pagination.pageSize
        return params
    }

    const loadData = (args: number) => {
        loading.value = true
        if(args === 1) {
            pagination.page = 1
        }
        let params = getSearchQuery()
        // @ts-ignore
        getAction(url.list, params).then((r: Result<any>) => {
            if(r.success) {
                data.value = r.result.list
                pagination.itemCount = r.result.totalCount
                pagination.pageCount = r.result.totalPage
            } else {
                window.$message.error(r.message)
            }
            loading.value = false
        })
    }

    const handleAdd = () => {
        modalForm.value.add()
    }

    const edit = (id: string) => {
        //let data = toRaw(rowData)
        modalForm.value.edit(id)
    }
    const handleDelete = (id: string) => {
        // @ts-ignore
        deleteAction(url.delete, { id: id }).then((r: Result<any>) => {
            if(r.success) {
                window.$message.success(r.message)
                reload()
            } else {
                window.$message.error(r.message)
            }
        })
    }
    const handleBatchDelete = () => {
      
      if(checkedRowKeysRef.value.length > 0) {
        let ids = checkedRowKeysRef.value.join()
        // @ts-ignore
        deleteAction(url.deleteBatch, { ids: ids }).then((r: Result<any>) => {
            if(r.success) {
                window.$message.success(r.message)
                reload()
                clearSelected()
            } else {
                window.$message.error(r.message)
            }
        })
      }
    
    }
    const handleCheck = (rowKeys: Array<RowKey>) => {
        checkedRowKeysRef.value =  rowKeys
    }
    const clearSelected = () => {
        checkedRowKeysRef.value.length = 0
    }
    const reload = () => {
        loadData(1)
    }
    const modalFormOk = () => {
        reload()
    }

    const searchQuery = () => {
        loadData(1)
    }


    return {
        checkedRowKeysRef,
        loading,
        pagination,
        data,
        modalForm,
        rowKey,
        getSearchQuery,
        loadData,
        handleAdd,
        edit,
        handleDelete,
        handleBatchDelete,
        handleCheck,
        clearSelected,
        reload,
        modalFormOk,
        searchQuery,
    }

}