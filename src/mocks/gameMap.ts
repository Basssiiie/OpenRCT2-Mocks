import { Mocker } from "../core/mocker";
import * as ArrayHelper from "../utilities/array";


/**
 * Mock that adds additional configurations to the game map.
 */
export interface GameMapMock extends GameMap
{
	entities: Entity[];
	rides: Ride[];
	tiles: Tile[] | Tile;
}


/**
 * A mock of a game map.
 * @internal
 */
export function GameMapMocker(template?: Partial<GameMapMock>): GameMapMock
{
	const mock = Mocker<GameMapMock>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getAllEntities(type: EntityType): any[]
		{
			return (this.entities)
				? this.entities.filter(e => e.type === type)
				: [];
		},
		getEntity(id: number): Entity
		{
			const result = this.entities?.find(r => r.id === id);
			if (!result)
				throw Error(`Unknown entity id '${id}'; it is not present in the 'entities' list on the 'map' mock.`);

			return result;
		},
		getRide(id: number): Ride
		{
			const result = this.rides?.find(r => r.id === id);
			if (!result)
				throw Error(`Unknown ride id '${id}'; it is not present in the 'rides' list on the 'map' mock.`);

			return result;
		},
		getTile(x: number, y: number): Tile
		{
			if (!this.tiles)
				throw Error(`Unknown tile: 'tile' value is not set on 'map'-mock.`);

			if (Array.isArray(this.tiles))
			{
				const tile = ArrayHelper.tryFind(this.tiles, t => t.x === x && t.y === y);
				if (!tile)
					throw Error(`Unknown tile at position ('${x}', '${y}'); it is not present in the 'tiles' list on the 'map' mock.`);

				return tile;
			}
			const tile = this.tiles; // set x,y to required x,y if not set on tile.
			return { x: x, y: y, ...(tile as Partial<Tile>) } as Tile;
		},

		...template,
	});
	if (!("numEntities" in mock)) // Calculate from 'entities' list if not set.
	{
		Object.defineProperty(mock, "numEntities", {
			configurable: true, enumerable: true,
			get: () => (mock.entities) ? mock.entities.length : 0
		});
	}
	if (!("numRides" in mock)) // Calculate from 'rides' list if not set.
	{
		Object.defineProperty(mock, "numRides", {
			configurable: true, enumerable: true,
			get: () => (mock.rides) ? mock.rides.length : 0
		});
	}
	return mock;
}