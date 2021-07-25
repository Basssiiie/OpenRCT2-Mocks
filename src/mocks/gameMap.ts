import { Mocker } from "../core/mocker";


/**
 * Mock that adds additional configurations to the game map.
 */
export interface GameMapMock extends GameMap
{
	entities: Entity[];
	rides: Ride[];
}


/**
 * A mock of a game map.
 * @internal
 */
export function GameMapMocker(template?: Partial<GameMapMock>): GameMapMock
{
	return Mocker<GameMapMock>({
		get numEntities()
		{
			return (this.entities) ? this.entities.length : 0;
		},
		get numRides()
		{
			return (this.rides) ? this.rides.length : 0;
		},
		rides: [],
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
				return <Entity><unknown>null;

			return result;
		},
		getRide(id: number): Ride
		{
			const result = this.rides?.find(r => r.id === id);
			if (!result)
				return <Ride><unknown>null;

			return result;
		},

		...template,
	});
}