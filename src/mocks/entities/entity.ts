import { Mocker } from "../../core/mocker";


let entityId = 0;


/**
 * A mock of an entity.
 * @internal
 */
export function EntityMocker(template?: Partial<Entity>): Entity
{
	return Mocker({
		id: (++entityId),

		...template,
	});
}