<template>
	<div id="app">
		<Header></Header>
		<tab></tab>
		<!-- keep-alive 把路由匹配的组件（页面）缓存到内存中，不用每次切换都重新加载 -->
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
	</div>
</template>

<script type="text/ecmascript-6">
import Header from "components/header/header"
import Tab from "components/tab/tab"

export default {
	components: {
		Header,
		Tab
	}
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">                                                  
// @import "~common/stylus/variable"
</style>
