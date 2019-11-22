<template lang="pug">
  #app
    .feature-bar
      button(:class='{active: activeId == 1}', @click='activeId = 1') 增
      button(:class='{active: activeId == 4}', @click='activeId = 4') 查
    .content
      span(v-show='activeId == 1 || activeId == 3')
        | uid:
        input(type='text', v-model.trim='uid')
      span(v-show='activeId !== 2')
        | comment:
        input(type='text', v-model.trim='comment')
      span
        | url:
        input(type='text', v-model.trim='url')
      span
        | xpath:
        input(type='text', v-model.trim='xpath')
      span
        | index:
        input(type='text', v-model.trim='index')
    .operate
      button(@click="submit") 提交
    .database
      table(border="1")
        tr
          td uid
          td url
          td xpath
          td index
          td comment
          td createdAt
          td updatedAt
          td 操作
        tr(v-for="(item, index) in data" :key="index")
          td {{ item.uid }}
          td {{ item.url }}
          td {{ item.xpath }}
          td {{ item.index }}
          td {{ item.comment }}
          td {{ item.createdAt }}
          td {{ item.updatedAt }}
          td
            button(@click="delDoc(item._id)") 删除
            button(@click="update(item, index)" :class="{active: activeBtn == index}") 修改
</template>

<script>
import axios from 'axios'

var url = 'http://172.23.102.172:3000'

export default {
  name: 'app',
  data() {
    return {
      activeId: 1,
      url:'',
      xpath:'',
      index:'',
      comment:'',
      uid: '',
      data: [],
      activeBtn: null,
      cur_id: '',
    }
  },
  created() {
    this.getData()
  },
  methods: {
    success (info) {
      this.$message({
        duration: 1000,
        message: info,
        type: 'success'
      })
    },
    getData() {
      axios.get(`${url}/search`).then((data) => {
        let docs = data.data
        this.data = docs
      })
    },
    delDoc (id) {
      axios.get(`${url}/delete?id=${id}`)
      .then(() => {
        this.success('删除成功!')
        this.getData()
      })
    },
    update (item, index) {
      this.activeId = 3
      this.activeBtn = index
      this.url = item.url
      this.xpath = item.xpath
      this.selected = item.selected
      this.index = item.index
      this.comment = item.comment
      this.uid = item.uid
      this.cur_id = item._id
    },
    getParams () {
      return {
        url: this.url,
        xpath: this.xpath,
        selected: this.selected,
        index: this.index,
        comment: this.comment,
        uid: this.uid,
      }
    },
    submit () {
      let data = this.getParams()
      switch (this.activeId) {
        case 1:
          axios.post(`${url}/add`, data).then(() => {
            this.success('新增成功!')
            this.getData()
          })
          break
        case 3:
          data._id = this.cur_id
          axios.post(`${url}/update`, data).then(() => {
            this.success('更新成功!')
            this.getData()
          })
          break
        case 4:
          axios.post(`${url}/filterData`, data).then((data) => {
            this.success('查询成功!')
            let docs = data.data
            this.data = docs
          })
          break
      }
      return true
    },
  },
  watch: {
    activeId (val) {
      if (val !== 4) {
        this.getData()
      }
    },
  }
}
</script>

<style scoped lang="stylus">
  button
    padding 5px 20px
    margin 10px 20px
    background #409eff
    color white
    border-radius 5px
  .feature-bar
    text-align center
    button
      margin-top 20px
      &.active
        background #f56c6c
  .content
    text-align center
    span
      display inline-block
      with 100px
      margin 10px 0
      input
        padding 5px 10px
        border-radius 5px
        margin auto 10px
  .operate
    text-align center
  .database
    table
      margin 20px auto
      width 900px
      tr:nth-child(1)
        text-align center
      td
        text-align center
        button.active
          background #f56c6c
</style>