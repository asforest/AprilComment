<template>
    <div class="ac-smilie-set-widget"
        v-bind:class="draggingInfo.pressing? 'ac-dragging':''"
        v-bind:style="headbarStyle()"
    >
        <div class="ac-smilie-set-headbar"
            v-on:mousedown="onMouseDown"
            v-on:mouseup="onMouseUp"
            v-on:mousemove="onMouseMove"
        >
            <div class="ac-smilie-sets-tab ac-smilies-scrollbar">
                <div class="ac-smilie-set-icon" 
                    v-for="(smilieset, name) in getSmilies()" 
                    v-bind:key="name"
                    v-bind:smilie-set="name" 
                    v-bind:class="name==selectedSmilieSet?'ac-selected':''" 
                    v-bind:title="name"
                    v-on:click="selectedSmilieSet=name"
                >
                    <div class="ac-preview" v-bind:style="'background-image: url('+getCover(smilieset)+')'"></div>
                </div>
            </div>

            <div class="ac-smilie-set-close-button" v-on:click="onClose">
                <div>+</div>
            </div>
        </div>

        <div class="ac-smilie-box ac-smilies-scrollbar">
            <div class="ac-smilie-set"
                v-for="(smilieset, name) in getSmilies()" 
                v-bind:key="name"
                v-bind:smilie-set="name" 
                v-bind:style="name==selectedSmilieSet?'':'display: none'"
            >
                <img class="ac-smilie" 
                    v-for="(smurl, smcode) in getSmilies()[name].smilies" 
                    v-bind:title="smcode"
                    v-bind:key="smurl"
                    v-bind:src="smurl" 
                    v-bind:alt="smcode" 
                    v-bind:data-tag="' :'+smcode+': '" 
                    v-on:click.stop="onSmlieClick"
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AprilComment from '..'
const $ = require('jquery')

export default Vue.extend({
    name: 'SmilieBox',
    methods: {
        getCover: function(smilieset: any) {
            if(smilieset.cover!='') {
                return smilieset.smilies[smilieset.cover]
            } else {
                for (let o in smilieset.smilies)
                    return smilieset.smilies[o]
            }
        },
        onSmlieClick: function(e: any) {
            $('#april-comment-input').insert($(e.target).attr('data-tag'))
        },
        onClose: function() {
            this.$emit('close')
        },
        onMouseDown: function(e: MouseEvent) {
            // console.log('onMouseDown', e.x, e.y)

            this.draggingInfo.x = e.x
            this.draggingInfo.y = e.y
            this.draggingInfo.pressing = true

            this.draggingInfo.winX = this.winPosition.x
            this.draggingInfo.winY = this.winPosition.y

            this.draggingStopTimer = setTimeout(() => {
                this.draggingInfo.pressing = false
            }, 1000);
        },
        onMouseUp: function(e: MouseEvent) {
            // console.log('onMouseUp', e.x, e.y)

            clearTimeout(this.draggingStopTimer)
            
            this.draggingInfo.pressing = false
        },
        onMouseMove: function(e: MouseEvent) {
            // console.log('onMouseMove', e.x, e.y)
            if(this.draggingInfo.pressing)
            {
                let deltaX = e.x - this.draggingInfo.x
                let deltaY = e.y - this.draggingInfo.y
                this.winPosition.x = this.draggingInfo.winX + deltaX
                this.winPosition.y = this.draggingInfo.winY + deltaY

                clearTimeout(this.draggingStopTimer)
                this.draggingStopTimer = setTimeout(() => {
                    this.draggingInfo.pressing = false
                }, 1000);
            }
        },
        headbarStyle: function() {
            let style = 'top: calc(var(--smiliebox-top) + '+this.winPosition.y+'px);'
            return style + 'right: calc(var(--smiliebox-right) - '+this.winPosition.x+'px);'
        },
        getSmilies: function() {
            return this.owner.smilieManager.smiliesData
        }
    },
    updated: function() {
        if(this.selectedSmilieSet == '')
        {
            for (let o in this.getSmilies()) {
                this.selectedSmilieSet = o
                break
            }
        }
    },
    data: () => ({
        selectedSmilieSet: '',
        winPosition: { x: 0, y: 0 },
        draggingInfo: { x:0, y:0, pressing: false, winX: 0, winY:0 },
        draggingStopTimer: null as unknown as NodeJS.Timeout
    }),
    props: {
        owner: {
            type: AprilComment,
            required: true
        },
    }
})
</script>


<style lang="scss">
    .ac-smilie-set-widget {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 103%;
        right: 50px;
        width: 400px;
        height: 300px;
        z-index: 1;

        // border: 1px solid #efefef;
        border-radius: 4px;
        // padding: 4px;
        background: #fff;
        box-shadow: 2px 1px 16px #00000052;
        transition: box-shadow 0.4s;

        max-width: calc(100% - var(--smiliebox-right) * 2);

        &.ac-dragging {
            box-shadow: 2px 1px 10px #000000ea;
            cursor: move;
        }

        .ac-smilie-set-headbar {
            $headbar-radius: 4px;
            height: 32px;
            display: flex;
            flex-direction: row;
            
            border-top-left-radius: $headbar-radius;
            border-top-right-radius: $headbar-radius;
            
            background-color: #cccccc;

            .ac-smilie-sets-tab {
                flex-grow: 1;
                display: inline-flex;
                /*     overflow-x: auto; */
                flex-direction: row;
                // border-bottom: 2px solid #61616154;
                user-select: none;
                
                .ac-smilie-set-icon {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0px 2px;
                    cursor: pointer;
                    width: 48px;
                    // border-radius: 4px;
                    color: #3b3b3b;
                    transition: all 0.1s;

                    &.ac-selected {
                        position: relative;
                        font-weight: bold;
                        
                        background-color: white;
                        border-top-left-radius: $headbar-radius;
                        border-top-right-radius: $headbar-radius;
                    }

                    &:hover:not(.ac-selected) {
                        background-color: #efefef;
                    }

                    .ac-preview {
                        width: 32px;
                        height: 32px;
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: center;
                        // margin-right: 4px;
                    }
                }
            }

            .ac-smilie-set-close-button {
                width: 30px;
                // height: 35px;
                // margin: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: var(--font-monospace);

                // border-radius: 20%;
                
                border-top-right-radius: $headbar-radius;

                &:hover {
                    background-color: #00000059;
                    cursor: pointer;
                }

                div {
                    opacity: 0.8;
                    font-size: 32px;
                    transform: rotateZ(45deg);
                    line-height: 13px;
                    width: 17px;
                    height: 17px;
                    /* background-color: antiquewhite; */
                    font-weight: bold;
                }
            }
        }

        .ac-smilie-box {
            overflow-y: auto;

            .ac-smilie-set {
                img {
                    cursor:pointer;
                    margin: 2px;
                    min-width: 28px;
                    max-width: 64px;
                    display: inline-block;
                    box-shadow: unset;

                    padding: 2px;
                    border-radius: 4px;

                    &:hover {
                        box-shadow: 0px 3px 6px #00000066;
                    }
                }
            }
        }
        
    }

    .ac-smilies-scrollbar {
        overflow-y: auto;
        overflow-x: auto;

        &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
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
