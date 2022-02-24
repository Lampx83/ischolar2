<template>
  <div>
    <header className="masthead d-flex bg-dark">
      <div className="container text-center my-auto">
        <img src="../assets/images/graduation.svg" width="120" height="120"/>
        <h1 className="ml-3 d-inline font-weight-bold"><strong>iScholar</strong></h1>
        <h4 className="mb-5" id="quote">
          {{ msg }}
        </h4>
        <router-link className="btn btn-primary btn-lg js-scroll-trigger" to="/map">START</router-link>
      </div>
      <div className="overlay"></div>
    </header>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!--<script>-->
<!--var quotes = [-->
<!--  '"<em>All I\'m armed with is research.</em>" - <small>Mike Wallace</small>',-->
<!--  '"<em>Measuring engagement and engaging consumers are two sides of the same coin.</em>" - <small>David Penn</small>',-->
<!--  '"<em>Bad news sells papers. It also sells market research.</em>" - <small>Ben Bernanke</small>',-->
<!--  '"<em>Research is what I\'m doing when I don\'t know what I\'m doing.</em>" - <small>Wernher von Braun</small>',-->
<!--  '"<em>Research is formalized curiosity. It is poking and prying with a purpose.</em>" - <small>Zora Neale Hurston</small>',-->
<!--  '"<em>In much of society, research means to investigate something you do not know or understand.</em>" - <small>Neil Armstrong</small>',-->
<!--  '"<em>I believe in innovation and that the way you get innovation is you fund research and you learn the basic facts.</em>" - <small>Bill Gates</small>',-->
<!--  '"<em>To understand how consumers really think and feel, it is vital to go beyond words.</em>" - <small>Katja Bressette</small>',-->
<!--  '"<em>Research is creating new knowledge.</em>" - <small>Neil Armstrong</small>',-->
<!--  '"<em>Research is about engaging in a conversation with a brand.</em>" - <small>Matthew Rhodes</small>',-->
<!--]-->
<!--var randNumber = Math.floor(Math.random() * quotes.length);-->

<!--$("#quote").innerHTML = quotes[randNumber];-->


<!--// function startMap(length) {-->
<!--//   var result = '';-->
<!--//   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';-->
<!--//   var charactersLength = characters.length;-->
<!--//   for (var i = 0; i < length; i++)-->
<!--//     result += characters.charAt(Math.floor(Math.random() * charactersLength));-->
<!--//-->
<!--//   window.location.href = "./map.html?id=" + result;-->
<!--//-->
<!--// }-->
<!--</script>-->
<style scoped>

.masthead {
  min-height: 30rem;
  position: relative;
  display: table;
  width: 100%;
  padding-top: 8rem;
  padding-bottom: 8rem;
  height: 100vh
}

.masthead h1 {
  font-weight: 500;
  font-size: 4rem;
  color: white;
}

h4 {
  color: whitesmoke;
  padding: 20px;
}

</style>

