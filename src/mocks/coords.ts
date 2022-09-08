import { Mocker } from "../core/mocker";

/**
 * Simple mock of a coordinates object.
 */
export function CoordsMock(template?: Partial<CoordsXYZD>): CoordsXYZD
{
	const mock = Mocker<CoordsXYZD>({
		x: 0,
		y: 0,
		z: 0,
		direction: 0,

		...template
	});
	return mock;
}