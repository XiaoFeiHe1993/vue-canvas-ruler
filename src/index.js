import YjRuler from './YjRuler/index.js'

const components = [YjRuler]

const install = function (Vue) {
  components.forEach((component) => {
    if (component.install) {
      Vue.use(component)
    } else if (component.name) {
      Vue.component(component.name, component)
    }
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export { install, YjRuler }
export default {
  install: install,
}
