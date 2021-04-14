<template>
    <div class="ac-smilie-set-widget">
        <div class="ac-smilie-sets-tab ac-smilies-scrollbar">
            <div class="ac-smilie-set-icon" 
                v-for="(v, k) in smilies" 
                v-bind:key="k"
                v-bind:smilie-set="k" 
                v-bind:class="k==selectedSmilieSet?'ac-selected':''" 
                v-bind:title="k"
                v-on:click="selectedSmilieSet=k"
            >
                <div class="ac-preview" v-bind:style="'background-image: url('+getFirst(v)+')'"></div>
            </div>
        </div>

        <div class="ac-smilie-box ac-smilies-scrollbar">
            <div class="ac-smilie-set"
                v-for="(v, k) in smilies" 
                v-bind:key="k"
                v-bind:smilie-set="k" 
                v-bind:style="k==selectedSmilieSet?'':'display: none'"
            >
                <img class="ac-smilie" 
                    v-for="(v2, k2) in smilies[k]" 
                    v-bind:key="v2"
                    v-bind:src="v2" 
                    v-bind:alt="k2" 
                    v-bind:data-tag="' :'+k2+': '" 
                    v-on:click.stop="onSmlieClick"
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
const $ = require('jquery')

export default Vue.extend({
    name: 'SmilieBox',
    methods: {
        getFirst: function(obj: any) {
            for (let o in obj)
                return obj[o]
        },
        onSmlieClick: function(e) {
            $('#april-comment-input').insert($(e.target).attr('data-tag'))
        },
        defaultSmilieSet: function() {
            for (let o in this.smilies) {
                this.selectedSmilieSet = o
                return
            }
        }
    },
    data: () => {
        return {
            smilies: {},
            selectedSmilieSet: '',
        }
    },
})
</script>


<style lang="scss">
    .ac-smilie-set-widget {
        .ac-smilie-sets-tab {
            width: 100%;
            display: inline-flex;
            /* 	overflow-x: auto; */
            flex-direction: row;
            border-bottom: 2px solid #61616154;
            
            .ac-smilie-set-icon {
                display: inline-flex;
                padding: 5px;
                cursor: pointer;
                margin: 5px;
                opacity: 0.4;
                
                transition: all 0.1s;

                .ac-preview {
                    width: 32px;
                    height: 32px;
                    background-repeat: no-repeat;
                    background-size: contain;
                    /* margin-right: 5px; */
                }
                
                &.ac-selected {
                    opacity: 1 !important;
                    // border-bottom: 3px solid black;
                    transform: translateY(-4px);
                }
            }


        }

        .ac-smilie-box {
            width: 100%;
            height: 250px;
            overflow-y: auto;

            .ac-smilie-set {
                img {
                    cursor:pointer;
                    margin: 2px;
                    min-width: 28px;
                    max-width: 64px;
                    display: inline-block;
                    box-shadow: unset;
                }
            }
        }
        
    }

    .ac-smilies-scrollbar {
        overflow-y: auto;
        overflow-x: auto;

        &::-webkit-scrollbar {
            width: 14px;
            height: 14px;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 2px;
            background: #00000059;
        }

        &::-webkit-scrollbar-track {
            border-radius: 4px;
            background: #cccccc6b;
        }

        &:hover::-webkit-scrollbar-thumb {
            background-color: #0000008c;
        }
    }
</style>
