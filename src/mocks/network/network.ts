import { Mocker } from "../../core/mocker";
import { tryAddGet } from "../../utilities/object";
import { Mutable } from "../../utilities/mutable";
import { PlayerMocker } from "./player";
import { PlayerGroupMocker } from "./playerGroup";


/**
 * Mock that adds additional configurations to the network.
 */
export type NetworkMock = Mutable<Network>;


/**
 * A mock of OpenRCT2's network system.
 * @internal
 */
export function NetworkMocker(template?: Partial<NetworkMock>): NetworkMock
{
	const group = PlayerGroupMocker();
	const player = PlayerMocker();
	const mock = Mocker<NetworkMock>({
		mode: "none",
		groups: [ group ],
		players: [ player ],
		currentPlayer: player,
		defaultGroup: 0,
		getServerInfo()
		{
			return { name: "", description: "", greeting: "", providerName: "", providerEmail: "", providerWebsite: "" };
		},
		addGroup()
		{
			const group = PlayerGroupMocker();
			if (this.groups)
			{
				this.groups.push(group);
			}
			else
			{
				this.groups = [ group ];
			}
		},
		getGroup(index: number)
		{
			return (this.groups && this.groups[index]) || <PlayerGroup><unknown>null;
		},
		removeGroup(index: number)
		{
			if (this.groups)
			{
				this.groups.splice(index, 1);
			}
		},
		getPlayer(index: number)
		{
			return (this.players && this.players[index]) || <Player><unknown>null;
		},
		kickPlayer(index: number)
		{
			if (this.players)
			{
				this.players.splice(index, 1);
			}
		},
		sendMessage(): void
		{
			// Don't do anything
		},

		...template,
	});
	tryAddGet(mock, "numPlayers", () => (mock.players) ? mock.players.length : 0);
	tryAddGet(mock, "numGroups", () => (mock.groups) ? mock.groups.length : 0);
	return mock;
}