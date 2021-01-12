import YjRuler from '../../src/YjRuler/index.js'

export default {
  title: 'YjRuler',
  components: YjRuler,
}

export const YjRulerProps = (args, { argTypes }) => ({
  components: { YjRuler },
  template: '<YjRuler :width="320" :color="color" :maxValue="maxValue" :minValue="minValue" :defaultValue="defaultValue" :intervalSmall="intervalSmall" :intervalBig="intervalBig" @rulerChangeCallback="rulerChangeCallback" />',
  props: Object.keys(argTypes),
})
YjRulerProps.args = {
  width: 320,
  color: '#0ec68b',
  maxValue: 30000,
  minValue: 1000,
  defaultValue: 6000,
  intervalSmall: 100,
  intervalBig: 1000,
  rulerChangeCallback: (value) => {
    console.log('rulerChangeCallback', value)
  }
}
