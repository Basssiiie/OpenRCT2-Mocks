import { Mocker } from "../core/mocker";
import * as ArrayHelper from "../utilities/array";
import { tryAddGet } from "../utilities/object";
import { CoordsMock } from "./coords";
import { EntityMocker } from "./entities/entity";
import { RideMocker } from "./ride";
import { TileMocker } from "./tile";
import { TrackIteratorMocker } from "./tracks/trackIterator";


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
	const templateRides = template?.rides;
	const mock = Mocker<GameMapMock>({
		rides: [], // = a default property.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getAllEntities(type: EntityType): any[]
		{
			return (this.entities)
				? this.entities.filter(e => e.type === type)
				: [];
		},
		getEntity(id: number): Entity
		{
			if (!this.entities)
			{
				return EntityMocker();
			}
			return ArrayHelper.tryFind(this.entities, r => r.id === id)
				|| <Entity><unknown>null;
		},
		getRide(id: number): Ride
		{
			if (!this.rides && !templateRides)
			{
				return RideMocker();
			}
			return ArrayHelper.tryFind(this.rides, r => r.id === id)
				|| <Ride><unknown>null;
		},
		getTile(x: number, y: number): Tile
		{
			if (!this.tiles)
			{
				return TileMocker();
			}
			if (Array.isArray(this.tiles))
			{
				const tile = ArrayHelper.tryFind(this.tiles, t => t.x === x && t.y === y);
				return (tile) ? tile : TileMocker({ x, y });
			}
			const tile = this.tiles; // set x,y to required x,y if not set on tile.
			return { x, y, ...(tile as Partial<Tile>) } as Tile;
		},
		getTrackIterator(location: CoordsXY, elementIndex: number): TrackIterator | null
		{
			const position = CoordsMock(location);
			if (this.getTile)
			{
				const element = this.getTile(location.x / 32, location.y / 32).getElement(elementIndex);
				position.z = element.baseZ;
				if (element.type === "track")
				{
					position.direction = element.direction;
				}
			}
			return TrackIteratorMocker({ position });
		},

		...template,
	});
	tryAddGet(mock, "numEntities", () => (mock.entities) ? mock.entities.length : 0);
	tryAddGet(mock, "numRides", () => (mock.rides) ? mock.rides.length : 0);

	return mock;
}