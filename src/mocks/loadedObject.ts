import { Mocker } from "../core/mocker";


let objectIndex = 0;


/**
 * A mock of an OpenRCT2 loaded object.
 * @internal
 */
export function LoadedObjectMocker(template?: Partial<LoadedObject>): LoadedObject
{
	return Mocker({
		index: (++objectIndex),

		...template,
	});
}