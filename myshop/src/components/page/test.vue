<template lang="pug">
div
  p {{str}}
  
</template>

<script>
import comp from '@/components/page/comp.js'
export default {
  name: "HelloWorld",
  data() {
    return {
        str: '1231231231'

    };
  },
  methods:{

      },
      components:{
    comp,
  },
  created(){
    console.log(comp)
  }


  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>


</style>
