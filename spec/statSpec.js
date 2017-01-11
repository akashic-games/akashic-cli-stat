"use strict"

const fs = require("fs");
const path = require("path");
const stat = require("../lib/stat");
const commons = require("@akashic/akashic-cli-commons");

function testWithSize(gamePath, raw, limit) {
	const logger = new commons.ConsoleLogger({ debugLogMethod: msg => { /* do nothing */ } });
	const basepath = path.join(__dirname, gamePath);
	return commons.ConfigurationFile.read(path.join(basepath, "game.json"), logger)
		.then(game => stat.size({ logger, basepath, game, raw, limit }));
}

describe("stat.size dummy game", () => {
	const gamePath = "fixtures/dummyGame1";

	it("you can call size with empty option", done => {
		testWithSize(gamePath, false)
			.then(done, done.fail);
	});

	it("stat size --limit 0", done => {
		testWithSize(gamePath, false, "0")
			.catch(err => expect(err).toBe("file size limit exceeded (650B)"))
			.then(done);
	});

	it("stat size --limit 123", done => {
		testWithSize(gamePath, false, "123")
			.catch(err => expect(err).toBe("file size limit exceeded (527B)"))
			.then(done);
	});

	it("stat size --limit 123B", done => {
		testWithSize(gamePath, false, "123B")
			.catch(err => expect(err).toBe("file size limit exceeded (527B)"))
			.then(done);
	});

	it("stat size --limit 123K", done => {
		testWithSize(gamePath, false, "123K")
			.then(done, done.fail);
	});

	it("stat size --limit 123KB", done => {
		testWithSize(gamePath, false, "123KB")
			.then(done, done.fail);
	});

	it("stat size --limit 123k", done => {
		testWithSize(gamePath, false, "123k")
			.then(done, done.fail);
	});

	it("stat size --limit 123kb", done => {
		testWithSize(gamePath, false, "123kb")
			.then(done, done.fail);
	});

	it("stat size --limit 123M", done => {
		testWithSize(gamePath, false, "123M")
			.then(done, done.fail);
	});

	it("stat size --limit 123MB", done => {
		testWithSize(gamePath, false, "123MB")
			.then(done, done.fail);
	});

	it("stat size --limit 123G", done => {
		testWithSize(gamePath, false, "123G")
			.then(done, done.fail);
	});

	it("stat size --raw", done => {
		testWithSize(gamePath, true)
			.then(done, done.fail);
	});

	it("stat size --limit 123 --raw", done => {
		testWithSize(gamePath, true, "123")
			.catch(err => expect(err).toBe("file size limit exceeded (527B)"))
			.then(done);
	});
});

describe("stat.size with sound and audio", () => {
	const gamePath = "fixtures/dummyGame2";

	it("stat size with empty option", done => {
		testWithSize(gamePath, false)
			.then(done, done.fail);
	});

	it("stat size --limit 0", done => {
		testWithSize(gamePath, false, "0")
			.catch(err => expect(err).toBe("file size limit exceeded (8.43KB)"))
			.then(done);
	});

	it("stat size --limit 64K", done => {
		testWithSize(gamePath, false, "64K")
			.then(done, done.fail);
	});
});

describe("stat.size with incomplete game.json", () => {
	const gamePath = "fixtures/dummyGame3";

	it("stat size without command option", done => {
		testWithSize(gamePath, false)
			.then(done, done.fail);
	});
});

describe("format stat result", () => {
	const expectedText =
		"image: 144B (2%)\n" +
		"text: 0B (0%)\n" +
		"ogg audio: 7.45KB (88%)\n" +
		"aac audio: 4.16KB\n" +
		"script: 494B (6%)\n" +
		"other: 367B (4%)\n" +
		"  game.json: 367B\n" +
		"[*] TOTAL SIZE (using ogg): 8.43KB (8632B)\n" +
		"[ ] TOTAL SIZE (using aac): 5.14KB (5267B)\n";

	it("will output following text", done => {
		let buffer = "";
		const logger = new commons.ConsoleLogger({ debugLogMethod: msg => { buffer += msg + "\n"; } });
		const basepath = path.join(__dirname, "fixtures", "dummyGame2");
		return commons.ConfigurationFile.read(
			path.join(basepath, "game.json"),
			logger
		)
			.then(game => stat.size({ logger, basepath, game, raw: false }))
			.then(() => { expect(buffer).toBe(expectedText); })
			.then(done, done.fail);
	});
});
