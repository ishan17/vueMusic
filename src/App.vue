<template>
	<div id="app">
		<Header></Header>
		<tab></tab>
		<router-view></router-view>
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
