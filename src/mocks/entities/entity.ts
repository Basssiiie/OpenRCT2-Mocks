import { Mocker } from "../../core/mocker";


let entityId = 0;


/**
 * A mock of an entity.
 * @internal
 */
export function EntityMocker(template?: Partial<Entity>): Entity
{
	return Mocker({
		id: (entityId++),
		x: 0,
		y: 0,
		z: 0,

		...template,
	});
}