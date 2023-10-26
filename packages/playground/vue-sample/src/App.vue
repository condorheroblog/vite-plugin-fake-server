<script setup lang="ts">
import { ref } from "vue";

const title = ref("---");
const responseTimestamp = ref(0);

function handleFetch() {
	fetch("/vue/mock/hello")
		.then((res) => res.json())
		.then((res) => {
			console.log(res);
			title.value = res.message;
			responseTimestamp.value = res.timestamp;
		});
}
</script>

<template>
	<div class="container">
		<div>
			<h1>
				<a href="https://vuejs.org/" target="_blank"> Vue Doc </a>
			</h1>
			<button @click="handleFetch">fetch</button>
			<h3>
				message {{ title }} <br />
				timestamp: {{ responseTimestamp }}
			</h3>
		</div>
	</div>
</template>

<style scoped>
.container {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
