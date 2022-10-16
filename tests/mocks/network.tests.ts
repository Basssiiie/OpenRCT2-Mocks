/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import Mock from "../../src";
import { NetworkMocker } from "../../src/mocks/network/network";


test("All auto-mocked members are overridable", t =>
{
	const hits: string[] = [];
	const mock = NetworkMocker({
		mode: "client",
		numGroups: 5,
		numPlayers: 7,
		defaultGroup: 10,
		groups: [ <PlayerGroup><unknown>{ name: "group" } ],
		players: [ <Player><unknown>{ name: "player" } ],
		currentPlayer: <Player><unknown>{ name: "current" },
		getServerInfo() { hits.push("getServerInfo"); return <ServerInfo><unknown>{}; },
		addGroup() { hits.push("addGroup"); },
		getGroup() { hits.push("getGroup"); return <PlayerGroup><unknown>{}; },
		removeGroup() { hits.push("removeGroup"); },
		getPlayer() { hits.push("getPlayer"); return <Player><unknown>{}; },
		kickPlayer() { hits.push("kickPlayer"); },
		sendMessage() { hits.push("sendMessage"); },
	});

	t.is(mock.mode, "client");
	t.is(mock.numGroups, 5);
	t.is(mock.numPlayers, 7);
	t.is(mock.defaultGroup, 10);
	t.deepEqual(mock.groups, [ { name: "group" } ]);
	t.deepEqual(mock.players, [ { name: "player" } ]);
	t.deepEqual(mock.currentPlayer, { name: "current" });

	mock.getServerInfo();
	mock.addGroup();
	mock.getGroup(1);
	mock.removeGroup(2);
	mock.getPlayer(3);
	mock.kickPlayer(4);
	mock.sendMessage("hello");
	t.deepEqual(hits, [ "getServerInfo", "addGroup", "getGroup", "removeGroup", "getPlayer", "kickPlayer", "sendMessage" ]);
});


test("Network can add group", t =>
{
	const mock = NetworkMocker({ groups: [] });

	t.is(mock.numGroups, 0);
	t.is(mock.groups.length, 0);
	t.deepEqual(mock.groups, []);

	mock.addGroup();

	t.is(mock.numGroups, 1);
	t.is(mock.groups.length, 1);
	const group1 = mock.groups[0];
	t.truthy(group1);

	mock.addGroup();

	t.is(mock.numGroups, 2);
	t.is(mock.groups.length, 2);
	t.is(mock.groups[0], group1);
	t.truthy(mock.groups[1]);
});


test("Network can get group", t =>
{
	const mock = NetworkMocker({groups: [
		Mock.playerGroup({ name: "aa" }),
	]});

	const group = mock.getGroup(0);

	t.truthy(group);

	mock.addGroup();
	t.is(mock.getGroup(0).name, "aa");
	t.truthy(mock.getGroup(1));
	t.not(mock.getGroup(1), mock.getGroup(0));
});


test("Network can remove group", t =>
{
	const mock = NetworkMocker({groups: [
		Mock.playerGroup({ name: "a" }),
		Mock.playerGroup({ name: "b" }),
		Mock.playerGroup({ name: "c" }),
	]});

	t.is(mock.numGroups, 3);

	mock.removeGroup(1);

	t.is(mock.numGroups, 2);
	t.is(mock.groups[0].name, "a");
	t.is(mock.groups[1].name, "c");
});


test("Network can get player", t =>
{
	const mock = NetworkMocker({ players: [
		Mock.player({ name: "a" }),
		Mock.player({ name: "b" })
	]});

	t.is(mock.numPlayers, 2);
	t.is(mock.getPlayer(0).name, "a");
	t.is(mock.getPlayer(1).name, "b");
});


test("Network can remove player", t =>
{
	const mock = NetworkMocker({ players: [
		Mock.player({ name: "a" }),
		Mock.player({ name: "b" }),
		Mock.player({ name: "c" }),
	]});

	t.is(mock.numPlayers, 3);

	mock.kickPlayer(1);

	t.is(mock.numPlayers, 2);
	t.is(mock.players[0].name, "a");
	t.is(mock.players[1].name, "c");
});