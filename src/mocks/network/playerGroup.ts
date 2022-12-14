import { Mocker } from "../../core/mocker";
import { Mutable } from "../../utilities/mutable";


let playerGroupId = 0;


/**
 * Mock that adds additional configurations to the player group.
 */
export type PlayerGroupMock = Mutable<PlayerGroup>;


/**
 * A mock of OpenRCT2's player group in a multiplayer server.
 * @internal
 */
export function PlayerGroupMocker(template?: Partial<PlayerGroupMock>): PlayerGroupMock
{
	const mock = Mocker<PlayerGroupMock>({
		id: playerGroupId,
		name: `Group ${playerGroupId}`,
		permissions: [],

		...template,
	});
	playerGroupId++;
	return mock;
}