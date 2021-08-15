<template>
    <div class="ac-comment">
        <profile ref="profile" v-bind:owner="owner"></profile>

        <div class="april-comment-widget">
            <!-- 编辑框默认的位置，当回复某个评论时会被临时移动到对应的地方 -->
            <div class="ac-editor-wrapper">
                <comment-editor
                    ref="editor"
                    v-bind:owner="owner"
                    v-bind:is-replying="isReplying"
                    v-bind:mail-required="owner.opt.mailRequired"
                    v-bind:website-required="owner.opt.websiteRequired"
                    v-on:cancel-reply="onCancelReply"
                    v-bind="$attrs"
                ></comment-editor>
            </div>

            <!-- 评论数量显示 -->
            <div class="ac-comment-count" v-show="commentExist()"><span>{{getCommentCount()}}</span></div>

            <!-- 头部页码条(只在非第一页时显示) -->
            <paginator 
                class="ac-paginator-head"
                key="paginator-head"
                v-bind:owner="owner"
                v-bind:flip="true"
                v-show="commentExist() && owner.opt.dualPaginator && pagination_current!=0"
                v-bind:total="pagination_total"
                v-bind:current="pagination_current"
                v-bind:barLength="owner.opt.paginatorLength"
                v-on:pagination-changed="onPaginationChanged"
                v-on:pagination-repeatedly-click="onHeadPaginationRepeatedlyClick"
            ></paginator>

            <!-- 头部页码条的加载动画 -->
            <div class="ac-loading-indicator" v-show="owner.opt.dualPaginator && pagination_current!=0 && showLoadingAnimation">
                正在加载
            </div>

            <!-- 评论列表 -->
            <transition-group 
                name="anim-comment-list" 
                tag="div" 
                class="ac-all-comments"
                v-show="commentExist()"
            >
                <comment 
                    v-for="comment in allComments"
                    v-bind:key="comment.id"
                    v-bind:owner="owner"
                    v-bind:comment="comment"
                    v-bind:smaller-avatar="false"
                    v-on:reply="onClickReply"
                ></comment>
            </transition-group>

            <!-- 底部页码条的加载动画 -->
            <div class="ac-loading-indicator" v-show="showLoadingAnimation">
                正在加载
            </div>
            
            <!-- 底部页码条 -->
            <paginator 
                class="ac-paginator-foot"
                key="paginator-foot"
                v-show="commentExist()"
                v-bind:owner="owner"
                v-bind:total="pagination_total"
                v-bind:current="pagination_current"
                v-bind:barLength="owner.opt.paginatorLength"
                v-on:pagination-changed="onPaginationChanged"
                v-on:pagination-repeatedly-click="onFootPaginationRepeatedlyClick"
            ></paginator>

            <div class="ac-no-comment"
                v-show="allComments.length == 0 && !showLoadingAnimation"
            >
                {{owner.lang.no_comment}}
            </div>

            <div class="ac-copyright">
                <a href="https://github.com/innc11/AprilComment" target="_blank">AprilComment</a>
                 v{{appVersion}}, Backend Powered by 
                <a href="https://github.com/lizheming/Waline" target="_blank">Waline</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import commentObject from './CommentObject.vue'
import commentEditor from './CommentEditor.vue'
import profile from './Profile.vue'
import paginator from './Paginator.vue'
import AprilComment from '..'
import CommentModel from '../interface/CommentModel'
import { sanitizeThroughly } from '../utils/Utils'
const $ = require('jquery')

