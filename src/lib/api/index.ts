export async function getSites() {
	// returns array of site objects
	const res = await fetch("/api/getSites");
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

export async function getKarigars() {
	const res = await fetch("/api/getKarigars");
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

export async function getClients() {
	const res = await fetch("/api/getClients");
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

export async function addClient(payload: any) {
	const res = await fetch("/api/addClient", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

export async function updateClient(id: string, payload: any) {
	const res = await fetch("/api/updateClient", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id, data: payload }),
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

export async function deleteClient(id: string) {
	const res = await fetch("/api/deleteClient", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id }),
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

export async function addKarigar(payload: any) {
	const res = await fetch("/api/addKarigar", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

export async function updateKarigar(id: string, payload: any) {
	const res = await fetch("/api/updateKarigar", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id, data: payload }),
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

export async function deleteKarigar(id: string) {
	const res = await fetch("/api/deleteKarigar", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id }),
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}
