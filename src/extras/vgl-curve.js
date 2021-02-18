import { Curve } from 'three';
import { h } from 'vue';
import { name } from '../types';
import { validateName } from '../validators';

/**
 * An abstract base component for representing a curve, corresponding
 * [THREE.Curve](https://threejs.org/docs/index.html#api/extras/core/Curve).
 */
export default {
  inject: {
    vglNamespace: {
      default() { throw new Error('VueGL components must be wraped by VglNamespace component.'); },
    },
  },
  props: {
    /** Name of the component. */
    name: { type: name, required: true, validator: validateName },
  },
  computed: {
    /** The THREE.Curve instance. */
    inst: () => new Curve(),
  },
  beforeUnmount() {
    if (this.name !== undefined) this.vglNamespace.curves.delete(this.name, this.inst);
  },
  watch: {
    inst: {
      handler(inst) { if (this.name !== undefined) this.vglNamespace.curves.set(this.name, inst); },
      immediate: true,
    },
    name(newName, oldName) {
      if (oldName !== undefined) this.vglNamespace.curves.delete(oldName, this.inst);
      if (newName !== undefined) this.vglNamespace.curves.set(newName, this.inst);
    },
  },
  render() {
    return this.$slots.default ? h('template', this.$slots.default()) : undefined;
  },
};
