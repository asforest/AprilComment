<template>
    <div class="ac-smilie-set-widget"
        v-bind:style="headbarStyle()"
    >
        <div class="ac-smilie-set-headbar"
            v-bind:class="draggingInfo.pressing? 'dragging':''"
            v-on:mousedown="onMouseDown"
            v-on:mouseup="onMouseUp"
            v-on:mousemove="onMouseMove"
        >
            <div class="ac-smilie-sets-tab ac-smilies-scrollbar">
                <div class="ac-smilie-set-icon" 
                    v-for="(setcontent, setname) in smilies" 
                    v-bind:key="setname"
                    v-bind:smilie-set="setname" 
                    v-bind:class="setname==selectedSmilieSet?'ac-selected':''" 
                    v-bind:title="setname"
                    v-on:click="selectedSmilieSet=setname"
                >
                    <div class="ac-preview" v-bind:style="'background-image: url('+getFirst(setcontent)+')'"></div>
                    {{setname}}
                </div>
            </div>

            <div class="ac-smilie-set-close-button" v-on:click="onClose">
                <svg t="1620917520533" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1997"><path d="M512 421.490332 331.092592 240.582924C306.351217 215.841549 265.464551 215.477441 240.470996 240.470996 215.303191 265.638801 215.527553 306.037221 240.582924 331.092592L421.490332 512 240.582925 692.907407C215.84155 717.648782 215.477441 758.535449 240.470996 783.529004 265.638801 808.696809 306.037222 808.472446 331.092593 783.417075L512 602.509668 692.907407 783.417075C717.648782 808.15845 758.535449 808.522559 783.529004 783.529004 808.696809 758.361199 808.472446 717.962778 783.417075 692.907407L602.509668 512 783.417076 331.092592C808.158451 306.351217 808.522559 265.464551 783.529004 240.470996 758.361199 215.303191 717.962779 215.527553 692.907408 240.582924L512 421.490332Z" p-id="1998"></path></svg>
            </div>
        </div>

        <div class="ac-smilie-box ac-smilies-scrollbar">
            <div class="ac-smilie-set"
                v-for="(setcontent, setname) in smilies" 
                v-bind:key="setname"
                v-bind:smilie-set="setname" 
                v-bind:style="setname==selectedSmilieSet?'':'display: none'"
            >
                <img class="ac-smilie" 
                    v-for="(smurl, smcode) in smilies[setname]" 
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
        getFirst: function(obj: any) {
            for (let o in obj)
                return obj[o]
        },
        onSmlieClick: function(e: any) {
            $('#april-comment-input').insert($(e.target).attr('data-tag'))
        },
        onClose: function() {
            this.$emit('close')
        },
        defaultSmilieSet: function() {
            for (let o in this.smilies) {
                this.selectedSmilieSet = o
                break
            }
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
            let style = 'top: calc(103% + '+this.winPosition.y+'px);'
            return style + 'right: calc(50px - '+this.winPosition.x+'px);'
        }
    },
    data: () => ({
        selectedSmilieSet: '',
        winPosition: { x: 0, y: 0 },
        draggingInfo: { x:0, y:0, pressing: false, winX: 0, winY:0 },
        draggingStopTimer: null as unknown as NodeJS.Timeout
    }),
    computed: {
        smilies: function() {
            return this.owner.smilieManager.smilies
        }
    },
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
        width: 300px;
        z-index: 1;
        height: 200px;

        border: 1px solid #efefef;
        border-radius: 4px;
        padding: 4px;
        background: #fff;
        box-shadow: 2px 1px 16px #00000052;
        box-sizing: border-box;

        .ac-smilie-set-headbar {
            display: flex;
            flex-direction: row;
            border-radius: 4px;

            &.dragging {
                background-color: #dedede;
            }

            .ac-smilie-sets-tab {
                flex-grow: 1;
                display: inline-flex;
                /*     overflow-x: auto; */
                flex-direction: row;
                // border-bottom: 2px solid #61616154;
                user-select: none;
                
                .ac-smilie-set-icon {
                    display: inline-flex;
                    align-items: center;
                    padding: 0px 2px;
                    cursor: pointer;
                    border-radius: 4px;
                    color: #3b3b3b;
                    transition: all 0.1s;

                    &:not(:last-child) {
                        margin-right: 8px;
                    }

                    &.ac-selected {
                        font-weight: bold;
                    }

                    &:hover {
                        background-color: #00000033;
                    }

                    .ac-preview {
                        width: 24px;
                        height: 24px;
                        background-repeat: no-repeat;
                        background-size: contain;
                        margin-right: 4px;
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

                border-radius: 20%;

                &:hover {
                    background-color: #00000059;
                    cursor: pointer;
                }

                svg {
                    opacity: 0.8;
                }
            }
        }

        .ac-smilie-box {
            overflow-y: auto;
            box-sizing: border-box;

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
