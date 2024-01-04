<script setup lang="ts">
import { ref } from "vue";

const fetchTitle = ref("---");
const fetchResponseTimestamp = ref(0);
const fetchStatusText = ref("---");

const xhrTitle = ref("---");
const xhrResponseTimestamp = ref(0);
const xhStatusText = ref("---");

function handleFetch() {
	fetch("/http2/hello", { method: "POST", body: JSON.stringify({ method: "Fetch" }) })
		.then((res) => {
			console.log(res);
			fetchStatusText.value = res.statusText;
			return res.json();
		})
		.then((res) => {
			console.log(res);
			fetchTitle.value = res.message;
			fetchResponseTimestamp.value = res.timestamp;
		});
}

function handleXHR() {
	const xhr = new XMLHttpRequest();
	xhr.responseType = "json";
	xhr.open("POST", "/http2/hello", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify({ method: "XHR" }));

	xhr.addEventListener("load", function () {
		console.log(xhr);
		xhStatusText.value = xhr.statusText;
		xhrTitle.value = xhr.response.message;
		xhrResponseTimestamp.value = xhr.response.timestamp;
	});
}
</script>

<template>
	<div class="container">
		<div>
			<h1>HTTPS + HTTP2</h1>
			<div class="space">
				<div style="width: 30vw">
					<button @click="handleFetch" class="btn">Fetch</button>
					<h3>
						statusText: {{ fetchStatusText }} <br />
						message: {{ fetchTitle }} <br />
						timestamp: {{ fetchResponseTimestamp }}
					</h3>
				</div>
				<div style="width: 30vw">
					<button @click="handleXHR" class="btn">XHR</button>
					<h3>
						statusText: {{ xhStatusText }} <br />
						message: {{ xhrTitle }} <br />
						timestamp: {{ xhrResponseTimestamp }}
					</h3>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.container {
	height: 100vh;
	display: flex;
	justify-content: center;
}
.btn {
	padding: 0.3rem 0.6rem;
	margin: 0 2em;
}
.space {
	display: flex;
	gap: 5em;
}
@media screen and (max-width: 900px) {
	.space {
		flex-direction: column;
	}
}
</style>
