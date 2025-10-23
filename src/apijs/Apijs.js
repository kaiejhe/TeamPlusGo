import { createVNode, render } from 'vue'

import Toast from '../components/onShow/Toast.vue'
import Modal from '../components/onShow/Modal.vue'

const instances = new Map()

function mountSingleton(component) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const vnode = createVNode(component)
  render(vnode, container)
  return { container, exposed: vnode.component?.exposed ?? null }
}

function destroySingleton(key) {
  const instance = instances.get(key)
  if (!instance) return

  if (instance.timer) {
    clearTimeout(instance.timer)
  }

  render(null, instance.container)
  document.body.removeChild(instance.container)
  instances.delete(key)
}

function getExposed(key, component) {
  if (!instances.has(key)) {
    const { container, exposed } = mountSingleton(component)
    if (!exposed) {
      console.error(`[Tm] component for "${key}" does not expose any methods.`)
    }

    instances.set(key, { container, exposed, timer: null })
  }

  return instances.get(key).exposed
}

const Tm = {
  showMessage(messageOrOptions, type = 'success', fallbackDuration = 2000) {
    const exposed = getExposed('message', Toast)
    if (!exposed?.open) return

    const options =
      typeof messageOrOptions === 'string'
        ? { message: messageOrOptions, type, duration: fallbackDuration }
        : { duration: fallbackDuration, ...messageOrOptions }

    const instance = instances.get('message')
    if (instance?.timer) {
      clearTimeout(instance.timer)
      instance.timer = null
    }

    exposed.open(options)

    const dismissDelay = options.duration ?? fallbackDuration
    const timer = setTimeout(() => {
      const current = instances.get('message')
      if (current?.timer === timer) {
        destroySingleton('message')
      }
    }, dismissDelay)

    if (instance) {
      instance.timer = timer
    }
  },

  async showModal(options = {}) {
    const exposed = getExposed('modal', Modal)
    if (!exposed?.open) return { confirm: false, cancel: true }

    return exposed.open(options)
  },

  destroy(key) {
    destroySingleton(key)
  }
}

if (typeof window !== 'undefined') {
  window.Tm = Tm
}

export default Tm
