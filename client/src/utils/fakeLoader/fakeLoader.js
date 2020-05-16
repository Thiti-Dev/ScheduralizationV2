//
// ─── CONF ───────────────────────────────────────────────────────────────────────
//
const NEED_FAKE_LOAD = true;
const FAKE_LOAD_INTERVAL = 2 * 1000; // 2 seconds default
// ────────────────────────────────────────────────────────────────────────────────

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function doFakeLoadIfNeeded() {
	if (NEED_FAKE_LOAD) {
		await sleep(FAKE_LOAD_INTERVAL);
	} else {
		return false;
	}
}

export default doFakeLoadIfNeeded;
