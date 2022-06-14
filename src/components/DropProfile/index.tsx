import {
  DropdownOption,
  NIcon,
  NDropdown,
  NAvatar,
  useDialog,
  useMessage,
} from 'naive-ui'
import { CSSProperties, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { LogoutOutlined } from '@vicons/antd'
import { useUserStore,useSettingsStore } from '@/store'
import avatar from '@/assets/images/avatar.jpg'

export default defineComponent({
  name: 'DropProfile',
  props: {
    inverted: {
      type: Boolean,
    },
  },
  setup(props) {
    const router = useRouter()
    const userStore = useUserStore()
    const settingStore = useSettingsStore()
    const dialog = useDialog()
    const message = useMessage()

    const optionMenus: DropdownOption[] = [
      {
        label: '个人中心',
        key: 'userinfo',
        // icon:
      },
      {
        label: '布局设置',
        key: 'layoutsetting',
      },
      {
        type: 'divider',
        key: 'divider1',
      },
      {
        label: '退出登录',
        key: 'logout',
        icon: () => (
          <NIcon>
            <LogoutOutlined />
          </NIcon>
        ),
      },
    ]

    // methods
    const logout = () => {
      dialog.warning({
        title: '退出登录',
        content: '你确定要退出登录吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          //! 退出登录
          userStore.logout()
        },
        onNegativeClick: () => {
          message.success('你点击了取消！')
        },
      })
    }

    const handleSelect = (key: string) => {
      // console.log(key)
      switch (key) {
        case 'userinfo':
          router.push('/user/profile')
          break
        case 'layoutsetting':
          settingStore.changeSetting({
            key: 'openConfig',
            value: true,
          })
          break
        case 'logout':
          logout()
          break
        default:
          break
      }
    }

    // css
    const imgStyle: CSSProperties = {
      // display: 'inline-block',
      cursor: 'pointer',
      lineHeight: '50px',
      marginTop: '8px',
      marginRight: '20px',
    }

    return () => (
      <span>
        <NDropdown
          inverted={props.inverted}
          trigger="click"
          placement="bottom-start"
          options={optionMenus}
          onSelect={handleSelect}>
          <NAvatar style={imgStyle} round size="medium" src={avatar} />
        </NDropdown>
      </span>
    )
  },
})
