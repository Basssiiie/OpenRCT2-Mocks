import { Mocker } from "../../core/mocker";
import { Writeable } from "../../utilities/writable";


let playerId = 0;


/**
 * Mock that adds additional configurations to the player.
 */
export type PlayerMock = Writeable<Player>;


/**
 * A mock of OpenRCT2's player in a multiplayer server.
 * @internal
 */
export function PlayerMocker(template?: Partial<PlayerMock>): PlayerMock
{
	const mock = Mocker<PlayerMock>({
		id: (playerId++),
		name: "Player",
		group: 0,
		ping: 0,
        commandsRan: 0,
        moneySpent: 0,
        ipAddress: "127.0.0.1",
        publicKeyHash: "",

		...template,
	});
	return mock;
}