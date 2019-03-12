Nova.booting((Vue, router) => {
    Vue.component('index-nova-create-or-add', require('./components/IndexField'));
    Vue.component('detail-nova-create-or-add', require('./components/DetailField'));
    Vue.component('form-nova-create-or-add', require('./components/FormField'));
})
