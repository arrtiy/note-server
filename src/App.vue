<template lang="pug">
  #app
    .feature-bar
      button(:class='{active: activeId == 1}', @click='activeId = 1') 增
      button(:class='{active: activeId == 4}', @click='activeId = 4') 查
    .content
      span(v-show='activeId == 1')
        | uid:
        input(type='text', v-model='uid')
      span(v-show='activeId == 1')
        | comment:
        input(type='text', v-model='comment')
      span
        | url:
        input(type='text', v-model='url')
      span
        | xpath:
        input(type='text', v-model='xpath')
      span
        | selected:
        input(type='text', v-model='selected')
      span
        | index:
        input(type='text', v-model='index')
    .operate
      button(@click="submit") 提交
    .database
      table(border="1")
        tr
          td uid
          td url
          td xpath
          td comment
          td updateTime
          td 操作
        tr(v-for="(item, index) in data" :key="index")
          td {{ item.uid }}
          td {{ item.url }}
          td {{ item.xpath }}
          td {{ item.comment }}
          td {{ item.updateTime }}
          td
            button(@click="delDoc(item._id)") 删除
            button(@click="delDoc(item._id)") 修改
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
      selected:'',
      index:'',
      comment:'',
      uid: '',
      data: [],
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
        case 4:
          axios.post(`${url}/filterData`, data).then((data) => {
            this.success('查询成功!')
            let docs = data.data
            this.data = docs
            console.log('lhz docs:', docs)
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
      width 700px
      tr:nth-child(1)
        text-align center
      td
        text-align center
</style>