<template>
    <div class="nested-field">
        <!-- HEADING -->
        <div class="p-4 text-90 border-b border-40 flex justify-between items-center bg-30">
            <h1 class="font-normal text-xl capitalize">{{__('Create New')}} {{ field.singularLabel }}</h1>
            <div class="flex justify-between items-center">
                <button type="button" @click="hideForm">
                    X
                </button>
            </div>
        </div>
        <!-- HEADING -->

        <!-- ACTUAL FIELDS -->
        <div >
            <component v-for="(subfield, index) in fields"
                       :key="index"
                       :field="subfield"
                       :errors="errors"
                       :resource-name="field.resourceName"
                       :resource-id="field.viaResourceId"
                       :is="'form-' + subfield.component" />
        </div>
        <!-- ACTUAL FIELDS -->

        <!-- Create Button -->
            <div class="bg-30 flex px-8 py-4">
                <button type="button" dusk="create-test-button" class="btn btn-default btn-primary">
                    {{__('Create')}} {{ field.singularLabel }}
                </button>
            </div>
    </div>
</template>

<script>
import { FormField, HandlesValidationErrors } from 'laravel-nova'

export default {
    mixins: [HandlesValidationErrors, FormField],

    props: {
        field: {
            type: Object,
            required: true
        },
        parent: {
            type: Object,
            required: true
        },
        fields: [],
    },


    data() {
        return {
            showDeleteModal: false
        }
    },

    computed: {
        heading() {
            return this.field.heading.replace(/{{(.*?)}}/g, (val, key) => {
                return key === 'index' ? this.index + 1 || '' : key === 'id' ? this.field.resourceId || '' :
                    this.$parent.getFieldValue(this.field.fields.find(field => field.original_attribute === key))
            }).replace(/ - $/, '')
        }
    },

    methods: {
        /**
         * This toggles the visibility of the 
         * content of the related resource
         */
        toggleVisibility() {
            this.field.opened = !this.field.opened
        },

        hideForm(){
            this.debouncer(() => {
                this.$emit('hide-form', true)
            })
        },

        /**
         * Debounce function for the input handler
         */
        debouncer: _.debounce(callback => callback(), 100),
    },

    watch: {
        errors({ errors }) {
            for (let attribute in errors) {
                if (attribute.includes(this.field.attribute)) {
                    this.field.opened = true
                    break
                }
            }
        }
    }
}
</script>