export default Vue.extend({
    name: 'april-comment',
    inheritAttrs: false,
    props: {
        owner: {
            type: AprilComment,
            required: true
        }
    },
    data: () => ({
        appVersion: AprilComment.version(),
        allComments: [] as Array<CommentModel>,   // 所有的评论
        commentCount: 0,                          // 所有的评论数量
        isReplying: false,                        // 是否正在回复评论（是否显示'取消回复'按钮）
        isLoading: false,                         // 是否显示加载动画
        showLoadingAnimation: false,              // 是否真正地显示加载动画
        animationTimer: null,                     // 加载动画延迟显示计时器
        delayTime: 100,                           // 加载动画延迟显示的时间
        replyId: -1,                              // 正在被回复的评论id（和isReplying功能类似）
        replyRootId: -1,                          // 正在被回复的评论的根评论id
        replyNick: '',                            // 正在被回复的评论的昵称
        pagination_total: 0,                      // 总页数
        pagination_current: 0,                    // 当前页数
    }),
    methods: {
        getEditorWidget: function() {
            return this.$refs.editor
        },
        onClickReply: function(e: any) {
            this.isReplying = true

            // 将编辑框移动到被回复的评论下方
            let cid = $(e.target).attr('comment-id')
            let rid = $(e.target).attr('comment-root-id')
            let nick = $(e.target).attr('nick')
            
            let editor = $('.ac-comment-editor')
            let corespondingWrapper = $('#'+cid+' > .ac-comment-frame > .ac-comment-board > .ac-reply-wrapper')
            editor.appendTo(corespondingWrapper)
            $('.ac-cancel-reply').css('display', '')

            // 设置Placeholder
            let object = sanitizeThroughly($('#'+cid+' > .ac-comment-frame > .ac-comment-board > .ac-comment-info > .ac-nick').text())
            let input = $('#april-comment-input')
            input.attr('placeholder', '@ '+object+',')
            input.focus()

            // 取消回复按钮
            let cancelReply = $('.ac-cancel-reply')
            let defaultText = cancelReply.attr('default-text')
            cancelReply.text(defaultText+' ('+object+')')

            this.replyId = cid
            this.replyRootId = rid
            this.replyNick = nick
        },
        onCancelReply: function() {
            this.isReplying = false

            // 将编辑框移回它本来的位置
            let edit = $('.ac-comment-editor')
            let defaultWrapper = $('.ac-editor-wrapper')
            $('.ac-cancel-reply').css('display', 'none')
            edit.appendTo(defaultWrapper)

            // 还原输入框的占位符
            let input = $('#april-comment-input')
            input.attr('placeholder', input.attr('default-placeholder'))

            // 还原取消回复按钮
            let cancelReply = $('.ac-cancel-reply')
            cancelReply.text(cancelReply.attr('default-text'))

            this.replyId = -1
            this.replyRootId = -1
            this.replyNick = ''
        },
        onPaginationChanged: function(num: number) {
            // 切换页时要将编辑框移回去，不然就被Vue吃掉了就没有了
            this.onCancelReply()
            this.pagination_current = num
        },
        onHeadPaginationRepeatedlyClick: function(num: number) {
            $('.ac-paginator-foot').focus()
        },
        onFootPaginationRepeatedlyClick: function(num: number) {
            $('.ac-paginator-head').focus()
        },
        getCommentCount: function() {
            return (this.commentCount > 0)? this.commentCount+' 评论':''
        },
        commentExist: function() {
            return this.commentCount > 0
        }
    },
    updated: function() { // 重新绘制组件
        for (const child of this.$children)
        {
            if(child.name == 'anim-comment-list')
            {
                for (const gchild of child.$children)
                    gchild.$forceUpdate()
            } else {
                child.$forceUpdate()
            }
        }
    },
    watch: {
        pagination_total: function (newV, oldV) {
            if (this.pagination_current > this.pagination_total)
                this.pagination_current = this.pagination_total
        },
        pagination_current: function (newV, oldV) {
            if (this.pagination_current > this.pagination_total)
                this.pagination_current = this.pagination_total

            // 切换页面时需要刷新
            if (newV != oldV)
                this.owner.refresh()
        },
        isLoading: function (newV, oldV) {
            // 计时逻辑：延时打开，瞬时关闭
            if(newV) {
                // 打开计时器
                this.animationTimer = setTimeout(() =>{
                    this.animationTimer = null
                    // 时间到了以后打开加载动画
                    this.showLoadingAnimation = true
                }, this.delayTime)
            } else {
                // 关闭计时器
                if(this.animationTimer!=null) {
                    clearTimeout(this.animationTimer)
                    this.animationTimer = null
                }
                // 立即关闭加载动画
                this.showLoadingAnimation = newV
            }
        }
    },
    components: {
        'comment': commentObject,
        'comment-editor': commentEditor,
        'paginator': paginator,
        'profile': profile
    }
})
</script>

<style lang="scss">
    @import "../index.scss";
    .april-comment-widget {
        transition: all 0.3s, opacity 0.1s;

        .ac-comment-count {
            @extend %april-comment-text;
            padding: 5px;
            font-weight: bold;
            font-size: 1.25em;
            text-align: center;
            margin-bottom: 1rem;
        }

        .ac-all-comments {
            padding: 0.5rem;
        }

        .ac-loading-indicator {
            text-align: center;

            &:before {
                content: "";
                box-sizing: border-box;
                display: inline-block;
                width: 30px;
                height: 30px;
                border: 3px solid #a0a0a0;
                border-top-color: transparent;
                border-bottom-color: transparent;
                border-radius: 50%;
                animation: spin 2s infinite linear;
            }

            @keyframes spin
            {
                from { transform: rotate(0deg); }
                to { transform: rotate(1turn); }
            }
        }

        .ac-no-comment {
            @extend %april-comment-text;
            text-align: center;
            font-size: 20px;
            margin: 30px 0;
        }

        .ac-copyright {
            text-align: right;
            box-sizing: border-box;
            line-height: 20px;
            color: #999;
            font-size: 12px;
            padding: 8px 10px;

            a {
                font-weight: bold;
                position: relative;
                cursor: pointer;
                color: #1abc9c;
                text-decoration: none;
                display: inline-block;

                &:hover {
                    color: #f07c3a;
                }
            }
        }

    }

    /* vue 动画 */
    .anim-comment-list-enter-active {
        transition: transform 0.1s;
    }

    .anim-comment-list-enter, 
    .anim-comment-list-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }

    .anim-comment-list-leave-active {
        position: absolute;
    }

</style>
