class GlobalManager {
	constructor() {
		this.tocSel = document.getElementById("TOCSel");
		this.entryField = document.getElementById("EntryField");
		this.searchButton = document.getElementById("SearchButton");
		this.aSearchButton = document.getElementById("ASearchButton");
		this.cSearchButton = document.getElementById("CSearchButton");
		this.URL = 0;
		this.OFFSET = 1;
		this.ENTRIES = 2;
	}
}

const G = new GlobalManager();
const R = new RegulatorNeo();

const header = document.createElement("option");
header. name = "";
header.value = -1;
G.tocSel.appendChild(header);

for (let i = 1; i < preamble.length; i++) {
	const elem = document.createElement("option");
	elem.text = preamble[i][0];
	elem.value = preamble[i][1];
	G.tocSel.appendChild(elem);
}
const elem = document.createElement("option");
elem.disabled = true;
elem.innerHTML = '−・−・−・−・−・−・−・−・−・−';
G.tocSel.appendChild(elem);
for (let i = 1; i < postamble.length; i++) {
	const elem = document.createElement("option");
	elem.text = postamble[i][0];
	elem.value = postamble[i][1];
	G.tocSel.appendChild(elem);
}

G.entryField.addEventListener("keydown", (evt) => {
	if (evt.key === "Enter" && !evt.isComposing) {
		evt.preventDefault();
		indexSearch();
	} else if (evt.key === "Escape") {
		G.entryField.value = "";
	}
	G.entryField.focus();
});

G.entryField.focus();
testConsistency();

function tocChange(val) {
	if (val == -1)  return;
	G.entryField.value = "";
	G.entryField.focus();
	if (G.tocSel.selectedIndex < 4) {
		windowOpen(preamble[G.URL], val, '付録');
	} else {
		windowOpen(postamble[G.URL], val, '付録');
	}
}

function indexSearch() {
	G.tocSel.selectedIndex = 0;
	let target = G.entryField.value;
	target = target.replace(/[ァ-ン]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0x60);
	});
	if (target.match(/^[0-9０-９]+$/)) {
		target = target.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
		windowOpen(contentsIndex[0][G.URL], Math.floor(target / 2) + contentsIndex[0][G.OFFSET], '本文ページ');
	} else {
		let vol = contentsIndex.length - 1;
		while (vol >= 0) {
			for (let entIdx = contentsIndex[vol][G.ENTRIES].length-1; entIdx >=0; entIdx--) {
				if (R.compare(target, contentsIndex[vol][G.ENTRIES][entIdx]) >= 0) {
					windowOpen(contentsIndex[vol][G.URL], (contentsIndex[vol][G.OFFSET]+entIdx), '検索結果');
					return;
				}
			}
			vol--;
		}
	}
}

function aIndexSearch() {
	G.tocSel.authorIndex = 0;
	let target = G.entryField.value;
	target = target.replace(/[ァ-ン]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0x60);
	});
	if (target.match(/^[0-9０-９]+$/)) {
		target = target.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
		windowOpen(contentsIndex[0][G.URL], Math.floor(target / 2) + contentsIndex[0][G.OFFSET], '本文ページ');
	} else {
		let vol = authorIndex.length - 1;
		while (vol >= 0) {
			for (let entIdx = authorIndex[vol][G.ENTRIES].length-1; entIdx >=0; entIdx--) {
				if (R.compare(target, authorIndex[vol][G.ENTRIES][entIdx]) >= 0) {
					windowOpen(authorIndex[vol][G.URL], (authorIndex[vol][G.OFFSET]-entIdx), '古筆筆者名索引');
					return;
				}
			}
			vol--;
		}
	}
}

function cIndexSearch() {
	G.tocSel.categoryIndex = 0;
	let target = G.entryField.value;
	target = target.replace(/[ァ-ン]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0x60);
	});
	if (target.match(/^[0-9０-９]+$/)) {
		target = target.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
		windowOpen(contentsIndex[0][G.URL], Math.floor(target / 2) + contentsIndex[0][G.OFFSET], '本文ページ');
	} else {
		let vol = categoryIndex.length - 1;
		while (vol >= 0) {
			for (let entIdx = categoryIndex[vol][G.ENTRIES].length-1; entIdx >=0; entIdx--) {
				if (R.compare(target, categoryIndex[vol][G.ENTRIES][entIdx]) >= 0) {
					windowOpen(categoryIndex[vol][G.URL], (categoryIndex[vol][G.OFFSET]-entIdx), '内容分類索引');
					return;
				}
			}
			vol--;
		}
	}
}

function windowOpen(url, page, windowType) {
	window.open(url + page, windowType);
	G.entryField.focus();
}

function clearField() {
	G.tocSel.selectedIndex = 0;
	G.entryField.value = "";
	G.entryField.focus();
}

function testConsistency() {
	let value = "";
	for (let vol = 0; vol < contentsIndex.length; vol++) {
		for (let ent = 0; ent < contentsIndex[vol][G.ENTRIES].length; ent++) {
			if (R.compare(value, contentsIndex[vol][G.ENTRIES][ent]) > 0) {
				console.log(`${value} : ${contentsIndex[vol][G.ENTRIES][ent]}`);
			}
			value = contentsIndex[vol][G.ENTRIES][ent];
		}
	}
	value = "";
	for (let vol = 0; vol < authorIndex.length; vol++) {
		for (let ent = 0; ent < authorIndex[vol][G.ENTRIES].length; ent++) {
			if (R.compare(value, authorIndex[vol][G.ENTRIES][ent]) > 0) {
				console.log(`${value} : ${authorIndex[vol][G.ENTRIES][ent]}`);
			}
			value = authorIndex[vol][G.ENTRIES][ent];
		}
	}
	value = "";
	for (let vol = 0; vol < categoryIndex.length; vol++) {
		for (let ent = 0; ent < categoryIndex[vol][G.ENTRIES].length; ent++) {
			if (R.compare(value, categoryIndex[vol][G.ENTRIES][ent]) > 0) {
				console.log(`${value} : ${categoryIndex[vol][G.ENTRIES][ent]}`);
			}
			value = categoryIndex[vol][G.ENTRIES][ent];
		}
	}
}

function iAmBored() {
	G.entryField.value = "";
	G.entryField.focus();
	let volNo = contentsIndex.length - 1;
	while (contentsIndex[volNo][G.ENTRIES].length == 0) {
		volNo--;
	}
	volNo++;
	const randomVol = Math.trunc(Math.random() * volNo);
	const offset = contentsIndex[randomVol][G.OFFSET];
	const randomPage = Math.trunc(Math.random() * contentsIndex[randomVol][G.ENTRIES].length) + offset;
	windowOpen(contentsIndex[randomVol][G.URL], randomPage, '読み物');
}
